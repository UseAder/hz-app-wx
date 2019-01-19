const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    statusCurrent: '', //得到status状态 进行传递
    enterpriseId: '', //得到承运方id
    selectIndex: 0, //选择的下拉列表下标
    allWaybill: '全部运单',
    screenTitle: '筛选的企业',
    records: {},
    pageNo: 1,
    hasMoreData: false, //上拉加载是否还存在着数据
    selectScreen: false, //控制筛选的背景变化
    selectShow: false, //控制选择下拉列表的显示隐藏，false隐藏、true显示
    screenTitleShow: false,
    selectData: [{
        current: '',
        name: '全部运单'
      },
      {
        current: 10,
        name: '进行中的运单'
      },
      {
        current: 25,
        name: '已完成的运单'
      }
    ], //下拉列表的数据
    screenShow: false, //控制筛选下拉列表的显示隐藏，false隐藏、true显示
    screenIndex: 0, //筛选的下拉列表下标 
    screenData: [] //筛选列表的数据 { enterpriseId:'', shortName: "全部" }
  },
  waybillList(e) {
    wx.navigateTo({
      url: '../Waybill/Waybill?id=' + e.currentTarget.dataset.id
    });
  },
  screenTitleCuo() {
    var that = this;
    that.setData({
      selectScreen: false,
      screenTitleShow: false,
      screenIndex: 0,
      statusCurrent: '',
      allWaybill: that.data.selectData[0].name
    })
   app.globalData.screenTitleIndex=0
    app.globalData.enterpriseId = ''
    that.loadData()
  },
  // 点击下拉显示框
  selectTitle() {
    // if (!this.data.selectScreen&&!this.data.screenShow){
    this.setData({
      selectShow: !this.data.selectShow,
      screenShow: false,
      
    }); 

    if (this.data.screenTitleShow){
      this.setData({
        selectScreen: true
      })
    }

    // }else{
    //   wx.showToast({
    //     title:'请先点击红色图标退出筛选列表',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
  },
  // 点击选择下拉列表
  selectOptionTap(e) {
    var that = this;
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    that.setData({
      pageNo: 1,
      selectIndex: Index,
      statusCurrent: e.currentTarget.dataset.current,
      selectShow: false,
      allWaybill: that.data.selectData[Index].name,
      // selectScreen: false, 
      screenIndex: 0 //取消筛选状态,
    });
      that.loadData();
  },
  // 点击筛选显示框
  screenTitle() {
    console.log(2)
    this.setData({
      selectShow: false,
      screenShow: !this.data.screenShow,
      selectScreen: !this.data.selectScreen, //控制筛选的背景变化
      screenIndex: app.globalData.screenTitleIndex
    });
  },
  // 点击筛选下拉列表
  screenOptionTap(e) {
    var that = this;
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    app.globalData.enterpriseId = e.currentTarget.dataset.enterpriseid,

      app.globalData.screenTitleIndex = Index

    that.setData({
      screenTitleShow: true,
      pageNo: 1,
      screenIndex: app.globalData.screenTitleIndex,
      screenShow: false,
      selectScreen: true,
      screenTitle: that.data.screenData[app.globalData.screenTitleIndex].shortName
    });
    that.loadData();
  },
  loadData: function() {
    var that = this;
    util.listDeliveFun({
      data: {
        status: that.data.statusCurrent,
        enterpriseId: app.globalData.enterpriseId,
        pageNo: that.data.pageNo
      },
      header: {
        'content-type': 'application/json',
        'hz-app-token': app.globalData.hzAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
    
        if (res.data.records != null) {
         


          var recordslistTem = that.data.records
          var recordslist = res.data.records
          for (var i in recordslist) {
            recordslist[i].trackTime = recordslist[i].trackTime.slice(0, -2)
            if (recordslist[i].payType == 1) {
              recordslist[i].payType = '现付'
            } else if (recordslist[i].payType == 2) {
              recordslist[i].payType = '到付'
            } else if (recordslist[i].payType == 3) {
              recordslist[i].payType = '回付'
            } else if (recordslist[i].payType == 4) {
              recordslist[i].payType = '月结'
            } else if (recordslist[i].payType == 5) {
              recordslist[i].payType = '欠付'
            } else if (recordslist[i].payType == 6) {
              recordslist[i].payType = '多笔付'
            }
          }

          console.log(res.data)
          if (that.data.pageNo == 1) {
            recordslistTem = []
          }
          if (that.data.pageNo >= res.data.totalPage) {
            that.setData({
              records: recordslistTem.concat(recordslist),
              hasMoreData: false,
            })
          } else {
            that.setData({
              records: recordslistTem.concat(recordslist),
              hasMoreData: true,
              pageNo: that.data.pageNo + 1,
            })
          }
        } else {
          that.setData({
            records: {}
          })
          wx.showToast({
            title: '暂无运单',
            icon: 'none',
            duration: 4000
          })
        }
      }
    });
    var basic = "abc,def,ghi,";  
    basic = basic.substr(0, basic.length - 2); 
    
  },
  shortNameTitleData:function(){
    var that = this;
    util.shortNameTitleFun({
      data: {},
      header: {
        'content-type': 'application/json',
        'hz-app-token': app.globalData.hzAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        let screenSetData = res.data.data;

        if (screenSetData != '') {
          that.setData({
            screenData: screenSetData,
            screenTitle: screenSetData[app.globalData.screenTitleIndex].shortName,
            selectIndex: 0, //选择的下拉列表下标,
            allWaybill: that.data.selectData[0].name
          })
        }
      }
    });
  },
  onLoad: function() {
    var that = this;
    that.setData({
      selectScreen: app.globalData.selectScreen,
      screenTitleShow: app.globalData.selectScreen,
    })
    that.shortNameTitleData()
   
  },

  onShow: function() {
    wx.setNavigationBarTitle({
      title: app.globalData.displayName
    })
    this.setData({
      
      pageNo:1,
      selectShow: false,
      screenShow: false,
      screenIndex: app.globalData.screenTitleIndex
    })  
    this.loadData();
    // this.shortNameTitleData()
  },
  /**
   * 页面相关事件处理函数--监听用户上拉加载动作
   */
  onReachBottom: function() {
    console.log(this.data.hasMoreData)
    if (this.data.hasMoreData) {
      this.loadData()
    } else {
      wx.showToast({
        title: '没有更多数据了',
        duration: 1000
      })
    }
  },
})