// miniprogram/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      song:[]
  },
  click: function(e){
    var th  = this
    th.setData({
      a: e.detail.value
    })
    console.log(th.data.a)
    wx.request({
      url: 'http://www.yunmic.club/search',
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'a': th.data.a,
      },
      success: function(res){
        console.log(res.data)
        th.setData({
          song: res.data.song
        })
        console.log(th.data.song)
      }
    })
  },

    toSmor: function(e){
      var name =e.currentTarget.dataset.name
      var singer =e.currentTarget.dataset.singer
      wx.navigateTo({
        url: '../play/play?name='+name+'&singer='+singer,
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
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