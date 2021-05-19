// pages/video/video.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoInoList: [],
    videoId: '',
    videoUpdateTime: [],
    isTriggered: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: "尼玛先登录",
        icon: "none",
        success: () => {
          //跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    this.getVideoList();

  },

  //获取导航数据
  async getVideoList() {
    let videoListData = await request("/video/group/list");
    this.setData({
      videoGroupList: videoListData.data.slice(0, 14),
      navId: videoListData.data[0].id
    })
    this.getVideoInfoList(this.data.navId);
  },

  //获取视频列表数据
  async getVideoInfoList(navId) {
    let videoInfoListData = await request("/video/group", {id: navId})
    //关闭消息提示框
    wx.hideLoading()

    let index = 0;
    let videoList = videoInfoListData.datas.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      videoInoList: videoInfoListData.datas,
      isTriggered: false,//关闭下拉刷新
    })
  },

  //点击切换导航回调
  changeNav(e) {
    //通过id传递参数如果是number会自动转换成string
    //如果是data- 传递参数就不会转换
    let navId = e.currentTarget.id;
    this.setData({
      navId,
      videoInoList: []
    })
    //显示正在加载
    wx.showLoading({
      title: '视频正在来的路上',
    })
    this.getVideoInfoList(navId);
  },
  //播放
  handlePlay(e) {

    let vId = e.currentTarget.id;

    this.setData({
      videoId: vId,
    })

    //关闭上一个播放的视频
    // this.vId !== vId && this.videoContext && this.videoContext.stop();

    //创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vId);

    //判断当前的视频之前是否播放过，如果有则跳转到之前的位置
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vId)

    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }

    this.videoContext.play();
    // this.vId = vId;
    // this.videoContext.stop();
  },

  //处理视频播放进度
  handleUpdate(e) {
    // console.log(e)
    let videoObj = {vid: e.currentTarget.id, currentTime: e.detail.currentTime}

    let {videoUpdateTime} = this.data;

    //判断记录的数组中有没有发生更新
    let videoItem = videoUpdateTime.find(item => item.vid == e.currentTarget.id)
    if (videoItem) { //如果之前有
      videoItem.currentTime = e.detail.currentTime;
    } else { //之前没有
      videoUpdateTime.push(videoObj);
    }

    //更新videoUpdateTime
    this.setData({
      videoUpdateTime,
    })
  },

  //视频播放结束调用
  handleEnded(e) {
    //移出存在data里面已经播放完的数据
    let {videoUpdateTime} = this.data;

    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === e.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },

  //自定义下拉刷新，针对scrollView
  handleRefresh() {
    this.getVideoInfoList(this.data.navId);
  },

  //自定义上拉触底的回调,针对scrollView
  handleTolower(){
    //数据分页效果
    // 后端分页  前端分页

    let newList = this.data.videoInoList;
    let {videoInoList} = this.data;
    videoInoList.push(...newList);
    this.setData({
      videoInoList,
    })
  },

  //跳转到搜索
  toSearch(){
    wx.navigateTo({
      url:'/pages/search/search'
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
    console.log("shuxin")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    return{

    }
  }
})