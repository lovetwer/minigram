// miniprogram/pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hp:app.globalData.hp,
    id:'',
    passWord:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  getUserName: function(e){
    var th  = this
    th.setData({
      uId: e.detail.value
    })
  },
  getPassWord: function(e){
    var th  = this
    th.setData({
      passWord: e.detail.value
    })
  },
  regis: function(){
    wx.navigateTo({
    url: '../regis/regis'
    })
  },
  login: function(){
    var th  = this
    wx.cloud.callFunction({
      name: 'bridge',//你的云函数名称
      data: {   
        url: 'http://112.124.203.93/login',
        uId: th.data.uId,
        passWord: th.data.passWord,
      } 
    }).then( (res)=>{
        console.log(res.result)
        getApp().globalData.header.Cookie = 'JSESSIONID=' + res.result;
        if(res.result !== "err"){
          if(app.globalData.playStauts=true){
            wx.navigateTo({
              url: '../putSong/putSong'
            })
          }else{
            wx.navigateTo({
              url: '../putSong/putSong'
            })
          }
        }else{
          wx.showToast({
            title: '账号密码错误！',
            icon: 'none',
            duration: 1500
        })
        }
      })},
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})