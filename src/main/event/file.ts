import { bridgeKey } from "@/common/bridge";
import { ResultInfo } from "@/common/interface";
import { app, ipcMain, IpcMainEvent, nativeImage } from "electron";
import path from 'path'
import { getImagePath } from "../manager/file";

// 获取图片文件
ipcMain.addListener(bridgeKey.getImg, (e: IpcMainEvent, p: string) => {
    e.returnValue = nativeImage.createFromPath(getImagePath(p))
})
// 获取文件路径
ipcMain.addListener(bridgeKey.getFilePath, (e: IpcMainEvent, filePath: string) => {
    e.returnValue = ResultInfo.success(path.resolve(app.getAppPath(), filePath));
})

export default null;