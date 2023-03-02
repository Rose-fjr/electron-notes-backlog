import { TodoModel } from "@/common/interface";

let list: Array<TodoModel> = [];

/**
 * 添加Todo的提示信息
 * @param todo todo的信息
 */
export const addTipTodo = (todo: TodoModel) => {
    var have = list.find(m => m.id == todo.id);
    if (!have) {
        list.push(todo)
    }
}
/**
 * 获取Todo信息
 * @param id todo的id
 */
export const getTipTodo = (id: number): TodoModel => {
    var have = list.find(m => m.id == id);
    if (have) {
        return have;
    }
    return null;
}
/**
 * 判断当前Todo是否已经在待提醒中
 * @param id 
 */
export const getAllHaveTodoIds = (): number[] => {
    let ids: number[] = [];
    list.forEach(key => {
        ids.push(key.id)
    });
    return ids;
}
/**
 * 删除Todo信息
 * @param winId 
 * @param id 
 */
export const removeTipTodo = (id: number) => {
    var index = list.findIndex(m => m.id == id);
    if (index >= 0) {
        list.splice(index, 1)
    }
}
/**
 * 清空Tip
 */
export const clearTipTodo = () => {
    list = [];
}
