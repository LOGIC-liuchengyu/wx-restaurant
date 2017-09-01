/**
 * API module
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
// const wechat = require('./utils/wechat')
const useUrl = require('./utils/service')
// const Promise = require('./utils/bluebird')

App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  data: {
    name: 'WeApp Boilerplate',
    version: '0.1.0',
    userInfo: null,
    s_id: 6
  },

  // 不是只能定义`data`，别的也可以
  other: 'other variables',

  /**
   * 获取用户信息
   * @return {Promise} 包含获取用户信息的`Promise`
   */
  // getUserInfo () {
  //   return new Promise((resolve, reject) => {
  //     if (this.data.userInfo) return reject(this.data.userInfo)
  //     wechat.login()
  //       .then(() => wechat.getUserInfo())
  //       .then(res => res.userInfo)
  //       .then(info => { this.data.userInfo = info; wx.setStorageSync('userInfo', info) })
  //       .then(info => resolve(info))
  //       .catch(error => console.error('failed to get user info, error: ' + error))
  //   })
  // },
  /**
   *  用户微信授权登陆
   */
  login (obj) {
    let loginSuccess = obj.success || function () { console.log('未传入success回调函数') }
    let loginFail = obj.success || function () { console.log('未传入fail回调函数') }
    wx.login({
      success (res) {
        // console.log(res.code)
        loginSuccess(res)
      },
      fail (res) {
        loginFail(res)
      }
    })
  },
  /**
   * 获取用户微信信息
   * @param obj
   */
  getUserInfo (obj) {
    let getUserSuccess = obj.success || function () { console.log('未传入success回调函数') }
    let getUserFail = obj.fail || function () {
      wx.showModal({
        title: '未提供权限',
        content: '请删除小程序后重新打开并授权',
        showCancel: false
      })
    }
    wx.getUserInfo({
      // 默认获取用户带加密数据的信息
      withCredentials: obj.withCredentials || false,
      success (res) {
        getUserSuccess(res)
      },
      fail (res) {
        getUserFail(res)
      }
    })
  },
  /**
   * 服务器获取用户session_key
   */
  getSessionKey (obj) {
    this.requestInfo(obj)
  },
  /**
   * 向服务器请求信息
   */
  requestInfo (obj) {
    wx.request({
      url: obj.url || useUrl.serviceUrl.login,
      method: obj.method || 'POST',
      data: obj.data || {},
      header: {
        'content-type': obj.header || 'application/x-www-form-urlencoded'
      },
      success: obj.success || function () { console.log('未传入success回调函数') },
      fail: obj.fail || function (err) { console.log('未传入fail回调函数,err:' + err.errMsg) },
      complete: obj.complete || function () {}
    })
  },
  /**
   * 登陆态检查
   */
  sessionCheck () {
    let that = this
    wx.checkSession({
      success () {
        console.log('session有效')
        // that.mainLogin()
      },
      fail () {
        console.log('session失效')
        that.mainLogin()
      }
    })
  },
  /**
   * 主登陆函数
   */
  mainLogin (_this, callback, callback2, callback3, callback4) {
    let that = this
    if (wx.getStorageSync('session_key')) {
      let obj = {
        url: useUrl.serviceUrl.jifen,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        data: {
          session_key: wx.getStorageSync('session_key')
        },
        success (res) {
          if (res.data.code === 200) {
            if (callback) {
              callback()
            }
            if (callback2) {
              callback2()
            }
            if (callback3) {
              callback3()
            }
            if (callback4) {
              callback4()
            }
          } else {
            let loginObj = {
              success: function (params) {
                // 获取用户登陆code
                // console.log(res)
                // 获取用户的session_key
                // console.log('mainLogin' + res.code)
                let obj = {
                  url: useUrl.serviceUrl.login + '?code=' + params.code,
                  method: 'GET',
                  // data: {
                  //   code: res.code
                  // },
                  header: 'application/json',
                  success (res) {
                    // console.log(useUrl.serviceUrl.login + '?code=' + params.code)
                    // console.log(res)
                    // console.log(res.data.data.session_key)
                    // session_key 存储
                    that.data.session_key = res.data.data.session_key
                    wx.setStorageSync('session_key', res.data.data.session_key)
                    if (callback) {
                      callback()
                    }
                    if (callback2) {
                      callback2()
                    }
                    if (callback3) {
                      callback3()
                    }
                    if (callback4) {
                      callback4()
                    }
                  },
                  fail (res) {
                    console.log(res)
                  }
                }
                that.getSessionKey(obj)
                // 获取用户信息
                let obj2 = {
                  success (res) {
                    // console.log(res)
                    that.data.userInfo = res.userInfo
                    wx.setStorageSync('userInfo', res.userInfo)
                    if (_this) {
                      _this.setData({
                        userInfo: res.userInfo
                      })
                    }
                  }
                }
                that.getUserInfo(obj2)
              }
            }
            that.login(loginObj)
          }
        }
      }
      that.requestInfo(obj)
    } else {
      let loginObj = {
        success: function (params) {
          // 获取用户登陆code
          // console.log(res)
          // 获取用户的session_key
          // console.log('mainLogin' + res.code)
          let obj = {
            url: useUrl.serviceUrl.login + '?code=' + params.code,
            method: 'GET',
            // data: {
            //   code: res.code
            // },
            header: 'application/json',
            success (res) {
              // console.log(useUrl.serviceUrl.login + '?code=' + params.code)
              // console.log(res)
              // console.log(res.data.data.session_key)
              // session_key 存储
              that.data.session_key = res.data.data.session_key
              wx.setStorageSync('session_key', res.data.data.session_key)
              if (callback) {
                callback()
              }
              if (callback2) {
                callback2()
              }
              if (callback3) {
                callback3()
              }
              if (callback4) {
                callback4()
              }
            },
            fail (res) {
              console.log(res)
            }
          }
          that.getSessionKey(obj)
          // 获取用户信息
          let obj2 = {
            success (res) {
              // console.log(res)
              that.data.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              if (_this) {
                _this.setData({
                  userInfo: res.userInfo
                })
              }
            }
          }
          that.getUserInfo(obj2)
        }
      }
      that.login(loginObj)
    }
  },
  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch () {
    // let that = this
    // console.log(' ========== Application is launched ========== ')
    // 登陆态检查
    this.mainLogin()
    // 用户登陆
  },
  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow () {
    // console.log(' ========== Application is showed ========== ')
  },
  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide () {
    // console.log(' ========== Application is hid =====/===== ')
  }
})
