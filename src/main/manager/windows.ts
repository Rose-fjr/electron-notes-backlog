import { BrowserWindow } from "electron";
import { SnowflakeIdv1 } from 'simple-flakeid'

const snow = new SnowflakeIdv1({ workerId: 1 });

// 所有通过接口创建的窗口集合
let allWindows: Map<number, BrowserWindow> = new Map();
// 增加窗口
export const addWindow = (win: BrowserWindow): number => {
    let id = win.id;
    // 监听关闭事件
    win.addListener('close', () => {
        if (allWindows.has(id)) {
            win.removeAllListeners();
            allWindows.delete(id)
        }
    })
    allWindows.set(id, win);
    return id;
}

/**
 * 广播
 * @param key 
 * @param value 
 */
export const broadCast = (key: string, ...value: any[]) => {
    BrowserWindow.getAllWindows().forEach(item => {
        item.webContents.send(key, value)
    })
}


