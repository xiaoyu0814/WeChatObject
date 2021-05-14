//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../history/history'
    })
    this.url = "http://localhost:8080/#/AI"
    console.log(this.url)
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  click_fun: function (params) {
    console.log(123)
  },
  getLiveRoomgetLiveRoom() {
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
        console.log(res)
        if (res.statusCode == 200) {
          console.log("成功")
          let length = res.data.room.length;
          let getRoomList = res.data.room[length - 1].serial;
          self.getLive(getRoomList);
        }
      },
      fail: function () {
        app.consoleLog("请求数据失败");
      },
      complete: function () {
        // complete 
      }
    })
  },
  getLive(num) {
    wx.request({
      url: 'https://cloudclass.ksyun.com/WebAPI/getroombytime',
      data: {
        key: "51yL8vWV2b74guG8",
        serial: num
      },
      success: (res) => {
        console.log(res)
      }
    })
    console.log(num)
  }

})