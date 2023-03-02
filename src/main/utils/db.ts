import fs from 'fs-extra'
import path from 'path'
import Store from 'electron-store'

const dbArray = new Map();

/**
 * 数据库配置信息
 */
export interface DataBaseOptions {
    // 数据存储根文件夹
    baseDir: string
    //后缀
    suffix: string;
}
export const config: DataBaseOptions = {
    baseDir: "db",
    suffix: ".json"
}

export class DB<T>{
    store: Store
    dbDir: string;
    dbPath: string;
    dbKey: string;
    data: Array<T>;
    constructor(database: string) {
        this.store = new Store({
            name: database
        })
        this.data = [];
        this.dbDir = path.join(process.cwd(), config.baseDir, database.substring(0, database.lastIndexOf('/')));
        this.dbPath = path.join(process.cwd(), config.baseDir, database + config.suffix);
        this.dbKey = database;
        let data = this.store.get(this.dbKey)
        if (data) {
            this.data = data as Array<T>;
        } else {
            this._write();
        }
        // if (!fs.pathExistsSync(this.dbDir)) {
        //     fs.mkdirSync(this.dbDir, { recursive: true })
        // }
        // if (fs.existsSync(this.dbPath)) {
        //     this.data = JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
        // } else {
        //     this._write();
        // }
    }
    insert(data: T): void {
        this.data.push(data)
        this._write();
    }
    remove(index: number, count: number = 1): void {
        this.data.splice(index, count)
        this._write();
    }
    update() {
        this._write();
    }
    clear() {
        this.data = [];
        this._write();
    }
    change(oldIndex: number, newData: T, excludeKeys: string[] = []): void {
        var oldData = this.data[oldIndex];
        let oldKeys = Object.keys(newData).filter(m => excludeKeys.indexOf(m) < 0);
        oldKeys.forEach((key, index) => {
            if (newData[key] == null || newData[key] == undefined) {
                delete oldData[key]
            } else {
                oldData[key] = newData[key]
            }
        })
        this._write();
    }
    private _write() {
        this.store.set(this.dbKey, this.data)
    }
}

/**
 * 获取一个数据库 没有则创建
 * @param database 数据库路径（不带后缀）
 * @returns 
 */
export function getDB<T>(database: string): DB<T> {
    if (dbArray.has(database)) {
        return dbArray.get(database);
    } else {
        let db = new DB<T>(database);
        dbArray.set(database, db);
        return db;
    }
}



