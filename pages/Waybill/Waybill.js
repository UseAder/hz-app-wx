const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    detailsOfTheWaybill: {},
  },
  onLoad: function (options) {
    this.data.id = options.id;
    var that = this;
    util.waybillList({
      id: that.data.id,
      header: {
        'content-type': 'application/json',
        'hz-app-token': app.globalData.hzAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        let data = res.data.data; 
        that.setData({
          detailsOfTheWaybill: data
        });
      }
    });
  }
})