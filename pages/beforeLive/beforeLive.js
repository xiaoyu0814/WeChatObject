Page({
  data: {
    title: "",
    message: "",
    interval: null,
    roomId: "",
    bg_image: "123",
    person_image: "456"
  },

  // 获取直播信息
  getRoomId() {
    wx.request({
      method: "GET",
      url: "https://cloud.piesat.cn/api/v1/zhibo/get_latestScript",
      data: {},
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            bg_image: res.data.data.class_image,
            person_image: res.data.data.person_image,
            title: res.data.data.person_info,
            message: res.data.data.class_description
          })
          this.roomId = res.data.data.classroom_id
          this.getLiveType()
        } else {

        }
      }
    })
  },
  // 获取直播状态
  getLiveType() {
    wx.request({
      method: "GET",
      url: "https://cloud.piesat.cn/api/v1/zhibo/get_statusByRoomId",
      data: {
        roomId: this.roomId
      },
      success: (res) => {
        if (res.data.code == 0) {
          clearInterval(this.interval)
          this.interval = null
          if (res.data.data.classstate == 0) {
            wx.navigateTo({
              url: '../liveing/liveing'
            })
          } else {
            wx.navigateTo({
              url: '../afterLive/afterLive'
            })
          }
        } else if (res.data.code == 1) {

        }
      }
    })
  },
  // 跳转至历史列表页
  goToAfter() {
    wx.navigateTo({
      url: '../history/history'
    })
  },

  onLoad: function () {
    this.getRoomId();
    this.interval = setInterval(() => {
      this.getLiveType();
    }, 3000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(123)
  },
})