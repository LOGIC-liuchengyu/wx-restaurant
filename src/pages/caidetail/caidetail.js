// 获取全局应用程序实例对象
const app = getApp()
const useUrl = require('../../utils/service')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'caidetail',
    imgUrls: [],
    name: '',
    current: 2,
    kinds: [
      {
        i: '大份',
        p: '0',
        id: 0
      },
      {
        i: '中份',
        p: '0',
        id: 0
      },
      {
        i: '小份',
        p: '0',
        id: 0
      },
      {
        i: '无',
        p: '0',
        id: 0
      }
    ],
    count: 1,
    introduce: ''
  },
  // 添加到购物车
  addcar () {
    let that = this
    let choosegoods = wx.getStorageSync('chooseGoods')
    let current = that.data.current
    let goodsId = that.data.kinds[current].id
    if (that.data.kinds[current]['p'] === '0') {
      return wx.showToast({
        title: '请选择规格',
        image: '../../images/diancan_hl.png'
      })
    }
    var goods, money, allCount
    if (choosegoods) {
      goods = choosegoods['goods']
      money = choosegoods['money'] * 1
      // console.log(money)
      allCount = choosegoods['allCount'] * 1
      if (goods[goodsId]) {
        goods[goodsId] += that.data.count
      } else {
        goods[goodsId] = that.data.count
      }
      money += (that.data.kinds[current]['p'] * 1) * (that.data.count * 1)
      // console.log('second' + money)
      allCount += (that.data.count * 1)
    } else {
      goods = {}
      goods[goodsId] = that.data.count
      money = (that.data.kinds[current]['p'] * 1) * (that.data.count * 1)
      allCount = (that.data.count * 1)
    }
    choosegoods = {
      goods: goods,
      money: money,
      allCount: allCount,
      s_id: app.data.s_id
    }
    wx.setStorageSync('chooseGoods', choosegoods)
    wx.switchTab({
      url: '../ordering/ordering'
    })
  },
  // 增加数量
  addorder () {
    let count = this.data.count
    ++count
    this.setData({
      count: count
    })
  },
  // 减少数量
  delorder () {
    let count = this.data.count
    if (count <= 1) return
    --count
    this.setData({
      count: count
    })
  },
  // 选择规格
  choosetip (e) {
    let cur = e.currentTarget.dataset.index
    this.setData({
      current: cur
    })
  },
  // 获取菜的信息
  getdishesInfo (e) {
    let that = this
    let obj = {
      url: useUrl.serviceUrl.dishes_info,
      data: {
        session_key: wx.getStorageSync('session_key'),
        p_id: e.id
        // p_id: 7
      },
      success (res) {
        let tj = res.data.data
        let kind = that.data.kinds
        for (let item in tj) {
          if (item !== 'photo') {
            if (tj[item]['type'] === '1') {
              kind[2]['p'] = tj[item]['cai_price']
              kind[2]['id'] = tj[item]['id']
            } else if (tj[item]['type'] === '2') {
              kind[1]['p'] = tj[item]['cai_price']
              kind[1]['id'] = tj[item]['id']
            } else if (tj[item]['type'] === '3') {
              kind[0]['p'] = tj[item]['cai_price']
              kind[0]['id'] = tj[item]['id']
            } else {
              kind[3]['p'] = tj[item]['cai_price']
              kind[3]['id'] = tj[item]['id']
              that.setData({
                current: 3
              })
            }
          }
        }
        that.setData({
          imgUrls: tj.photo,
          name: tj[0].cai_name,
          introduce: tj[0].content,
          kinds: kind
        })
      }
    }
    app.requestInfo(obj)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (e) {
    this.getdishesInfo(e)
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
