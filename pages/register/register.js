const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
    confirm: "",
    phone_Mail: "",
    checkCode: "",
    checkbox: false,
    getCheckCode_name: "获取验证码",
    getCheckCode_show: true,
    countdown: 300,
    interval: null,
    mechanismname: "",
    region: ["", "请选择所在城市（选填）", ""],
    changeBox: true,
  },

  /**
   * 事件处理函数
   */
  // 跳转隐私协议
  goToAgreement() {
    wx.navigateTo({
      url: '../agreement/agreement'
    })
  },
  // 验证用户名是否可用
  checkUsername(e) {
    this.username = e.detail.value
    wx.request({
      url: app.UrlPath.checkUsername,
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        username: this.username
      },
      success: (res) => {
        if (res.data.code == 0) {
          //如果code等于0
        } else {
          //否则返回用户名已存在
          wx.showToast({
            title: "用户名已存在,请更换",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        }
      }
    })
  },
  // 获取密码
  getPassword(e) {
    if (e.detail.value.length < 6) {
      wx.showToast({
        title: "密码不得小于6位",
        icon: "none",
        duration: 1000,
        mask: true
      })
      this.setData({
        password: ""
      })
      return
    }
    this.password = e.detail.value;
  },
  // 获取确认密码
  getConfirm(e) {
    if (e.detail.value == this.password) {
      this.confirm = e.detail.value;
    } else {
      wx.showToast({
        title: "确认密码与密码不一致",
        icon: 'none',
        duration: 800,
        mask: true
      });
      this.setData({
        confirm: ""
      })
      return
    }
  },
  // 获取手机号或邮箱
  getPhone_Mail(e) {
    this.phone_Mail = e.detail.value;
    this.getCheckCode();
  },
  // 获取验证码
  getCheckCode_value(e) {
    this.checkCode = e.detail.value;
  },
  // 复选框
  checkboxChange(e) {
    this.checkbox = e.detail.value[0] == "false" ? true : false;
  },
  // 跳转至登陆页面
  goToLogin() {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  // 获取验证码
  getCheckCode() {
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
      if (this.phone_Mail === undefined || this.phone_Mail === "") {
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
  // 验证手机号
  checkPhone() {
    if (this.phone_Mail == undefined || this.phone_Mail == "") {
      return;
    }
    let postPhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    let keyPhone = postPhone.test(this.phone_Mail);
    if (!keyPhone) {
      //如果不符合规则返回false
      return false;
    } else {
      //否则返回true
      return true;
    }
  },
  // 验证邮箱
  checkEmail() {
    if (this.phone_Mail == undefined || this.phone_Mail == "") {
      return;
    }
    var postEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    let keyEmail = postEmail.test(this.phone_Mail);
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
        tel: this.phone_Mail,
      },
      success: (res) => {
        if (res.data.code == 0) {
          wx.showToast({
            title: "该手机号已被注册",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        } else {
          //如果没注册获取验证码
          this.getVerification();
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
        mail: this.phone_Mail,
      },
      success: (res) => {
        if (res.data.code == 0) {
          //如果code等于0提示邮箱已注册
          wx.showToast({
            title: "该邮箱已被注册",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        } else {
          //否则获取邮箱验证码
          this.getEmailVerification();
        }
      }
    })
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
        tel: this.phone_Mail,
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
        mail: this.phone_Mail,
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
  // 下一步
  next() {
    if (this.username === undefined || this.username === "") {
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
    if (this.confirm === undefined || this.confirm === "") {
      wx.showToast({
        title: "确认密码不能为空",
        icon: 'none',
        duration: 800,
        mask: true
      });
      return
    }
    if (this.phone_Mail === undefined || this.phone_Mail === "") {
      wx.showToast({
        title: "手机号或邮箱不能为空",
        icon: 'none',
        duration: 800,
        mask: true
      });
      return
    }
    if (this.checkCode === undefined || this.checkCode === "") {
      wx.showToast({
        title: "验证码不能为空",
        icon: 'none',
        duration: 800,
        mask: true
      });
      return
    }
    if (!this.checkbox) {
      wx.showToast({
        title: "请同意隐私协议",
        icon: 'none',
        duration: 800,
        mask: true
      });
      return
    }
    this.setData({
      changeBox: false
    })
  },
  // 获取机构名称
  getMechanismname(e) {
    this.mechanismname = e.detail.value
  },
  // 选择省市区函数
  changeRegin(e) {
    this.region = e.detail.value
    this.setData({
      region: e.detail.value
    });
  },
  // 获取联系人
  getContacts(e) {
    this.contacts = e.detail.value
  },
  // 获取联系人电话
  getContactNumber(e) {
    this.contactNumber = e.detail.value
  },
  // 创建帐号
  create() {
    if (this.checkPhone()) {
      this.register()
    } else {
      this.emailRegist()
    }
  },
  // 手机注册
  register() {
    wx.request({
      method: "POST",
      url: app.UrlPath.phoneRegist,
      data: {
        username: this.username, //用户名
        tel: this.phone_Mail, //手机号
        pwd: app.MD5(this.password), //密码
        conPwd: app.MD5(this.confirm), //确认密码
        captcha: this.checkCode, //验证码
        isMd5: true,
        cityInfo: `${this.region[0]==""?"":this.region[0]}/${this.region[1]=="请选择所在城市（选填）"?"":this.region[1]}/${this.region[2]==""?"":this.region[2]}`, //城市
        contactInfo: this.contactNumber, //机构联系方式
        nickname: this.contacts, //联系人
        organizationName: this.mechanismname, //机构名称
      },
      success: (res) => {
        if (res.data.code == 0) { //如果等于0 提示注册成功并返回登录页面
          wx.showToast({
            title: "注册成功",
            icon: "none",
            duration: 1000,
            mask: true
          })
          wx.navigateTo({
            url: '../login/login'
          })
        } else { //否则提示错误信息
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000,
            mask: true
          })
        }
      },
    })
  },
  // 邮箱注册
  emailRegist() {
    wx.request({
      method: "POST",
      url: app.UrlPath.emailRegist,
      data: {
        username: this.username, //用户名
        mail: this.phone_Mail, //手机号
        pwd: app.MD5(this.password), //密码
        conPwd: app.MD5(this.confirm), //确认密码
        captcha: this.checkCode, //验证码
        isMd5: true,
        cityInfo: `${this.region[0]==""?"":this.region[0]}/${this.region[1]=="请选择所在城市（选填）"?"":this.region[1]}/${this.region[2]==""?"":this.region[2]}`, //城市
        contactInfo: this.contactNumber, //机构联系方式
        nickname: this.contacts, //联系人
        organizationName: this.mechanismname, //机构名称
      },
      success: (res) => {
        if (res.data.code == 0) { //如果等于0 提示注册成功并返回登录页面
          wx.showToast({
            title: "注册成功",
            icon: "none",
            duration: 1000,
            mask: true
          })
          wx.navigateTo({
            url: '../login/login'
          })
        } else { //否则提示错误信息
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000,
            mask: true
          })
        }
      },
    })
  },
  // 返回上一步
  goback() {
    this.setData({
      changeBox: true
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