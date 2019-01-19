const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function requestGetApi(ApiName, cb, headers, completeCallback) {
  wx.showLoading({
    title: '数据加载中',
  })
  wx.request({
    url: app.globalData.serverUrl + ApiName,
    header: headers,
    success: function(res) {
      wx.hideLoading();
      if (res.data.code == '200') {
        
        typeof cb == "function" && cb(null, res)
      } else if (res.data.code == 'SOCIALACCOUNT_NOT_EXIST' || res.data.code == 'TOKEN_WRONG' || res.data.code == 'WX_TOKEN_NOT_EXIST' || res.data.code == 'TOKEN_OUT_TIME') {
        if (app.globalData.hzAppToken == headers['hz-app-token'] &&
          !app.globalData.directLoginPageFlag) {
          app.globalData.directLoginPageFlag = true
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function(res) {
      console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 4000
      })
    },
    complete: function(res) {
      typeof completeCallback == "function" && completeCallback(res)
    }
  })
}


function requestPostApi(ApiName, PostData, cb, completeCallback, isShowLoading) {
  if (isShowLoading) {} else {
    wx.showLoading({
      title: '数据加载中',
    })
  }
  wx.request({
    url: app.globalData.serverUrl + ApiName,
    data: PostData.data,
    method: 'POST',
    header: PostData.header,
    success: function(res) {
      if (isShowLoading) {} else {
        wx.hideLoading();
      }
      if (res.data.code == '200') {

        typeof cb == "function" && cb(null, res)
      } else if (res.data.code == 'SOCIALACCOUNT_NOT_EXIST' || res.data.code == 'TOKEN_WRONG' || res.data.code == 'WX_TOKEN_NOT_EXIST' || res.data.code == 'TOKEN_OUT_TIME') {
        if (app.globalData.hzAppToken == PostData.header['hz-app-token']
          && !app.globalData.directLoginPageFlag) {
          app.globalData.directLoginPageFlag = true
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      } else if (res.data.code == '400') {
        typeof cb == "function" && cb(null, res)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function(res) {
      console.log(res)

      if (isShowLoading) {} else {
        wx.hideLoading();

      }
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 4000
      })
    },
    complete: function(res) {

      typeof completeCallback == "function" && completeCallback(res)
    }
  })
}

function requestGetApi(ApiName, cb, headers, completeCallback) {
  wx.showLoading({
    title: '数据加载中',
  })
  wx.request({
    url: app.globalData.serverUrl + ApiName,
    header: headers,
    success: function(res) {
      wx.hideLoading();
      if (res.data.code == '200') {
        typeof cb == "function" && cb(null, res)
      } else if (res.data.code == 'SOCIALACCOUNT_NOT_EXIST' || res.data.code == 'TOKEN_WRONG' || res.data.code == 'WX_TOKEN_NOT_EXIST' || res.data.code == 'TOKEN_OUT_TIME') {

        if (app.globalData.hzAppToken == headers['hz-app-token']
          && !app.globalData.directLoginPageFlag) {
          app.globalData.directLoginPageFlag = true
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function(res) {
      console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 4000
      })
    },
    complete: function(res) {
      typeof completeCallback == "function" && completeCallback(res)
    }
  })
}

//POST请求
function codeFun(paraData, cb) { //// 调用登录接口获取临时登录凭证（code）hzAppToken
  requestPostApi('login/wx/token', paraData, cb)
}

function obtainYzmFun(paraData, cb) { //获取验证码
  requestPostApi('mobile/vcode', paraData, cb)
}

function getPhoneNumberFun(paraData, cb) { //微信快捷登入
  requestPostApi('login/wx/quick', paraData, cb)
}

function saveFun(paraData, cb) { //登入
  requestPostApi('login/wx/bind/phone', paraData, cb)
}

function listDeliveFun(paraData, cb, completeCallback) { //// 运单选择列表-->全部
  requestPostApi('waybill/list', paraData, cb, completeCallback)
}

function shortNameTitleFun(paraData, cb, completeCallback) { //// 运单筛选导航列表-->全部
  requestPostApi('waybill/enterprise/waybill', paraData, cb, completeCallback)
}

function bindingFun(paraData, cb) { //// 运单筛选导航列表-->全部
  requestPostApi('shipper/bind/enterprise', paraData, cb)
}

function waybillList(paraData, cb) { //// 运单详情
  requestGetApi('waybill/detail/' + paraData.id, cb, paraData.header)
}

module.exports = {
  formatTime: formatTime,
  saveFun,
  obtainYzmFun,
  getPhoneNumberFun,
  codeFun,
  listDeliveFun,
  shortNameTitleFun,
  waybillList,
  bindingFun
}