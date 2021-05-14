Page({
  data: {
    backShow: false,
    videoUrl: '',
    roomId: "",
    liveTime: "2：15：45"
  },

  onShow: function () {
    this.getRoomId();
    this.interval = setInterval(() => {
      this.getLiveType();
    }, 3000)
  },

  onLoad: function () {

  },

  getLiveRoom() {
    let self = this;
    let params = {
      key: "51yL8vWV2b74guG8",
      starttime: new Date("2020-09-11 18:54:53").getTime() / 1000,
      endtime: new Date("2020/09/30 18:53:59").getTime() / 1000,
      // timetype: 0
    };
    wx.request({
      url: 'https://cloud.piesat.cn/api/v1/zhibo/getroombytime', //url
      // url: 'https://cloud.piesat.cn/api/v1/zhibo/getroomlist', //url
      method: 'GET', //请求方式
      header: {
        'Content-Type': 'application/json',
      },
      data: params,
      success: (res) => {
        if (res.statusCode == 200) {
          let length = res.data.room.length;
          let getRoomList = res.data.room[length - 1].serial;
          this.roomId = getRoomList
          self.getLive(getRoomList);
        }
      }
    })
  },

  getLive(num) {
    wx.request({
      url: 'https://cloudclass.ksyun.com/WebAPI/getrecordlist',
      data: {
        key: "51yL8vWV2b74guG8",
        serial: num,
        recordtype: 1
      },
      success: (res) => {
        this.setData({
          videoUrl: res.data.recordlist[0].https_playpath_mp4
        });
        this.videoUrl = res.data.recordlist[0].https_playpath_mp4
      }
    })
  },
  back: function () {
    this.setData({
      backShow: true
    })
  },
  backplay: function () {
    this.videoContext = wx.createVideoContext('backVideo', this);
    this.videoContext.requestFullScreen({
      direction: 90
    });
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
          if (res.data.data.classstate == 0) {
            clearInterval(this.interval)
            this.interval = null
            // 进入直播
            wx.navigateTo({
              url: '../liveing/liveing'
            })
          }
        } else if (res.data.code == 1) {
          clearInterval(this.interval)
          this.interval = null
          // 进入预告
          wx.navigateTo({
            url: '../live_list/live_list'
          })
        }
      }
    })
  },
  // 获取直播信息
  getRoomId() {
    wx.request({
      method: "GET",
      url: "https://cloud.piesat.cn/api/v1/zhibo/get_latestScript",
      data: {},
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          this.roomId = res.data.data.classroom_id
          this.getLiveType();
        } else {

        }
      }
    })
  },
})