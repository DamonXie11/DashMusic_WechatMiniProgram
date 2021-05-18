import PubSub from 'pubsub-js'
import request from "../../utils/request";

Page({
  data: {
    day: '',
    month: '',
    reccomendList: [],
    bg_image: '',
    index: 0,
  },
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
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    })
    wx.showToast({
      title: '玩命加载中',
      icon: 'none'
    })
    this.getRecommendList();


    //订阅来自musicDetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {reccomendList, index} = this.data;
      if (type === 'pre') { //上一首

        (index === 0) && (index = reccomendList.length);
        index -= 1;

      } else { //下一首

        (index === reccomendList.length - 1) && (index = -1);
        index += 1;
      }

      //更新下标
      this.setData({
        index,
      })

      let musicId = reccomendList[index].id;

      //将id传给musicDetail页面
      PubSub.publish('musicId', musicId)
    });
  },

  //获取每日推荐列表
  async getRecommendList() {
    //获取每日推荐的数据
    let reccomendList = await request('/recommend/songs')
    this.setData({
      reccomendList: reccomendList.recommend
    })
  },
  //跳转歌曲详情页面
  toSongDetail(e) {
    let {song, index} = e.currentTarget.dataset;

    this.setData({
      index,
    })

    //路由跳转传参
    //传递参数的长度有限制，如果长度过长会自动截取掉
    wx.navigateTo({
      url: '/pages/musicDetail/musicDetail?songId=' + song.id,
    })
  }
});

