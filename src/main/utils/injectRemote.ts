import { BrowserWindow } from "electron";

let initialized = false;

export default (win: BrowserWindow) => {
    const module = require('@electron/remote/main');
    if (!initialized) {
        module.initialize();
        initialized = true;
    }
    module.enable(win.webContents);
}