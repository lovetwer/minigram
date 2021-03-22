// miniprogram/pages/putSong/putSong.js
// const myaudio = wx.createInnerAudioContext({});
const app = getApp();
const mic = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hp:app.globalData.hp,
    song:[],
  },
    /*

   * 生命周期函数--监听页面加载
   */click(){
   wx.navigateTo({
    url: '../search/search',
  })
 },
  onLoad: function (options) {

    var th = this
    wx.cloud.callFunction({
      name: 'bridge',//你的云函数名称
      data: {
        url: 'http://112.124.203.93/FindMic'
      }
    }).then( (res)=>{
        console.log(res);
        
          th.setData({
            song: res.result
          })
      })
  },
  toPlay: function(e){
    var id =e.currentTarget.dataset.id
    var name =e.currentTarget.dataset.name
    var singer =e.currentTarget.dataset.singer
    console.log(name+singer+id)
    wx.navigateTo({
      url: '../play/play?name='+name+'&singer='+singer+'&id='+id,
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