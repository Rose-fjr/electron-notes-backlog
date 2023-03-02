import { app } from 'electron';
import Store from 'electron-store'
import path from 'path'

const store = new Store({
    name: "user-setting"
});

//#region 设置信息
// 声音设置
export interface AudioSetting {
    // 新增提示音
    add: string;
    haveAdd: boolean;
    // 删除提示音
    remove: string;
    haveRemove: boolean;
    // 完成提示音
    complate: string;
    haveComplate: boolean;
    // 清空提示音
    clear: string;
    haveClear: boolean;
    // 提醒提示音
    tip: string;
    haveTip: boolean;
    custom?: string;
}
// 提醒设置
export interface TipSetting {
    // 默认延迟多少秒 （单位秒）
    delay: number;
    // 针对每个提醒最多提醒多少次
}
// 基本设置
export interface BaseSetting {
    alwaystop: boolean;
    autostart: boolean;
}
// 用户设置
export class UserSetting {
    _key: string;
    // 基本设置
    base: BaseSetting;
    // 声音设置
    audio: AudioSetting;
    // 提醒设置
    tip: TipSetting;
    // 初始化
    constructor(key: string = "user-setting") {
        this._key = key;
        this.init();
    }
    // 初始化第一次
    private init() {
        this.audio = {
            add: path.resolve(app.getAppPath(), 'static/audio/复古通知.wav'),
            haveAdd: true,
            remove: path.resolve(app.getAppPath(), "static/audio/删除.mp3"),
            haveRemove: true,
            complate: path.resolve(app.getAppPath(), "static/audio/完成.mp3"),
            haveComplate: true,
            clear: path.resolve(app.getAppPath(), 'static/audio/清空.wav'),
            haveClear: true,
            tip: path.resolve(app.getAppPath(), 'static/audio/卡农.mp3'),
            haveTip: true
        }
        this.base = {
            alwaystop: true,
            autostart: true
        }

        let data = store.get(this._key) as UserSetting;
        if (data) {
            this.audio = Object.assign(this.audio, data.audio)
            this.base = Object.assign(this.base, data.base)
        }
        else {
            // 首次初始化
            app.setLoginItemSettings({
                openAtLogin: true,
            })
        }
        this.write();
    }
    write() {
        store.set(this._key, this)
    }
}
//#endregion