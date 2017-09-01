// 获取全局应用程序实例对象
const app = getApp()
const useUrl = require('../../utils/service')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'payorder',
    index: 0,
    allMoney: 0,
    order: {},
    iindex: 0,
    items: [
      {name: '0', value: '堂食', checked: 'true'},
      {name: '1', value: '打包带走'},
      {name: '2', value: '外卖'}
    ],
    pindex: 0,
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, '15人以上'],
    sindex: 0,
    arrays: ['已在店', '今天', '明天', '后天']
  },
  bindTimeChange (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindPickerChanges (e) {
    this.setData({
      sindex: e.detail.value
    })
  },
  bindPickerChange (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pindex: e.detail.value
    })
  },
  radioChange (e) {
    this.setData({
      iindex: e.detail.value
    })
  },
  /**
   * 优惠券选择
   */
  concessionalChange (e) {
    // console.log(this.data.allMoney + (this.data.order.delMoney[e.detail.value]))
    if (this.data.order.delMoney[e.detail.value] < 1 && this.data.order.delMoney[e.detail.value] > 0) {
      this.data.order.allMoney = this.data.allMoney * this.data.order.delMoney[e.detail.value]
    } else {
      this.data.order.allMoney = (parseInt(this.data.allMoney) + (this.data.order.delMoney[e.detail.value]))
    }
    this.setData({
      index: e.detail.value,
      order: this.data.order
    })
  },
  /**
   * 小数点后两位
   * @param floatvar
   * @returns {*}
   */
  changeTwoDecimalf  (floatvar) {
    var fx = parseFloat(floatvar)
    if (isNaN(fx)) {
      return false
    }
    fx = Math.round(fx * 10000) / 100.00
    var sx = fx.toString()
    var posdecimal = sx.indexOf('.')
    if (posdecimal < 0) {
      posdecimal = sx.length
      sx += '.'
    }
    while (sx.length <= posdecimal + 2) {
      sx += '0'
    }
    return sx
  },
  /**
   * 支付货款
   */
  payMoney () {
    // let obj = {
    //   url: url,
    //   data: {
    //
    //   },
    //   method: 'GET',
    //   success (res) {
    //     // todo 付款流程
    //     // wx.requestPayment({
    //     //   'timeStamp': '',
    //     //   'nonceStr': '',
    //     //   'package': '',
    //     //   'signType': 'MD5',
    //     //   'paySign': '',
    //     //   'success':function(res){
    //     //   },
    //     //   'fail':function(res){
    //     //   }
    //     // })
    //   },
    //   fail (res) {
    //     console.log(res)
    //   }
    // }
    // wx.requset(obj)
  },
  /**
   * 获取订单详情信息
   * @param e
   */
  getOrderInfo (params) {
    let that = this
    let obj = {
      url: useUrl.serviceUrl.order_info,
      data: {
        session_key: wx.getStorageSync('session_key'),
        shop_id: params.s_id,
        o_id: params.o_id
      },
      success (res) {
        // console.log(res)
        let order = res.data.data
        if (order.coupons) {
          order.concessional = order.coupons
          let delMoney = []
          let coupons = []
          for (var item of order.coupons) {
            delMoney.push(parseInt(item.amount) * -1)
            coupons.push('满' + item.use_price + '减' + item.amount + '元')
          }
          order.delMoney = delMoney
          order.allMoney = parseInt(order.order.order_price) + delMoney[0]
          order.coupons = coupons
          return that.setData({
            order: order,
            allMoney: order.order.order_price
          })
        }
        order.allMoney = order.order.order_price
        that.setData({
          order: order,
          allMoney: order.order.order_price
        })
      }
    }
    app.requestInfo(obj)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (params) {
  // onLoad () {
    // console.log(e)
    let time = (new Date()).getHours() + ':' + (new Date()).getMinutes()
    this.setData({
      time: time
    })
    // let params = {}
    // params['o_id'] = 28
    // params['s_id'] = 6
    this.getOrderInfo(params)
    // TODO: onLoad
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
