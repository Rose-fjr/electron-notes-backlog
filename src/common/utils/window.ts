import { BrowserWindow } from "electron";

/**
 * 解决窗口抖动问题
 * @param win 
 */
export const solveWindowShake = (win: BrowserWindow) => {
    win.on('will-move', () => {
        BrowserWindow.getAllWindows().forEach(item => {
            if (item.webContents.getURL().indexOf('/tip') > -1)
                item.setIgnoreMouseEvents(true)
        })
    })
    win.on('moved', () => {
        BrowserWindow.getAllWindows().forEach(item => {
            if (item.webContents.getURL().indexOf('/tip') > -1)
                item.setIgnoreMouseEvents(true, { forward: true })
        })
    })
}
