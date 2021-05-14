const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
    password: "",
    getCheckCode_value: "",
    checkCode: ""
  },

  /**
   * 事件处理函数
   */
  //创建验证码
  createCode: function () {
    var code = "";
    var codeLength = 4; //验证码的长度
    ////所有候选组成验证码的字符，当然也可以用中文的
    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    //循环组成验证码的字符串
    for (var i = 0; i < codeLength; i++) {
      //获取随机验证码下标
      var charNum = Math.floor(Math.random() * 10);
      //组合成指定字符验证码
      code += codeChars[charNum];
    }
    this.checkCode = code;
    this.setData({
      checkCode: code
    })
  },
  //登录验证
  submitForm() {
    if (this.userName === undefined || this.userName === "") {
      wx.showToast({
        title: "用户名不能为空",
        icon: 'none',
        duration: 800,
        mask: true
      });
      return
    }
    if (this.password === undefined || this.password === "") {
      wx.showToast({
        title: "密码不能为空",
        icon: 'none',
        duration: 800,
        mask: true
      });
      return
    }
    if (this.getCheckCode_value === undefined || this.getCheckCode_value === "") {
      wx.showToast({
        title: "验证码不能为空",
        icon: 'none',
        duration: 800,
        mask: true
      });
      return
    } else {
      if (this.getCheckCode_value === this.checkCode) {} else {
        wx.showToast({
          title: "验证码错误",
          icon: 'none',
          duration: 800,
          mask: true
        });
        return
      }
    }
    this.getLogin();
  },
  // 登陆
  getLogin() {
    let self = this;
    let param = {
      isMd5: true,
      password: app.MD5(this.password),
      username: this.userName,
    };
    wx.request({
      url: app.UrlPath.login,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
      },
      data: param,
      success: function (res) {
        if (res.data.success) {
          // 登录成功  存储token  跳转页面
          wx.setStorage({
            key: "token",
            data: res.data.data.token
          })
          wx.setStorage({
            key: "day",
            data: new Date().getDate()
          })
          // self.getLiveType()
          wx.navigateTo({
            url: '../live_list/live_list'
          })
        } else {
          // 登录失败 清空输入框 弹出消息框
          self.setData({
            userName: "",
            password: "",
            getCheckCode_value: "",
          })
          self.userName = ""
          self.password = ""
          self.getCheckCode_value = ""
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true
          });
          self.createCode(); //验证码刷新
        }
      },
    })
  },
  // 获取输入框内的用户名
  getUserName: function (e) {
    this.userName = e.detail.value;
  },
  // 获取输入框内的密码
  getPassword: function (e) {
    this.password = e.detail.value;
  },
  // 获取输入框内的验证码
  getCheckCode: function (e) {
    this.getCheckCode_value = e.detail.value;
  },
  // 跳转至注册页
  goToRegister() {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  // 跳转至重置页
  goToResetPWD() {
    wx.navigateTo({
      url: '../resetPWD/resetPWD'
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
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getRoomId();
    this.createCode();
    var day = new Date().getDate()
    var oldDay = wx.getStorageSync('day')
    if (day != oldDay) {
      wx.clearStorage()
      return
    }
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '../live_list/live_list'
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})