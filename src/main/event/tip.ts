import { bridgeKey } from "@/common/bridge";
import { ResultInfo } from "@/common/interface";
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { getTipTodo } from "../manager/tip";

// 获取需要提示的内容
ipcMain.addListener(bridgeKey.getTipContent, (e: IpcMainEvent) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    e.returnValue = ResultInfo.success(getTipTodo(win.id))
})