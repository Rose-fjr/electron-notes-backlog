import { bridgeKey } from "@/common/bridge";
import { ResultInfo } from "@/common/interface";
import { AudioSetting, BaseSetting, UserSetting } from "@/common/setting";
import { app, ipcMain, IpcMainEvent } from "electron";
import { broadCast } from "../manager/windows";

const userSettingKey = "user-setting"

// 获取用户设置
ipcMain.addListener(bridgeKey.getUserSetting, (e: IpcMainEvent) => {
    e.returnValue = new UserSetting(userSettingKey)
})

// 修改声音设置
ipcMain.addListener(bridgeKey.changeAudioSetting, (e: IpcMainEvent, audio: AudioSetting) => {
    let setting = new UserSetting(userSettingKey);
    setting.audio = audio;
    setting.write();
    e.returnValue = ResultInfo.success();
    broadCast(bridgeKey.refreshSetting)
})

// 修改基本设置
ipcMain.addListener(bridgeKey.changeBaseSetting, (e: IpcMainEvent, base: BaseSetting) => {
    let setting = new UserSetting(userSettingKey);
    setting.base = base;
    setting.write();
    e.returnValue = ResultInfo.success();
    broadCast(bridgeKey.refreshSetting)
    if (base.autostart) {
        app.setLoginItemSettings({
            openAtLogin: true
        })
    } else {
        app.setLoginItemSettings({
            openAtLogin: false
        })
    }
})


export default null;