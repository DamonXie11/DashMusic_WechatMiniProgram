// pages/login/login.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: '', //手机号
    password: '', //用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 表单数据
   */
  handleInput(e) {
    // e.detail.value
    let type = e.currentTarget.id;
    // console.log(type, e.detail.value)
    this.setData({
      [type]: e.detail.value,
    })
  },

  async login() {
    let {phoneNum, password} = this.data;
    //前端验证
    /**
     * 手机号验证
     *  为空
     *  格式不正确
     *  正确
     */
    if (!phoneNum) {
      wx.showToast({
        title: "手机号呢",
        icon: "none",
      })
      return;
    }
    //正则
    let phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    if (!phoneReg.test(phoneNum)) {
      wx.showToast({
        title: "手机号错了",
        icon: "none",
      })
      return;
    }

    if (!password) {
      wx.showToast({
        title: "密码不能为空",
        icon: "none",
      })
      return;
    }
    ;
    // 后端验证
    let res = await request("/login/cellphone", {phone: phoneNum, password: password, isLogin: true})
    if (res.code === 200) {//登录成功
      wx.showToast({
        title: "登录成功",
      })
      console.log(res)
      //将用户信息存储至本地
      wx.setStorageSync('userInfo', JSON.stringify(res.profile))
      //跳转到tabBar
      wx.reLaunch({
        url: '/pages/profile/profile'
      })
    } else if (res.code === 400) {
      wx.showToast({
        title: "手机号错误",
        icon: "none",
      })
    } else if (res.code === 502) {
      wx.showToast({
        title: "密码错误",
        icon: "none",
      })
    } else {
      wx.showToast({
        title: "登录失败",
        icon: "none",
      })
    }
    console.log(res)
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})