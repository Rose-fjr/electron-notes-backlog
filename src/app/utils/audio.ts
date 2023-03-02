import { bridgeKey } from "@/common/bridge"
import { UserSetting } from "@/common/setting";
import { refreshSetting } from "./event";
import { ipcRenderer } from "./render"

// 用户设置
let userSetting = ipcRenderer.sendSync(bridgeKey.getUserSetting) as UserSetting;
refreshSetting(() => {
    userSetting = ipcRenderer.sendSync(bridgeKey.getUserSetting) as UserSetting;
})

// 播放添加音效
export const playAddAudio = () => {
    if (userSetting.audio.haveAdd) {
        let audio = new Audio(userSetting.audio.add)
        audio.play();
    }
}

// 播放删除音效
export const playRemoveAudio = () => {
    if (userSetting.audio.haveRemove) {
        let audio = new Audio(userSetting.audio.remove);
        audio.play();
    }
}

// 播放完成音效
export const playComplateAudio = () => {
    if (userSetting.audio.haveComplate) {
        let audio = new Audio(userSetting.audio.complate);
        audio.play();
    }
}

// 播放提示音效
export const playTipAudio = (): HTMLAudioElement => {
    let audio = new Audio(userSetting.audio.custom ? userSetting.audio.custom : userSetting.audio.tip);
    audio.play();
    return audio;
}
// 播放清空音效
export const playClearAudio = () => {
    if (userSetting.audio.haveClear) {
        let audio = new Audio(userSetting.audio.clear);
        audio.play();
    }
}
