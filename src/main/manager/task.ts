import { bridgeKey } from "@/common/bridge";
import { RemindWayModel, TodoModel } from "@/common/interface";
import { getNowMomentDate } from "@/common/utils/time";
import { BrowserWindow } from "electron";
import moment from "moment";
import { createTipWindow } from "../utils/window";
import { addTipTodo, clearTipTodo } from "./tip";
import { getCurrentDayTodoList, getOverdueTodoList } from "./todo";
import { broadCast } from "./windows";

let tipWin: BrowserWindow;
// 计时器
let timer;
let refreshDate: string[] = []

/**
 * 计算是否可以提醒了
 * @param list 
 */
const calcTimeByData = (time: moment.Moment, list: Array<TodoModel>): Array<TodoModel> => {
    if (list.length <= 0) return [];
    let data: Array<TodoModel> = [];
    list.forEach(item => {
        let itemTime = moment(item.remind.ms).set('year', time.year()).set('month', time.month()).set('date', time.date())
        let msTime = itemTime.diff(time, 'milliseconds');
        if (msTime <= 0) {
            // 已经超过时间了  可以提醒了
            data.push({
                ...item,
                _extend: {
                    ms: msTime
                }
            })
        }
    })
    return data;
}

/**
 * 检查是否有需要提醒的
 */
const checkToTip = () => {
    // 获取当前时间
    let time = moment();
    // 获取所有的今日任务
    let list = getOverdueTodoList(time).msg as Array<TodoModel>; //getCurrentDayTodoList(time).msg as Array<TodoModel>;
    list = calcTimeByData(time, list)
    if (list && list.length > 0) {
        for (var i in list) {
            let todo = list[i]
            // 开启提醒
            tipWin.webContents.send(bridgeKey.needTip, todo);
            addTipTodo(todo);
        }
    }
}

/**
 * 检查是否是明天了
 */
const checkIsTomorrow = () => {
    let time = getNowMomentDate().format('YYYY-MM-DD');
    if (refreshDate.includes(time)) return;
    refreshDate.push(time);
    broadCast(bridgeKey.refresh)
}

// 启动定时器 用于计算当前时间时候需要提醒
const start = () => {
    // 检查提醒
    checkToTip();
    // 检查是否是明天了
    checkIsTomorrow();

    timer = setTimeout(() => {
        start()
    }, 1000);
}

export default (win: BrowserWindow) => {
    tipWin = win;
    // 清空所有的tip
    clearTipTodo();
    // 如果没有正在进行的任务 就开始进行
    if (!timer)
        start();
};

