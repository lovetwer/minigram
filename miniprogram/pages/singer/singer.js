// miniprogram/pages/singer/singer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    song:[],
    songer:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var th = this
       console.log(options.songer)
       th.setData({
         songer: JSON.parse(options.songer)
       })
       console.log(th.data.songer.name)
       wx.request({
         url: 'http://192.168.6.104/simpSong',
         data: { 
           'name':"",
           'singer':th.data.songer.name
         },
         method: 'post',
         header: {
          'content-type': 'application/x-www-form-urlencoded'
         },
         success: function(res){
           console.log(res) 
           th.setData({
             song:res.data
           })
         console.log(th.data.song)
        }
       })
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