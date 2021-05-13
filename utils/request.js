//发送Ajax请求
/**
 * 封装功能函数
 */
import config from "./config";
export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        //new Promise 初始化Promise实例的状态为pending
        wx.request({
            url: config.mobileHost + url,
            data,
            method,
            success: (res) => {
                console.log("success", res);
                resolve(res.data);
            },
            fail: (err) => {
                console.log("fail", err)
                reject(err);
            }
        })
    })
}