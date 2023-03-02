import { bridgeKey } from "@/common/bridge";
import { ResultInfo, StatusModel, TodoModel } from "@/common/interface";
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { removeTipTodo } from "../manager/tip";
import { addTodo, cancelComplateTodo, clearTodo, complateTodo, delTodo, editTodo, getDelList, getTodo, permanentDelTodo, getComplateList, restoreTodo, getFutureList } from "../manager/todo";
import { broadCast } from "../manager/windows";

// 新增todo
ipcMain.addListener(bridgeKey.addTodo, (event: IpcMainEvent, todo: TodoModel) => {
    event.returnValue = addTodo(todo)
    broadCast(bridgeKey.refresh)
});
// 删除todo
ipcMain.addListener(bridgeKey.delTodo, (event: IpcMainEvent, id: number) => {
    event.returnValue = delTodo(id);
    broadCast(bridgeKey.refresh)
})
// 永久删除todo
ipcMain.addListener(bridgeKey.permanentDelTodo, (event: IpcMainEvent, id: number) => {
    event.returnValue = permanentDelTodo(id);
    broadCast(bridgeKey.refresh)
})
// 清空todo
ipcMain.addListener(bridgeKey.clearTodo, (event: IpcMainEvent) => {
    event.returnValue = clearTodo()
    broadCast(bridgeKey.refresh)
})
// 编辑Todo
ipcMain.addListener(bridgeKey.editTodo, (event: IpcMainEvent, todo: TodoModel) => {
    event.returnValue = editTodo(todo);
    // 删除Tip待完成的提醒
    removeTipTodo(todo.id)
    broadCast(bridgeKey.refresh)
})
// 还原todo
ipcMain.addListener(bridgeKey.restoreTodo, (event: IpcMainEvent, id: number) => {
    event.returnValue = restoreTodo(id)
    broadCast(bridgeKey.refresh)
})
// 完成Todo
ipcMain.addListener(bridgeKey.complateTodo, (event: IpcMainEvent, id: number) => {
    event.returnValue = complateTodo(id);
    // 删除Tip待完成的提醒
    removeTipTodo(id)
    broadCast(bridgeKey.refresh)
})
// 取消完成Todo
ipcMain.addListener(bridgeKey.cancelComplateTodo, (event: IpcMainEvent, id: number) => {
    event.returnValue = cancelComplateTodo(id);
    broadCast(bridgeKey.refresh)
})
// 获取todo列表
ipcMain.addListener(bridgeKey.getTodo, (event: IpcMainEvent) => {
    event.returnValue = getTodo();
})
// 获取已完成列表（按创建时间）
ipcMain.addListener(bridgeKey.complateList, (event: IpcMainEvent) => {
    event.returnValue = getComplateList();
})
// 获取已删除列表（按创建时间）
ipcMain.addListener(bridgeKey.delList, (event: IpcMainEvent) => {
    event.returnValue = getDelList();
})
// 获取将来时列表（按提醒时间）
ipcMain.addListener(bridgeKey.futureList, (event: IpcMainEvent, overdue: boolean) => {
    event.returnValue = getFutureList(overdue);
})

export default null;