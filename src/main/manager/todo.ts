import { IResultDataInfoArray, RemindWayModel, ResultInfo, StatusModel, TodoModel, WeekModel } from "@/common/interface";
import { IpcMainEvent } from "electron";
import { SnowflakeIdv1 } from 'simple-flakeid'
import { DB, getDB } from "../utils/db";
import _ from 'lodash'
import moment, { Moment } from "moment";
import { getAllHaveTodoIds } from "./tip";
import { timeReverse } from "@/common/utils/time";

let snow = new SnowflakeIdv1({ workerId: 1 });
// 默认库
let db = getDB<TodoModel>('todo');
// 已删除库
let remDb = getDB<TodoModel>('remTodo');
// 已完成库
let complateDb = getDB<TodoModel>('complateTodo');

// 过滤TodoModel
export const filterTodoModel = (todo: TodoModel): TodoModel => {
    let keys = Object.keys(todo).filter(m => m.startsWith('_'));
    keys.forEach(key => {
        delete todo[key]
    })
    return todo;
}

/**
 * 根据规则设置提醒时间
 * @param todo 
 */
export const changeRemindInfo = (todo: TodoModel, add: boolean = false) => {
    if (todo.remind) {
        let now = moment();
        if (add) {
            now.add(1, 'day')
        }
        let lastDay = moment().endOf('month').date();
        let time: moment.Moment;
        switch (todo.remind.way) {
            case RemindWayModel.仅一次:
            case RemindWayModel.每年:
                time = moment(todo.remind.ms).set('year', todo.remind.waySetting.year).set('month', todo.remind.waySetting.month - 1).set('date', todo.remind.waySetting.day);
                break;
            case RemindWayModel.每周:
            case RemindWayModel.每天:
                if (todo.remind.way == RemindWayModel.每周) {
                    while (now.weekday() != todo.remind.waySetting.week) {
                        now.add(1, 'day')
                    }
                }
                time = moment(todo.remind.ms).set('year', now.year()).set('month', now.month()).set('date', now.date());
                break;
            case RemindWayModel.每月:
                if (todo.remind.waySetting.day == 0) {
                    // 每月最后一天
                    time = moment(todo.remind.ms).set('year', now.year()).set('month', now.month()).set('date', lastDay);
                } else {
                    time = moment(todo.remind.ms).set('year', now.year()).set('month', now.month()).set('date', todo.remind.waySetting.day);
                    if (time.date() != todo.remind.waySetting.day) {
                        time = moment(todo.remind.ms).set('year', now.year()).set('month', now.month() + 1).set('date', todo.remind.waySetting.day);
                    }
                }
                break;
        }
        if (time) {
            todo.remind.ms = time.toDate().getTime();
            todo.remind.msDate = time.format('YYYY-MM-DD')
            todo.remind.msStr = time.format('YYYY-MM-DD HH:mm:ss')
        }
    }
}

/**
 * 新增Todo
 * @param todo 
 */
export const addTodo = (todo: TodoModel): ResultInfo => {
    todo = filterTodoModel(todo);
    let id = snow.NextId();
    while (db.data.find(m => m.id == id)) {
        id = snow.NextId();
    }
    todo.id = id as number;
    const now = moment();
    todo.createTime = now.unix();
    todo.createDate = now.format('YYYY-MM-DD')
    // 根据规则设置提醒时间
    changeRemindInfo(todo)
    db.insert(todo);
    return ResultInfo.success();
}
/**
 * 还原todo
 */
export const restoreTodo = (id: number): ResultInfo => {
    let model = remDb.data.find(m => m.id == id);
    let index = remDb.data.findIndex(m => m.id == id)
    if (model) {
        model.status = StatusModel.未完成;
        remDb.remove(index)
        db.insert(model)
        return ResultInfo.success();
    }
    return ResultInfo.faild('不存在');
}
/**
 * 删除todo
 * @param id id
 * @returns 
 */
export const delTodo = (id: number): ResultInfo => {
    let tempDb = db;
    let model = db.data.find(m => m.id == id);
    let index = db.data.findIndex(m => m.id == id);
    // 如果没找到去已完成里面找
    if (!model) {
        model = complateDb.data.find(m => m.id == id);
        index = complateDb.data.findIndex(m => m.id == id)
        tempDb = complateDb;
        // 判断删除的时候是最后一次完成的记录
        if (model && model.parentId) {
            let temp = db.data.find(m => m.id == model.parentId);
            if (temp) {
                temp.remind = model.remind;
                delete temp.lastComplateDate;
                db.update();
            }
        }
    }
    if (model) {
        model.status = StatusModel.已删除;
        remDb.insert(model);
        tempDb.remove(index, 1);
        return ResultInfo.success();
    }
    // 处理删除失败的逻辑
    return ResultInfo.faild("删除失败")
}
/**
 * 永久删除todo
 * @param id 
 */
export const permanentDelTodo = (id: number): ResultInfo => {
    let tempDb = remDb;
    let index = remDb.data.findIndex(m => m.id == id);
    // 如果没找到去已完成里面找
    if (index < 0) {
        index = complateDb.data.findIndex(m => m.id == id);
        tempDb = complateDb;
        // 判断删除的时候是最后一次完成的记录
        if (index > -1) {
            let parent = complateDb.data.find(m => m.id == id);
            if (parent.parentId) {
                let temp = db.data.find(m => m.id == parent.parentId);
                if (temp) {
                    temp.remind = parent.remind;
                    delete temp.lastComplateDate;
                    db.update();
                }
            }
        }
    }
    if (index > -1) {
        tempDb.remove(index, 1);
        return ResultInfo.success();
    }
    return ResultInfo.faild("不存在")
}
/**
 * 清空todo
 */
export const clearTodo = (): ResultInfo => {
    remDb.clear();
    return ResultInfo.success();
}
/**
 * 编辑Todo
 * @param todo 
 * @returns 
 */
export const editTodo = (todo: TodoModel): ResultInfo => {
    todo = filterTodoModel(todo);
    changeRemindInfo(todo)
    let index = db.data.findIndex(m => m.id == todo.id);
    if (index > -1) {
        db.change(index, todo, ['id'])
        return ResultInfo.success();
    }
    return ResultInfo.faild('不存在')
}
/**
 * 完成Todo
 * @param id 
 */
export const complateTodo = (id: number): ResultInfo => {
    let model = db.data.find(m => m.id == id);
    let index = db.data.findIndex(m => m.id == id);
    if (model) {
        const now = moment();
        if (!model.remind || model.remind.way == RemindWayModel.仅一次) {
            // 没有提醒时的完成逻辑
            model.status = StatusModel.已完成;
            model.complateTime = now.unix();
            model.complateDate = now.format('YYYY-MM-DD')
            db.remove(index, 1);
            complateDb.insert(model);
            return ResultInfo.success();
        } else {
            let complateModel = _.cloneDeep(model)
            complateModel.status = StatusModel.已完成;
            complateModel.complateTime = now.unix();
            complateModel.complateDate = now.format('YYYY-MM-DD')
            model.id = snow.NextId() as number;
            complateModel.parentId = model.id;
            complateDb.insert(complateModel);
            model.status = StatusModel.未完成;
            model.lastComplateDate = complateModel.complateDate;
            changeRemindInfo(model, true);
            db.update()
        }
    }
    return ResultInfo.faild('不存在')
}
/**
 * 取消完成
 * @param id 
 */
export const cancelComplateTodo = (id: number): ResultInfo => {
    let model = complateDb.data.find(m => m.id == id);
    let index = complateDb.data.findIndex(m => m.id == id);
    if (model) {
        // 没有提醒时的取消完成逻辑
        model.status = StatusModel.未完成;
        delete model.complateTime;
        delete model.complateDate;
        complateDb.remove(index, 1);
        db.insert(model);
        return ResultInfo.success();
    } else {
        // 其他提醒方式
        model = db.data.find(m => m.id == id);
        let complateModel = complateDb.data.find(m => m.parentId == id);
        index = complateDb.data.findIndex(m => m.id == id);
        complateModel.status = model.status;
        delete complateModel.complateTime;
        delete complateModel.complateDate;
        delete complateModel.parentId;
        model = Object.assign(model, complateModel);
        model.status = StatusModel.未完成;
        delete model.lastComplateDate;
        changeRemindInfo(model);
        db.update()
        complateDb.remove(index, 1)
    }
    return ResultInfo.faild('不存在')
}
/**
 * 获取所有Todo
 */
export const getTodo = (): ResultInfo => {
    let allData = db.data.concat(complateDb.data);
    let data = _.chain(allData)
        .filter(m => !m.parentId)
        .sortBy((o) => o.status)
        .sortBy(o => o.lastComplateDate ? 1 : 0)
        .value()
    return ResultInfo.success(data)
}

/**
 * 获取Data数据
 * @param db 从那个库获取数据
 * @returns 
 */
export const getDataList = (db: DB<TodoModel>, date: string = "createDate"): Array<IResultDataInfoArray<TodoModel>> => {
    let data = new Map<string, TodoModel[]>();
    let keys = [];
    db.data.forEach(todo => {
        if (data.has(todo[date])) {
            data.get(todo[date]).push(todo)
        } else {
            data.set(todo[date], [todo])
        }
        if (!keys.includes(todo[date])) {
            keys.push(todo[date])
        }
    })
    keys = keys.sort(timeReverse)
    let result: Array<IResultDataInfoArray<TodoModel>> = [];
    keys.forEach(item => {
        result.push({
            key: item,
            value: data.get(item)
        })
    })
    return result;
}

/**
 * 获取所有已删除列表（按创建时间）
 */
export const getDelList = (): ResultInfo => {
    let data = getDataList(remDb);
    return ResultInfo.success(data);
}

/**
 * 获取所有已完成列表（按完成时间）
 * @returns 
 */
export const getComplateList = (): ResultInfo => {
    let data = getDataList(complateDb, "complateDate");
    return ResultInfo.success(data);
}
/**
 * 获取所有将来时的列表
 */
export const getFutureList = (overdue: boolean = false): ResultInfo => {
    let tempData: TodoModel[];
    if (overdue) {
        tempData = _.chain(db.data).filter(m => m.remind && m.status == StatusModel.已过期未完成).value();
    } else {
        let now = moment().add(1, 'day').set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
        tempData = _.chain(db.data).filter(m => m.remind && m.remind.ms > now.toDate().getTime()).value();
    }

    let data = new Map<string, TodoModel[]>();
    let keys = [];
    tempData.forEach(todo => {
        if (data.has(todo.remind.msDate)) {
            data.get(todo.remind.msDate).push(todo)
        } else {
            data.set(todo.remind.msDate, [todo])
        }
        if (!keys.includes(todo.remind.msDate)) {
            keys.push(todo.remind.msDate)
        }
    })
    keys = keys.sort(timeReverse)
    let result: Array<IResultDataInfoArray<TodoModel>> = [];
    keys.forEach(item => {
        result.push({
            key: item,
            value: data.get(item)
        })
    })
    return ResultInfo.success(result);
}

/**
 * 获取当前日期下所有需要提示的Todo List
 */
export const getCurrentDayTodoList = (time: moment.Moment): ResultInfo => {
    let allData = getTodo().msg as Array<TodoModel>;
    let lastDay = moment().endOf('month').date();
    let data = _.chain(allData).filter(m => m.status == StatusModel.未完成 && m.remind != null)
        .filter(m =>
            m.remind.way == RemindWayModel.每天
            || (m.remind.way == RemindWayModel.每周 && m.remind.waySetting.week == time.weekday())
            || (m.remind.way == RemindWayModel.每年 && m.remind.waySetting.month == time.month() + 1 && m.remind.waySetting.day == time.date())
            || (m.remind.way == RemindWayModel.仅一次 && m.remind.waySetting.year == time.year() && m.remind.waySetting.month == time.month() + 1 && m.remind.waySetting.day == time.date())
            || (m.remind.way == RemindWayModel.每月 && m.remind.waySetting.day == time.date())
            || (m.remind.way == RemindWayModel.每月 && m.remind.waySetting.day == 0 && time.date() == lastDay)
        )
        .filter(m => getAllHaveTodoIds().indexOf(m.id) < 0)
        .value();
    return ResultInfo.success(data);
}

/**
 * 获取当前日期之前所有未完成的数据
 */
export const getOverdueTodoList = (time: moment.Moment): ResultInfo => {
    let allData = getTodo().msg as Array<TodoModel>;
    let data = _.chain(allData).filter(m => m.status == StatusModel.未完成 && m.remind != null && m.remind.ms < time.toDate().getTime() && getAllHaveTodoIds().indexOf(m.id) < 0)
        .value();
    return ResultInfo.success(data);
}

