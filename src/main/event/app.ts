import { bridgeKey } from "@/common/bridge";
import { app, BrowserWindow, ipcMain } from "electron";

// 退出程序
ipcMain.addListener(bridgeKey.quit, () => {
    BrowserWindow.getAllWindows().forEach(item => {
        item.close();
    })
    app.quit();
})
