const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    newPassword: "",
    newConfirm: "",
    checkCode: "",
    interval: null,
    getCheckCode_show: true,
    countdown: 300
  },

  /**
   * 事件处理函数
   */
  // 获取输入框内的用户名
  getUsername(e) {
    this.username = e.detail.value
    this.getCode_type()
  },
  // 获取输入框内的新密码
  getNewPassword(e) {
    if (e.detail.value.length < 6) {
      wx.showToast({
        title: "密码不得小于6位",
        icon: "none",
        duration: 1000,
        mask: true
      })
      this.setData({
        newPassword: ""
      })
      return
    }
    this.newPassword = e.detail.value;
  },
  // 获取输入框内的确认新密码
  getNewConfirm(e) {
    if (e.detail.value == this.newPassword) {
      this.newConfirm = e.detail.value;
    } else {
      wx.showToast({
        title: "确认密码与密码不一致",
        icon: 'none',
        duration: 800,
        mask: true
      });
      this.setData({
        newConfirm: ""
      })
      return
    }
  },
  // 获取输入框内的验证码
  getCheckCode(e) {
    this.checkCode = e.detail.value
  },
  // 检测手机号或邮箱是否已注册
  getCode_type() {
    let phoneInput = this.checkPhone();
    let checkEmail = this.checkEmail();
    if (phoneInput) {
      //如果输入的是手机号
      this.checkTelExists(); //检测手机号是否已注册
    } else if (checkEmail) {
      //如果是邮箱
      this.checkMailExists(); //检测邮箱是否已注册
    } else {
      //否则提示
      let message
      if (this.username === undefined || this.username === "") {
        message = "邮箱或手机号不能为空"
      } else {
        message = "输入的邮箱或手机号格式不正确,请更换"
      }
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },
  // 检测手机号
  checkPhone() {
    let postPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
    let keyPhone = postPhone.test(this.username);
    if (!keyPhone) {
      return false;
    } else {
      return true;
    }
  },
  // 检测邮箱
  checkEmail() {
    var postEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    let keyEmail = postEmail.test(this.username);
    if (!keyEmail) {
      //不符合验证规则返回false
      return false;
    } else {
      //否则返回true
      return true;
    }
  },
  // 手机号是否注册
  checkTelExists() {
    wx.request({
      method: "GET",
      url: app.UrlPath.checkTelExists,
      data: {
        tel: this.username,
      },
      success: (res) => {
        if (res.data.code == 0) {

        } else {
          // 如果没注册获取验证码
          wx.showToast({
            title: "该手机号未被注册，请先注册",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        }
      }
    })
  },
  // 邮箱是否注册
  checkMailExists() {
    wx.request({
      method: "GET",
      url: app.UrlPath.checkMailExists,
      data: {
        mail: this.username,
      },
      success: (res) => {
        if (res.data.code == 0) {
          //如果code等于0提示邮箱已注册
        } else {
          //否则获取邮箱验证码
          wx.showToast({
            title: "该邮箱未被注册，请先注册",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        }
      }
    })
  },
  // 发送验证码
  getCode() {
    if (this.username === undefined || this.username === "") {
      wx.showToast({
        title: "手机号或邮箱不能为空",
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    let phoneInput = this.checkPhone();
    if (phoneInput) {
      this.getVerification();
    } else if (!phoneInput) {
      this.getEmailVerification();
    }
  },
  // 获取手机验证码
  getVerification() {
    this.setData({
      getCheckCode_show: false,
    })
    let TIME_COUNT = 300;
    this.interval = setInterval(() => {
      if (TIME_COUNT > 0) {
        TIME_COUNT--;
        this.setData({
          countdown: TIME_COUNT
        })
      } else {
        clearInterval(this.interval);
        this.interval = null;
        this.setData({
          getCheckCode_show: true,
        })
      }
    }, 1000);
    wx.request({
      method: "GET",
      url: app.UrlPath.phoneCode,
      data: {
        tel: this.username,
      },
      success: (res) => {
        if (res.data.code == 0) {
          //提示验证码发送成功
          wx.showToast({
            title: "验证码已发送",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        } else {
          //否则提示错误消息
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true
          });
          this.setData({
            getCheckCode_show: true,
          })
        }
        clearInterval(this.interval);
        this.interval = null;
      }
    })
  },
  // 获取邮箱验证码
  getEmailVerification() {
    this.setData({
      getCheckCode_show: false,
    })
    let TIME_COUNT = 300;
    this.interval = setInterval(() => {
      if (TIME_COUNT > 0) {
        TIME_COUNT--;
        this.setData({
          countdown: TIME_COUNT
        })
      } else {
        clearInterval(this.interval);
        this.interval = null;
        this.setData({
          getCheckCode_show: true,
        })
      }
    }, 1000);
    wx.request({
      method: "GET",
      url: app.UrlPath.emailCode,
      data: {
        mail: this.username,
      },
      success: (res) => {
        if (res.data.code == 0) {
          //提示验证码发送成功
          wx.showToast({
            title: "验证码已发送",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        } else {
          //否则提示错误消息
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true
          });
          this.setData({
            getCheckCode_show: true,
          })
        }
        clearInterval(this.interval);
        this.interval = null;
      }
    })
  },
  // 重置密码
  reset() {
    if (this.username === undefined || this.username === "") {
      wx.showToast({
        title: "手机号或邮箱不能为空",
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if (this.newPassword === undefined || this.newPassword === "") {
      wx.showToast({
        title: "密码不能为空",
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if (this.newConfirm === undefined || this.newConfirm === "") {
      wx.showToast({
        title: "确认密码不能为空",
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if (this.checkCode === undefined || this.checkCode === "") {
      wx.showToast({
        title: "验证码不能为空",
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    let phoneInput = this.checkPhone();
    if (phoneInput) {
      this.register();
    } else if (!phoneInput) {
      this.emailPWDre();
    }
  },
  // 手机号重置密码
  register() {
    wx.request({
      method: "POST",
      url: app.UrlPath.phonePWDre,
      data: {
        tel: this.username,
        pwd: app.MD5(this.newPassword),
        conPwd: app.MD5(this.newConfirm),
        captcha: this.checkCode,
        isMd5: true,
      },
      success: (res) => {
        if (res.data.success) {
          wx.showToast({
            title: "密码重置成功",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true
          });
        }
      }
    })
  },
  // 邮箱重置密码
  emailPWDre() {
    wx.request({
      method: "POST",
      url: app.UrlPath.emailPWDre,
      data: {
        mail: this.username,
        pwd: app.MD5(this.newPassword),
        conPwd: app.MD5(this.newConfirm),
        captcha: this.checkCode,
        isMd5: true,
      },
      success: (res) => {
        if (res.data.success) {
          wx.showToast({
            title: "密码重置成功",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true
          });
        }
      }
    })
  },
  // 返回登陆
  goToLogin() {
    wx.navigateTo({
      url: '../login/login'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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