import { BrowserWindowConstructorOptions } from "electron";

//#region 返回值信息
export interface IResultDataInfoArray<T> {
    key?: string;
    value?: T[]
}

export class ResultInfo {
    code: number;
    msg: any;
    constructor(code: number, msg?: any) {
        this.code = code;
        this.msg = msg;
    }
    static success(msg?: any): ResultInfo {
        return new ResultInfo(1, msg)
    }
    static faild(msg: any): ResultInfo {
        return new ResultInfo(0, msg)
    }
}
//#endregion

//#region TO-DO 信息
// TO-DO 信息
export interface TodoModel {
    // 唯一id
    id?: number;
    // 内容
    content: string;
    // 状态 0是未完成  1是已完成  2是已删除  4是已过期未完成
    status: StatusModel;
    // 提醒
    remind?: RemindModel;
    // 创建时间
    createTime?: number;
    createDate?: string;
    // 完成时间
    complateTime?: number;
    complateDate?: string;
    // 最后的完成时间
    lastComplateDate?: string;
    // 父级id
    parentId?: number;
    // 扩展信息
    _extend?: TodoExtendModel,
}
// 扩展信息
export interface TodoExtendModel {
    // 已超过多少毫秒
    ms?: number;
    // 临时记入已删除
    remove?: boolean;
}
// 循环方式
export enum RemindWayModel {
    仅一次, 每天, 每周, 每月, 每年, //间隔,
}
// 循环设置
export interface RemindWaySettingModel {
    // 日期时间戳
    ms?: number;
    // 年份
    year?: number;
    // 月份
    month?: number;
    // 日
    day?: number;
    // 周几
    week?: WeekModel;
}
export enum WeekModel {
    周日, 周一, 周二, 周三, 周四, 周五, 周六,
}
// 提醒信息
export interface RemindModel {
    // 循环方式
    way?: RemindWayModel;
    // 循环设置
    waySetting?: RemindWaySettingModel;
    // 提醒时间 时间戳
    ms?: number;
    // 提醒时间 日期
    msDate?: string;
    msStr?: string;
    // 小时
    hour?: number;
    // 分钟
    minute?: number;
    // 秒
    seconds?: number;
}
// 状态
export enum StatusModel {
    未完成,
    已过期未完成,
    已完成,
    已删除,
}
//#endregion

//#region 

/**
 * 创建窗口的配置信息
 */
export interface CreateWindowOption extends BrowserWindowConstructorOptions {
    // 加载的url
    url: string;
    // 打开dev工具
    dev: boolean;
    // 显示
    show: boolean;
}
//#endregion

