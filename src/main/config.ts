// 判断是否是开发模式
let WEB_URL = process.env.WEB_URL;
export const baseUrl = WEB_URL ?? `file://${__dirname}/index.html`;

