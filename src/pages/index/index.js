// 获取全局应用程序实例对象
const app = getApp()
const useUrl = require('../../utils/service')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'index',
    userInfo: null,
    userSite: '定位中',
    navList: [
      {
        navTitle: '排队取号',
        navIcon: 'iconfont icon-shalou'
      },
      {
        navTitle: '预约订座',
        navIcon: 'iconfont icon-chuliyuyue'
      },
      {
        navTitle: '扫描单号',
        navIcon: 'iconfont icon-erweima'
      }
    ],
    hotShop: [],
    nearShop: [],
    imgUrls: [],
    hotList: [],
    tuijian: [],
    star: ['zero-star', 'one-star', 'two-star', 'three-star', 'four-star', 'five-star']
  },
  gocaidetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../caidetail/caidetail?id=' + id
    })
  },
  /**
   * 用户选择位置
   * @returns {boolean}
   */
  chooseLocation () {
    // console.log(1)
    let that = this
    wx.chooseLocation({
      success (res) {
        // console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.nearShop(res.longitude, res.latitude)
        if (res.name.length <= 0) {
          return that.setData({
            userSite: res.address
          })
        }
        that.setData({
          userSite: res.name
        })
      }
    })
  },
  /**
   * 用户搜索
   */
  goSearch () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  /**
   * 获取用户地理位置
   */
  getLocation () {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        // console.log(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        wx.setStorageSync('userSite', {longitude: res.longitude, latitude: res.latitude})
        let obj = {
          url: useUrl.serviceUrl.weizhi,
          data: {
            session_key: wx.getStorageSync('session_key'),
            latitude: res.latitude,
            longitude: res.longitude
          },
          success (res) {
            // console.log(res)
            that.setData({
              userSite: res.data.data.address
            })
          }
        }
        app.requestInfo(obj)
        // that.getNearShop(res.longitude, res.latitude)
        // 获取用户当前位置地名
        return
        // todo delete return
        // let obj = {
        //   url: useUrl.serviceUrl.fujin_shop,
        //   data: {
        //     latitud: res.latitude,
        //     longitude: res.longitude,
        //     session_key: wx.getStorageSync('session_key')
        //   },
        //   success (res) {
        //     console.log(res)
        //     that.setData({
        //       userSite: res.data.data
        //     })
        //   }
        // }
        // app.requestInfo(obj)
      }
    })
  },
  /**
   * 获取热门商家
   */
  getHotShop () {
    let that = this
    let obj = {
      url: useUrl.serviceUrl.hot_shop,
      data: {
        session_key: wx.getStorageSync('session_key')
      },
      success (res) {
        // console.log(res)
        that.setData({
          hotShop: res.data.data
        })
      }
    }
    app.requestInfo(obj)
  },
  /**
   * 获取附近商家
   */
  getNearShop (longitude, latitude) {
    let that = this
    let obj = {
      url: useUrl.serviceUrl.fujin_shop,
      data: {
        session_key: wx.getStorageSync('session_key'),
        latitude: latitude,
        longitude: longitude
      },
      success (res) {
        // console.log(res)
        // return
        if (res.data.data.length === 0) return
        that.setData({
          nearShop: res.data.data
        })
      }
    }
    app.requestInfo(obj)
  },
  /**
   * 获取首页轮播图
   */
  getAd () {
    let that = this
    let obj = {
      url: useUrl.serviceUrl.ad,
      data: {
        session_key: wx.getStorageSync('session_key')
      },
      success (res) {
        // console.log(res)
        if (res.data.data.length === 0) return
        let imgUrls = []
        for (var index of res.data.data) {
          // console.log(index)
          imgUrls.push(index.thumb)
        }
        that.setData({
          imgUrls: imgUrls
        })
      }
    }
    app.requestInfo(obj)
  },
  /**
   * 获取热门菜系
   */
  gethotDishes () {
    let that = this
    let obj = {
      url: useUrl.serviceUrl.hot_dishes,
      data: {
        session_key: wx.getStorageSync('session_key')
      },
      success (res) {
        that.setData({
          hotList: res.data.data
        })
      }
    }
    app.requestInfo(obj)
  },
  /**
   * 获取推荐菜系
   */
  gettuijianDishes () {
    let that = this
    let obj = {
      url: useUrl.serviceUrl.tuijian_dishes,
      data: {
        session_key: wx.getStorageSync('session_key')
      },
      success (res) {
        that.setData({
          tuijian: res.data.data
        })
      }
    }
    app.requestInfo(obj)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    let that = this
    var sessionKey = wx.getStorageSync('session_key')
    if (sessionKey) {
      // 有sessionKey
      // 获取用户位置信息
      that.getLocation()
      // 获取热门商家
      // that.getHotShop()
      // 获取热门菜系
      that.gethotDishes()
      // 获取推荐菜系
      that.gettuijianDishes()
      // 获取首页轮播图
      that.getAd()
      // 获取用户信息
      that.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    } else {
      // 没有sessionKey
      app.mainLogin(that, that.getLocation, that.gethotDishes, that.gettuijianDishes, that.getAd)
    }
    // 获取地理位置

    // console.log(' ---------- onLoad ----------')
    // console.dir(app.data)
    // 读取session_key
    // let session_key = wx.getStorageSync('session_key')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    console.log(' ---------- onReady ----------')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // app.getUserInfo()
    //   .then(info => this.setData({ userInfo: info }))
    //   .catch(console.info)
    console.log(' ---------- onShow ----------')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    console.log(' ---------- onHide ----------')
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    console.log(' ---------- onUnload ----------')
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    console.log(' ---------- onPullDownRefresh ----------')
  }
})
