import { app, BrowserWindow, Event, ipcMain, Menu, MenuItem, nativeImage, screen, Tray } from 'electron'
import { baseUrl } from './config'
import '@/common/load'
import { bridgeKey } from '@/common/bridge'
import './event'
import { checkIsFirstRun, createTipWindow, createWindow } from './utils/window'
import start from './manager/task'
import { getImagePath } from './manager/file'
import { StatusModel } from '@/common/interface'
import { addTodo } from './manager/todo'

// var cmd = process.argv[1];

// if (cmd == '--squirrel-firstrun') {
//     // Running for the first time.
// }

// 主窗口
let mainWindow: BrowserWindow;
// 系统托盘
let tray: Tray;

// 创建主窗口
const initMain = () => {
    mainWindow = createWindow({
        url: baseUrl,
        dev: true,
        show: true,
        skipTaskbar: true,
    })

    //#region 监听窗口移动到某位置事件
    mainWindow.addListener('moved', (e: Electron.Event) => {
        const pos = mainWindow.getPosition();
        if (pos[1] <= 0) {
            mainWindow.webContents.send(bridgeKey.moveToZero)
        } else {
            mainWindow.webContents.send(bridgeKey.leaveToZero);
        }
    })
    mainWindow.addListener('will-move', () => {
        mainWindow.webContents.send(bridgeKey.leaveToZero);
    })
    //#endregion

}
// 创建Tip窗口
const initTip = () => {
    let win = createTipWindow({
        url: '',
        dev: false,
        show: true,
        skipTaskbar: true
    })
    win.webContents.on('did-finish-load', () => {
        start(win);
    })
}
// 创建托盘
const initTray = () => {
    tray = new Tray(nativeImage.createFromPath(getImagePath('static/image/menu/logo.png')))
    let menu = [{
        label: "退出登录",
        click: () => app.quit(),
        icon: getImagePath('static/image/menu/quit.png')
    }]
    tray.setContextMenu(Menu.buildFromTemplate(menu));

    // 双击显示主界面
    tray.addListener('double-click', () => {
        mainWindow.show()
    })
}
// 首次运行 初始化一些东西
const firstRunInit = () => {
    addTodo({
        content: '点击“新增待办”增加一条新的待办',
        status: StatusModel.未完成
    })
    addTodo({
        content: '双击“待办”修改当前待办',
        status: StatusModel.未完成
    })
    addTodo({
        content: '右键“待办”操作当前待办',
        status: StatusModel.未完成
    })
    addTodo({
        content: '拖拽“顶部”移动窗口',
        status: StatusModel.未完成
    })
    addTodo({
        content: '拖拽“顶部边缘”自动隐藏',
        status: StatusModel.未完成
    })
}

app.whenReady().then(() => {
    // 判断是否是第一次运行
    if (checkIsFirstRun()) {
        // 首次运行
        firstRunInit();
    }
    // 创建主窗口
    initMain();
    // 创建Tip窗口并启动定时器
    initTip();
    // 创建托盘
    initTray();
})
