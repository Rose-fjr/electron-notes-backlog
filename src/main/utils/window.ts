import { CreateWindowOption } from '@/common/interface'
import { UserSetting } from '@/common/setting'
import { solveWindowShake } from '@/common/utils/window'
import { BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron'
import { baseUrl } from '../config'
import { addWindow } from '../manager/windows'
import injectRemote from './injectRemote'
import fs from 'fs-extra'
import path from 'path'



// 创建窗口
export const createWindow = (option: CreateWindowOption): BrowserWindow => {
    const setting = new UserSetting();
    option = Object.assign({
        width: 320,
        height: 700,
        maxWidth: 320,
        minHeight: 500,
        minimizable: false,
        maximizable: false,
        transparent: true,
        frame: false,
        useContentSize: true,
        // skipTaskbar: true,
        alwaysOnTop: setting.base.alwaystop,
        webPreferences: {
            // 这两个都需要 不然就报错  开启node
            contextIsolation: false,
            nodeIntegration: true,
            // 跨域
            webSecurity: false,
        }
    }, option)
    const window = new BrowserWindow({ ...option })
    window.loadURL(option.url)
    if (option.dev) {
        //打开开发工具
        window.webContents.openDevTools({ mode: "detach" });
    }
    if (option.show) {
        window.show()
    }
    // 注入远程模块
    injectRemote(window)
    // 添加窗口
    addWindow(window);
    // 解决拖拽抖动问题
    solveWindowShake(window);
    return window;
}


/**
 * 创建提醒窗口
 * @param option 基本信息
 * @param widthSize 窗口宽度的百分比
 * @returns 
 */
export const createTipWindow = (option: CreateWindowOption, widthSize: number = 0.25) => {
    // 指定提醒窗口的宽度
    let s = screen.getPrimaryDisplay().workAreaSize;
    const seeWidth = s.width * widthSize;
    option = Object.assign(option, {
        url: baseUrl + '#/tip',
        width: seeWidth * 2,
        x: s.width - Math.round(seeWidth),
        y: 0,
        minHeight: s.height,
        maxHeight: 0,
        minWidth: 0,
        maxWidth: 0,
        height: s.height,
        resizable: false,
    } as CreateWindowOption)
    let win = createWindow(option)
    // 设置窗口鼠标穿透
    win.setIgnoreMouseEvents(true, { forward: true })
    return win;
}

/**
 * 判断是否是第一次运行
 */
export const checkIsFirstRun = (): boolean => {
    let p = path.resolve(process.cwd(), 'resources/run')
    if (!fs.pathExistsSync(p)) {
        fs.mkdirSync(p, { recursive: true })
        return true;
    }
    return false;
}

