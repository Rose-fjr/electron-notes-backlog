import { bridgeKey } from "@/common/bridge";
import { CreateWindowOption, ResultInfo } from "@/common/interface";
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { createWindow } from "../utils/window";
import { addWindow } from "../manager/windows";
import { baseUrl } from "../config";

// 创建窗口
ipcMain.addListener(bridgeKey.createWindow, (e: IpcMainEvent, options: CreateWindowOption) => {
    options.url = baseUrl + "#/" + options.url;
    let id = addWindow(createWindow(options))
    e.returnValue = ResultInfo.success(id)
})



