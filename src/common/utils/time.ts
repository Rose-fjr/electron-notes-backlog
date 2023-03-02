import moment from "moment";

export const formatTime = (msTime) => {
    let time = msTime / 1000;
    let day = Math.floor(time / 60 / 60 / 24);
    let hour = Math.floor(time / 60 / 60) % 24;
    let minute = Math.floor(time / 60) % 60;
    let second = Math.floor(time) % 60;
    return `${day}天${hour}时${minute}分${second}秒`
}

// 日期正序排序
export const timePositive = (a: string, b: string) => {
    return Date.parse(a) - Date.parse(b)
}

// 日期倒序排序
export const timeReverse = (a: string, b: string) => {
    return Date.parse(b) - Date.parse(a)
}

// 获取当前日期
export const getNowMomentDate = (): moment.Moment => {
    return moment().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
}