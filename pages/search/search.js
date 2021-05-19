import request from "../../utils/request";
// let isSend = false;
Page({
  data: {
    placeholder: '',
    hotList: [],
    searchWords: '',
    searchList: [],
    historyList: [],
  },
  onLoad: function (options) {
    this.getInit();

    this.getSearchHistory();
  },
  //获取初始化数据
  async getInit() {
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholder: placeholderData.data.showKeyword,
      hotList: hotListData.data,
    })
  },
  //表单项内容发生改变的回调
  handleInput(e) {
    // console.log(e);
    this.setData({
      searchWords: e.detail.value.trim()
    })
    //
    // if(isSend){
    //   return
    // }
    // isSend = true;
    //
    // this.getSearchList();
    if (this.sto) {
      clearTimeout(this.sto);
    }

    //函数节流
    this.sto = setTimeout(() => {
      this.getSearchList();
      // isSend = false;
    }, 300)

  },
  //获取本地历史记录
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },
  //
  async getSearchList() {
    if (!this.data.searchWords) {
      this.setData({
        searchList: []
      })
      return
    }

    let {searchWords, historyList} = this.data;

    //获取关键字匹配数据
    let searchListData = await request('/search', {keywords: searchWords, limit: 10});

    this.setData({
      searchList: searchListData.result.songs,
    })
    //
    if (historyList.indexOf(searchWords) !== -1) {
      historyList.splice(historyList.indexOf(searchWords), 1)
    }
    historyList.unshift(searchWords);

    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
  },

  //清空搜索内容
  clearSearchContent() {
    this.setData({
      searchWords: '',
      searchList: []
    })
  },

  //清楚历史记录
  clearHistoryList() {
    wx.showModal({
      title: '删除历史',
      content: '确认删除历史搜索记录？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory')
          this.setData({
            historyList: []
          })
        }
      }
    })

  }
});