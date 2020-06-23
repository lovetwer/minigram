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
    mic.src = 'https://sharefs.yun.kugou.com/202005211331/83a29ef051d952f948192452087d82ea/G067/M02/05/17/44YBAFfkCeaAbAWgADBiNiQR_b0385.1mp3';
    console.log(mic);
    mic.play();
    var th = this
    wx.request({
      url: th.data.hp+'/FindMic',
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
    var name =e.currentTarget.dataset.name
    var singer =e.currentTarget.dataset.singer
    console.log(name+singer)
    wx.navigateTo({
      url: '../play/play?name='+name+'&singer='+singer,
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