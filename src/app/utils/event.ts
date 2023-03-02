import { bridgeKey } from "@/common/bridge";
import { IpcRendererEvent } from "electron";
import { ipcRenderer } from "./render";

export type ListenerCallback = (e: IpcRendererEvent, ...args: any[]) => void

export const refresh = (listener: ListenerCallback) => {
    ipcRenderer.addListener(bridgeKey.refresh, listener)
}

export const needTip = (listener: ListenerCallback) => {
    ipcRenderer.addListener(bridgeKey.needTip, listener);
}

export const moveToZero = (listener: ListenerCallback) => {
    ipcRenderer.addListener(bridgeKey.moveToZero, listener)
}

export const leaveToZero = (listener: ListenerCallback) => {
    ipcRenderer.addListener(bridgeKey.leaveToZero, listener)
}

export const refreshSetting = (listener: ListenerCallback) => {
    ipcRenderer.addListener(bridgeKey.refreshSetting, listener)
}