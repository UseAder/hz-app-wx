const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    screenData: []
  },
  binding() {
    wx.navigateTo({
      url: '../binding/binding'
    });
  },
  deliveScreen(e) { //跳转到delive页面筛选该企业全部运单
    var Index = e.currentTarget.dataset.index
    app.globalData.enterpriseId = e.currentTarget.dataset.enterpriseid;
    app.globalData.screenTitleIndex = Index;
    app.globalData.selectScreen = true;
    wx.reLaunch({
      url: '../delive/delive'
    });
  },
  onShow: function() {
    var that = this;
    util.shortNameTitleFun({
      data: {},
      header: {
        'content-type': 'application/json',
        'hz-app-token': app.globalData.hzAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        that.setData({
          screenData: res.data.data
        })
      }
    });
  }
})