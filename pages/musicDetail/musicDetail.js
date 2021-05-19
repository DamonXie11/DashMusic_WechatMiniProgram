import PubSub from 'pubsub-js'
import moment from "moment";
import request from "../../utils/request";

//获取全局实例
const appInstance = getApp();

Page({
  data: {
    isPlay: false,
    song: {},
    musicId: '',
    musicLink: '',
    currentTime: '00:00',
    totalTime: '00:00',
    currentWidth:0,
  },
  onLoad: function (options) {
    // console.log(options)

    let musicId = options.songId;
    this.setData({
      musicId
    })
    // console.log(appInstance)


    //判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      //修改当前页面音乐播放状态
      this.setData({
        isPlay: true,
      })
    }

    //创建控制音乐播放的实例对象,因为前面后面都需要访问，所以直接绑定到this（此页面上）
    this.backgroundAudioMannager = wx.getBackgroundAudioManager();
    this.backgroundAudioMannager.onPlay(() => {
      this.setData({
        isPlay: true,
      })
      appInstance.globalData.isMusicPlay = true;
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioMannager.onPause(() => {
      this.setData({
        isPlay: false,
      });
      appInstance.globalData.isMusicPlay = false;
    });
    this.backgroundAudioMannager.onStop(() => {
      this.setData({
        isPlay: false,
      });
      appInstance.globalData.isMusicPlay = false;

    });

    //监听音乐播放自然结束
    this.backgroundAudioMannager.onEnded(()=>{
      //自动切换下一首有播放
      PubSub.publish('switchType', 'next')

      //将实时进度条的长度值为零
      this.setData({
        currentTime: '00:00',
        currentWidth:0,
      })
    })

    //监听音频实时播放进度
    this.backgroundAudioMannager.onTimeUpdate(() => {
      //格式化实时不播放时间
      let currentTime = moment(this.backgroundAudioMannager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioMannager.currentTime/this.backgroundAudioMannager.duration*450;

      this.setData({
        currentTime,
        currentWidth
      })
    })

    // console.log(musicId)
    this.getSongDetail(musicId)

    /**
     * 如果操作系统的播放按钮和界面的不一样
     *  需要人工调整
     *  监听音乐是否播放
     */

  },
  //处理点击播放
  handlePlay() {
    let isPlay = !this.data.isPlay;
    this.setData({
      isPlay
    })
    let {musicId, musicLink} = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },
  //控制音乐播放的能能函数
  async musicControl(isPlay, musicId, musicLink) {

    if (isPlay) { //如果为true音乐播放

      if (!musicLink) {
        //获取音乐播放链接
        let musicLinkData = await request('/song/url', {id: musicId})
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink,
        })
      }

      this.backgroundAudioMannager.src = musicLink;
      this.backgroundAudioMannager.title = this.data.song.name;
    } else { //暂停音乐播放
      this.backgroundAudioMannager.pause();
    }
  },
  //获取详情信息
  async getSongDetail(songId) {
    let songDetail = await request('/song/detail', {ids: songId});

    let totalTime = moment(songDetail.songs[0].dt).format('mm:ss');

    this.setData({
      song: songDetail.songs[0],
      totalTime
    })

    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  //点击切歌的回调
  handleSwitch(e) {
    let type = e.currentTarget.id;
    //关闭当前播放的音乐
    this.backgroundAudioMannager.stop();
    //订阅来自recommendation页面发布的musicId
    PubSub.subscribe('musicId', (msg, musicId) => {
      // console.log(musicId)

      //获取音乐详情
      this.getSongDetail(musicId);
      //自动播放当前音乐
      this.musicControl(true, musicId)

      //取消订阅
      PubSub.unsubscribe('musicId')
    })

    //发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)

  }
});