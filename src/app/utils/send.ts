import { bridgeKey } from "@/common/bridge";
import { CreateWindowOption, ResultInfo, TodoModel } from "@/common/interface";
import { AudioSetting, BaseSetting, UserSetting } from "@/common/setting";
import remote, { ipcRenderer } from "./render";

// 退出程序
export const quit = () => {
    return ipcRenderer.sendSync(bridgeKey.quit)
}

// 打开设置面板
export const openSetting = () => {
    const s = remote.screen.getPrimaryDisplay().workAreaSize;
    const seeWidth = s.width * 0.5;
    const seeHeight = s.height * 0.5;
    let option: CreateWindowOption = {
        url: 'setting',
        dev: false,
        show: true,
        skipTaskbar: true,
        // frame: true,

        // width: seeWidth * 2,
        // minHeight: seeHeight * 2,
        x: seeWidth,
        y: seeHeight,
        maxHeight: 0,
        minWidth: 0,
        maxWidth: 0,
        height: seeHeight,
        resizable: false,
    };
    return ipcRenderer.sendSync(bridgeKey.createWindow, option)
}

// 获取用户设置
export const getUserSetting = (): UserSetting => {
    return ipcRenderer.sendSync(bridgeKey.getUserSetting) as UserSetting;
}

// 修改声音设置
export const changeAudioSetting = (audio: AudioSetting) => {
    return ipcRenderer.sendSync(bridgeKey.changeAudioSetting, audio)
}

// 修改基础设置
export const changeBaseSetting = (base: BaseSetting) => {
    return ipcRenderer.sendSync(bridgeKey.changeBaseSetting, base);
}

// 增加待办
export const addTodo = (todo: TodoModel): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.addTodo, todo);
    return data;
}
// 删除待办
export const remTodo = (id: number): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.delTodo, id);
    return data;
}
// 永久删除
export const permanentDelTodo = (id: number): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.permanentDelTodo, id)
}
// 清空
export const clearTodo = (): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.clearTodo);
}
// 编辑待办
export const editTodo = (todo: TodoModel): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.editTodo, todo);
    return data;
}
// 还原
export const restoreTodo = (id: number): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.restoreTodo, id);
    return data;
}
// 完成todo
export const complateTodo = (id: number): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.complateTodo, id);
}
// 取消完成todo
export const cancelComplateTodo = (id: number): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.cancelComplateTodo, id);
}
// 获取todo
export const getTodo = (): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.getTodo);
    return data;
}
// 获取已完成列表
export const getComplateList = (): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.complateList)
}
// 获取已删除列表
export const getDelList = (): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.delList)
}
// 获取将来时列表
export const getFutureList = (overdue: boolean = false): ResultInfo => {
    return ipcRenderer.sendSync(bridgeKey.futureList, overdue)
}

// 获取图片
export const getImg = (path: string): Electron.NativeImage => {
    const img = ipcRenderer.sendSync(bridgeKey.getImg, path);
    return img;
}

// 获取文件路径
export const getFilePath = (path: string): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.getFilePath, path);
    return data;
}

// 获取需要提示的内容
export const getTipContent = (): ResultInfo => {
    const data = ipcRenderer.sendSync(bridgeKey.getTipContent);
    return data;
}

