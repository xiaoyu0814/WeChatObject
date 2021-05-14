import {
  hexMD5
} from "../../utils/md5.js"

Page({
  data: {
    pathLive: "",
    roomId: ""
  },

  onLoad: function (option) {
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
    this.cishu = 1
    // this.getRoomId()
    this.roomId = option.id
    this.getLive()
    this.interval = setInterval(() => {
      this.getLiveType();
      this.cishu++
    }, 3000)
  },

  getLive() {
    let key = "51yL8vWV2b74guG8";
    let domain = "HTHT";
    let serial = this.roomId;
    let username = "lll";
    let usertype = 2;
    let ts = parseInt(new Date().getTime() / 1000);
    let auth = hexMD5(
      key + parseInt(new Date().getTime() / 1000) + this.roomId + 2
    ).toString();
    // let path = "http://cloud.piesat.cn/api/v1/zhibo/entry";

    let path = "https://cloudclass.ksyun.com/WebAPI/entry";
    console.log("直播路径", path +
      "?domain=" +
      domain +
      "&serial=" +
      serial +
      "&username=" +
      username +
      "&usertype=" +
      usertype +
      "&ts=" +
      ts +
      "&auth=" +
      auth)
    this.setData({
      pathLive: path +
        "?domain=" +
        domain +
        "&serial=" +
        serial +
        "&username=" +
        username +
        "&usertype=" +
        usertype +
        "&ts=" +
        ts +
        "&auth=" +
        auth
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
          if (res.data.data.classstate == 0) {
            if (this.cishu > 1) {} else {
              // this.getLive();
            }
          } else {
            clearInterval(this.interval)
            this.interval = null
            wx.navigateTo({
              url: '../afterLive/afterLive'
            })
          }
        } else if (res.data.code == 1) {
          clearInterval(this.interval)
          this.interval = null
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
        if (res.data.code == 0) {
          this.roomId = res.data.data.classroom_id
          // this.getLiveType();
          this.getLive()
        } else {

        }
      }
    })
  },
})