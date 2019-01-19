const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    logoUrl: '',
    phone: '', //手机号
    code: '', //验证码
    codename: '获取验证码',
    disabled: false, //验证码发送状态
    zymConfirm: false,
    getPhoneNumber: ''
  },
  // 获取输入框手机号 
  getPhoneValue: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取输入框验证码
  getCodeValue: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取验证码接口
  obtainYzm: function() {
    var a = this.data.phone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      util.obtainYzmFun({
        data: {
          mobile: this.data.phone
        }
      }, function(err, res) {
        var num = 60;
        var timer = setInterval(function() {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            _this.setData({
              codename: '重新发送',
              disabled: false
            })
          } else {
            _this.setData({
              disabled: true,
              codename: num + "s"
            })
          }
        }, 1000)
      });
    }
  },
  save: function() {
    var that = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (that.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (that.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    util.saveFun({
      data: {
        mobile: that.data.phone,
        captcha: that.data.code
      },
      header: {
        'content-type': 'application/json', // 默认值
        'hz-app-token': app.globalData.hzAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        wx.switchTab({
          url: '../delive/delive'
        });
      }
    });
  },
  getPhoneNumber: function(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function(res) {
          util.getPhoneNumberFun({
            data: {
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            },
            header: {
              'content-type': 'application/json',
              'hz-app-token': app.globalData.hzAppToken
            }
          }, function(err, res) {
            if (res.data.code == "200") {
              wx.switchTab({
                url: '../delive/delive'
              });
            }
          });
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {}
      })
    }
  },
  onLoad: function(option) {
    var that = this
    wx.login({
      success: function(res) {
        if (res.code) {
          util.codeFun({ // 调用登录接口获取临时登录凭证（code）
            data: {
              code: res.code
            }
          }, function(err, res) {
            wx.setStorage({
              key: "hzAppToken",
              data: res.data.data.token
            })
            app.globalData.hzAppToken = res.data.data.token
            if (res.data.data.accept == true && !option.login) {
              wx.reLaunch({
                url: '../delive/delive',
                success: function() {
                  app.globalData.directLoginPageFlag = false
                }
              })
            }
          });
        } else {
          wx.showToast({
            title: '获取用户登录态失败！' + res.errMsg,
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }
    })
    wx.setNavigationBarTitle({
      title: app.globalData.displayName
    })
  }
})