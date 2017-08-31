// confirmOrder.js
var app = getApp();
Page({

  data: {
    domain: app.config.domain,
    defalutAddreee:"",
    addressId:"",
    proInfo:"",
    allMoney:0
  },

  onLoad: function (options) {
    console.log("onLoad");
    var allMoney = 0;
    var proInfo = wx.getStorageSync('proInfo');
    console.log("参数:" + JSON.stringify(proInfo[0]));
    for(var i=0;i<proInfo.length;i++){
      allMoney = (parseFloat(allMoney) + parseFloat(proInfo[i].proNum * proInfo[i].shopPrice)).toFixed(2);
    }
    this.setData({
      proInfo: proInfo,
      allMoney: allMoney
    });
  },

  onReady: function () {
    console.log("onReady");
  },
  onShow: function () {
    console.log("onShow");
    if(this.data.addressId) {
      this.getAddressDetail();
    } else {
      this.getDefaultAddress();
    }
  },

  //请求默认地址
  getDefaultAddress(){
    var that = this,
        addressInfo = "";
    wx.request({
      url: that.data.domain + '/api/useraddress/16777215/defaultaddress',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        if (res.data.statusCode==200){
          that.setData({
            defalutAddreee:res.data.data,
            addressId: res.data.data.addressId
          });
        }
        console.log("成功");
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //请求地址
  getAddressDetail:function(){
    var that = this,
        addressInfo = "";
    wx.request({
      url: that.data.domain + '/api/useraddress/address/' + that.data.addressId + '',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        if (res.data.statusCode == 200) {
          addressInfo = res.data.data;
          addressInfo['address'] = res.data.data['provinceName'] + res.data.data['cityName'] + res.data.data['districtName']+res.data.data['address'];
          that.setData({
            defalutAddreee: addressInfo
          })
          console.log('成功');
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },

  //提交订单
  submitOrder: function () {
    var that = this,
      addressInfo = [
        {
          "colorId": 1,
          "goodsId": 2,
          "goodsNum": 5,
          "specId": 2
        },
        {
          "colorId": 1,
          "goodsId": 2,
          "goodsNum": 5,
          "specId": 2
        }
      ];
    console.log(typeof addressInfo);
    console.log("长度："+addressInfo.length);
    wx.request({
      url: that.data.domain + '/api/order/16777215',
      header: {
        'content-type': 'application/json'
      },
      data:{
        addressId: that.data.addressId,
        goodsReqVOList: addressInfo,
        userId: 16777215
      },
      method: 'POST',
      success: function (res) {
        if (res.data.statusCode == 200) {
          app.showToast("订单提交成功", that);
        }else{
          app.showToast("订单提交失败", that);
        }
      },
      fail: function () {
        console.log("失败");
      }
    });
  },
})