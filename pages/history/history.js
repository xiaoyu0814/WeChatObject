const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"回放记录",
    history_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLiveRoom();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(123)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLiveRoom() {
    let self = this;
    let params = {
      key: "51yL8vWV2b74guG8",
      starttime: new Date("2020/09/11 18:54:53").getTime() / 1000,
      endtime: new Date("2020/09/30 18:53:59").getTime() / 1000,
    };
    wx.request({
      url: 'https://cloud.piesat.cn/api/v1/zhibo/getroombytime', //url
      method: 'GET', //请求方式
      header: {
        'Content-Type': 'application/json',
      },
      data: params,
      success: (res) => {
        if (res.statusCode == 200) {
          let length = res.data.room.length;
          let getRoomList = res.data.room[length - 1].serial;
          self.getLive(getRoomList);
        }
      }
    })
  },
  getLive(num) {
    let self = this
    wx.request({
      url: 'https://cloud.piesat.cn/api/v1/zhibo/getrecordlist',
      data: {
        key: "51yL8vWV2b74guG8",
        serial: num,
        recordtype: 1
      },
      success: (res) => {
        console.log(res)
        self.setData({
          history_list: res.data.recordlist
        })
        this.history_list = res.data.recordlist
        console.log(this.history_list)
        // this.setData({
        //   videoUrl:res.data.recordlist[0].https_playpath_mp4
        // });

        // console.log(this.videoUrl)
        // this.videoUrl= res.data.recordlist[0].https_playpath_mp4
        // console.log(res.data.recordlist[0].https_playpath_mp4)
      }
    })
  },
  startPlay: function (e) {
    console.log(e)
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset)
    let obj = e.currentTarget.dataset['obj'];
    app.globalData.backVideoUrl = obj.https_playpath_mp4;
    wx.navigateTo({
      url: '../videoPlay/videoPlay'
    })
  },
})