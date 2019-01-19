
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    account: '', //账号
    password:''
  },
  // 获取输入框账号 
  getAccountValue: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  // 获取输入框账号 
  getPasswordValue: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  binding: function () {
    var that = this;
  
    if (this.data.account == "") {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } 
    if (this.data.password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } 
    util.bindingFun({
      data: {
        account: that.data.account,
        password: that.data.password,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'hz-app-token': app.globalData.hzAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        wx.reLaunch({
          url: '../myinfor/myinfor'
        });

      } else {
        wx.showToast({
          title: '密码与账号不匹配',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
    });
  }
})