const app = getApp()
Page({
  data: {
    videoUrl: app.globalData.backVideoUrl
  },
  onLoad: function (options) {
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
    console.log(options)
    if (options.video) {
      this.setData({
        videoUrl: options.video,
      });
    }
  },
  backplay:function(){
    this.videoContext = wx.createVideoContext('backVideo', this);
    this.videoContext.requestFullScreen({ direction: 90 });
  }
})