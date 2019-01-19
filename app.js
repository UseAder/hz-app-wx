//app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    var that = this
    wx.getStorage({
      key: 'hzAppToken',
      success: function (res) {
        that.globalData.hzAppToken = res.data 
      },
      fail: function () { }
    })
  },
  globalData: {
    displayName: '货速运货主',
    serverUrl: 'http://10.0.0.123:18671/',//测试
    // serverUrl: 'https://hz.xcx.56linker.com/',//测试
    hzAppToken: '',
    //在token失效后调整登陆页标记，如果已跳转，其他请求在token失效时就不需要在跳转了。
    directLoginPageFlag: false,
    enterpriseId: '',// tabBar切换无法传参 定义全局enterpriseId-->进行筛选
    selectScreen: false,// tabBar切换筛选 状,
    screenTitleIndex: 0// tabBar切换筛选下标,
  }
})