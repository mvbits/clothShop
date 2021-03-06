// addressList.js
var app = getApp()

Page({

  data: {
    domain: app.globalData.config.domain,
    addressList:[],
    pageType:"",//0 确认订单页； 2 订单详情页
    addressLength: 0
  },

  onLoad: function (options) {
    console.log("获取："+options.pagetype);
    this.setData({
      pageType:options.pagetype
    });
  },

  onReady: function () {
  },

  onShow: function () {
    console.log("show获取");
    this.getAddressList();
  },

  onUnload: function () {
  
  },
  
  //地址请求
  getAddressList:function(){
    var that = this;
    wx.request({
      url: that.data.domain + '/api/useraddress/16777215',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'GET',
      success: function (res) {
        var statusCode = res.data.statusCode;
        if (app.isShouldLogin(statusCode)) {
          app.doLogin(function() {
            that.getAddressList();
          });
        } else if(app.isSuccess(statusCode)) {
          that.setData({
            addressList: res.data.data,
            addressLength: res.data.data.length
          });
        } else {
          app.showToast("嗷嗷，收货地址获取失败~~", that);
          console.log(" get address list error msg: " + res.data.msg);
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },
  //删除地址
  delAddress:function(e){
    var that = this,
        id = e.currentTarget.dataset.id;
    if (!id || that.data.addressLength==1){
      return false;
    }
    wx.request({
      url: that.data.domain + '/api/useraddress/16777215/address/' + id+'',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'POST',
      success: function (res) {
        var statusCode = res.data.statusCode;
        if(app.isShouldLogin(statusCode)) {
          app.doLogin(function() {
            that.delAddress();
          });
        } else if(app.isSuccess(statusCode)) {
          app.showToast('删除成功', that);
          that.getAddressList();
        } else {
          console.error("del address error msg: " + res.data.msg);
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //设置默认地址
  setDefalut:function(e){
    var that = this,
      id = e.currentTarget.dataset.id,
      isDefault = e.currentTarget.dataset.isdefault;
    console.log("isDefault:" + isDefault);
    if (!id || isDefault==0) {
      return false;
    }
  
    wx.request({
      url: that.data.domain + '/api/useraddress/16777215/defaultaddress/'+id+'',
      header: {
        'content-type': 'application/json',
        'access_token': app.getToken()
      },
      method: 'POST',
      success: function (res) {

        var statusCode = res.data.statusCode;
        if (app.isShouldLogin(statusCode)) {
          app.doLogin(function () {
            that.setDefalut();
          });
        } else if (app.isSuccess(statusCode)) {
          app.showToast('设置成功', that);
          that.getAddressList();
        } else {
          console.error("set default address error msg: " + res.data.msg);
        }
      },
      fail: function () {
        console.error("失败");
      }
    });
  },

  //选择地址后的回调
  selectAddress:function(e){
    console.log("这里呀呀呀呀"+this.data.pageType);
    var addressId = e.currentTarget.dataset.id,
        url = "../confirmOrder/confirmOrder?id=" + addressId;
    if (this.data.pageType==1){
      url = "../orderDetail/orderDetail?id=" + addressId;
    }
    app.globalData.addressId = addressId;
    wx.navigateBack();
  }
})