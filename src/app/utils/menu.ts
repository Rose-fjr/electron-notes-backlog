// @ts-nocheck
import { StatusModel, TodoModel } from '@/common/interface';
import remote, { ipcRenderer } from './render'
import { getImg, openSetting, quit } from './send';
const { Menu } = remote;

type MenuFunctionType = (id: MenuCallbackType, todo?: TodoModel) => void;
export enum MenuCallbackType {
    编辑,
    完成,
    彻底删除,
    删除,
    还原,
    复制,
    撤销完成,
    添加提醒,
    删除提醒,
    退出程序,
}

// 获取Todo菜单
export const getTodoItemMenu = (click: MenuFunctionType, todo: TodoModel) => {
    let status: StatusModel = todo.status;
    let todoItemMenu: Array<Electron.MenuItem> = [
        status != StatusModel.已完成 && !todo.lastComplateDate ? {
            label: "编辑",
            click: () => click(MenuCallbackType.编辑, todo),
            icon: getImg('static/image/menu/edit.png')
        } : null,
        status != StatusModel.已完成 && !todo.lastComplateDate ? {
            label: "完成",
            click: () => click(MenuCallbackType.完成, todo),
        } : {
            label: "撤销完成",
            click: () => click(MenuCallbackType.撤销完成, todo),
        },
        { type: 'separator' },
        status != StatusModel.已完成 && !todo.lastComplateDate ? {
            label: todo.remind ? "修改提醒" : "添加提醒",
            click: () => click(MenuCallbackType.添加提醒, todo),
            icon: getImg('static/image/menu/remind.png')
        } : null,
        todo.remind && status == StatusModel.未完成 && !todo.lastComplateDate ?
            {
                label: "删除提醒",
                click: () => click(MenuCallbackType.删除提醒, todo),
            } : null,
        { type: 'separator' },
        {
            label: "删除",
            click: () => click(MenuCallbackType.删除, todo),
            icon: getImg('static/image/menu/copy.png')
        },
        {
            label: "复制",
            click: () => click(MenuCallbackType.复制, todo),
            icon: getImg('static/image/menu/del.png')
        },];
    todoItemMenu = todoItemMenu.filter(m => m != null);
    let todoItemMenuIns = Menu.buildFromTemplate(todoItemMenu);
    todoItemMenuIns.popup()
}

// 获取Todo菜单（列表）
export const getTodoItemMenuByDel = (click: MenuFunctionType, todo: TodoModel) => {
    let status: StatusModel = todo.status;
    let todoItemMenu: Array<Electron.MenuItem> = [
        status == StatusModel.已删除 && !todo.parentId ? {
            label: "还原",
            click: () => click(MenuCallbackType.还原, todo),
            // icon: getImg('static/image/menu/copy.png')
        } : null,
        status == StatusModel.已完成 && !todo.parentId ? {
            label: "撤销完成",
            click: () => click(MenuCallbackType.撤销完成, todo),
        } : null,
        { type: 'separator' },
        status == StatusModel.已完成 ? {
            label: "删除",
            click: () => click(MenuCallbackType.删除, todo),
        } : null,
        {
            label: "彻底删除",
            click: () => click(MenuCallbackType.彻底删除, todo),
            icon: getImg('static/image/menu/del.png')
        },
        {
            label: "复制",
            click: () => click(MenuCallbackType.复制, todo),
            icon: getImg('static/image/menu/copy.png')
        },];
    todoItemMenu = todoItemMenu.filter(m => m != null);
    let todoItemMenuIns = Menu.buildFromTemplate(todoItemMenu);
    todoItemMenuIns.popup()
}

// 获取顶部菜单Menu
export const getTopNavMenu = (click: MenuFunctionType) => {
    let menus: Array<Electron.MenuItem> = [
        {
            label: "设置",
            click: () => openSetting(),
            icon: getImg('static/image/menu/setting.png')
        },
        { type: 'separator' }, {
            label: "退出程序",
            click: () => quit(),
            icon: getImg('static/image/menu/quit.png')
        }];
    menus = menus.filter(m => m != null);
    let menusIns = Menu.buildFromTemplate(menus);
    menusIns.popup()
}
