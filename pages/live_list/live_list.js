Page({

  /**
   * 页面的初始数据
   */
  data: {
    live_list: [],
    interval: null,
    roomId: ""
  },

  // 获取列表
  getList() {
    let self = this
    wx.request({
      method: "GET",
      url: 'https://cloud.piesat.cn/api/v1/zhibo/get_all',
      data: {
        key: "51yL8vWV2b74guG8",
        serial: this.roomId,
        recordtype: 1,
      },
      success: (res) => {
        if (res.data.code == 0) {
          let names = ["未开播", "直播中", "已结束"]
          for (let i = 0; i < res.data.data.length; i++) {
            let item = res.data.data[i];
            if (item.class_state || item.class_state == 0) {
              item.class_name = names[item.class_state + 1];
            } else {
              item.class_name = "未开播"
            }
          }
          self.setData({
            live_list: res.data.data
          })
        } else {
          wx.showToast({
            title: '列表获取失败',
            icon: "none",
            duration: 1500
          })

        }
      }
    })
  },
  // 点击跳转对应页面
  startPlay(e) {
    if (e.currentTarget.dataset['obj'].class_state === -1) {
      // 预告
      return
    } else if (e.currentTarget.dataset['obj'].class_state === 0) {
      // 上课
      wx.navigateTo({
        url: '../liveing/liveing?id=' + e.currentTarget.dataset['obj'].classroom_id
      })
    } else if (e.currentTarget.dataset['obj'].class_state === 1) {
      // 回放
      wx.navigateTo({
        url: '../videoPlay/videoPlay?video=' + e.currentTarget.dataset['obj'].https_playpath_mp4
      })
    }
  },
  // 获取直播信息
  getRoomId() {
    wx.request({
      method: "GET",
      url: "https://cloud.piesat.cn/api/v1/zhibo/get_latestScript",
      data: {},
      success: (res) => {
        if (res.data.code == 0) {
          this.roomId = res.data.data.classroom_id
          this.getList()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
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
    this.getRoomId()
    // return
    this.interval = setInterval(() => {
      this.getList()
    }, 3000)
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
    clearInterval(this.interval)
    this.interval = null;
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