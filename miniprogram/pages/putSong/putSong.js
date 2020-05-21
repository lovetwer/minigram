// miniprogram/pages/putSong/putSong.js
// const myaudio = wx.createInnerAudioContext({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    song:[],
  },
    /*

   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var th = this
    wx.request({
      url: 'http://www.yunmic.club/FindMic',
      data: { 'song':''
      },
      method:'get',
      header:{
        'content-type':'application/json'
      },
      success: function(res){
        console.log(res)
        th.setData({
          song:res.data, 
        })
      }
    })
  },
  toPlay: function(e){
    var id =e.currentTarget.dataset.id
    var name =e.currentTarget.dataset.name
    var singer =e.currentTarget.dataset.singer
    var micPic =e.currentTarget.dataset.pic
    console.log(id+name+singer+micPic)
    wx.navigateTo({
      url: '../play/play?id='+id+'&name='+name+'&singer='+singer+'&micPic='+micPic,
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