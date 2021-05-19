// pages/profile/profile.js
import request from "../../utils/request";

let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: '',
    userInfo: {},
    recentPlayList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户基本信息
    this.getUserInfo();
    // console.log(userInfo)
  },

  /**
   * 滑动时间
   */

  handleTouchStart(event) {
    // console.log("start")
    //获取手指的起始坐标
    startY = event.touches[0].clientY;
  },

  handleTouchMove(event) {
    // console.log("move")
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance < 100 && moveDistance > 0) {
      this.setData({
        coverTransform: `translateY(${moveDistance}rpx)`
      })
    }

    // this.coverTransform = `translateY(${moveDistance}rpx)`
    // console.log(moveDistance)
  },

  handleTouchEnd() {
    // console.log("end")
    this.setData({
      coverTransform: `translateY(0rpx), 1s`
    })
  },

  /**
   * 跳转登录
   */
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  /**
   * 获取个人信息
   */
  getUserInfo(){
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      //更新userInfo
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      //播放记录
      this.getRecentPlayList(this.data.userInfo.userId);
    }
  },

  /**
   * 获取播放记录
   */
  async getRecentPlayList(userId){
    let recentPlayListData = await request("/user/record",{uid: userId, type: 0})
    let index = 0;
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList,
    })
  },
  noTap(){
    wx.showModal({
      title:'我看你手贱',
      content:'不要看了，滚吧！',
      confirmText:'自愿退下',
      showCancel:false,
      confirmColor:'#d43c33'
    })
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
    // wx.stopPullDownRefresh();
    // console.log("aaa")
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