//app.js
import {
  hexMD5
} from "./utils/md5.js"
// const hexMD5 = require('js-md5')
let pieIp = "https://engine.piesat.cn/dev";
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    backVideoUrl: '',
  },
  UrlPath: {
    login: pieIp + "/account/api/auth/login",
    phoneRegist: pieIp + "/account/api/auth/regist",
    emailRegist: pieIp + "/account/api/auth/mail/register",
    phoneCode: pieIp + "/account/api/auth/getCodeByTel",
    emailCode: pieIp + "/account/api/auth/getMailCaptcha",
    phonePWDre: pieIp + "/account/api/sys/user/updatePwdByTel",
    emailPWDre: pieIp + "/account/api/sys/user/updatePwdByMail",
    checkPhoneConPWD: pieIp + "/account/api/auth/checkTelWithCode",
    checkEmailConPWD: pieIp + "/account/api/auth/checkMailWithCode",
    checkMailExists: pieIp + "/account/api/auth/checkMailExists",
    checkTelExists: pieIp + "/account/api/auth/checkTelExists",
    checkUsername: pieIp + "/account/api/auth/checkUsername", //检测用户名是否可用
    queryUserInfo: pieIp + "/pie-authorization/user/userInfo"
  },
  MD5: hexMD5
})