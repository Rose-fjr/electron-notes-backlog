import { bridgeKey } from "@/common/bridge";
import { app, BrowserWindow, ipcMain } from "electron";

// 退出程序
ipcMain.addListener(bridgeKey.quit, () => {
    console.log("触发")
    BrowserWindow.getAllWindows().forEach(item => {
        item.close();
    })
    console.log("触发1")
    app.quit();
})
