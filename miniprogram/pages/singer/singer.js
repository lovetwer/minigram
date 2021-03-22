// miniprogram/pages/singer/singer.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hp:app.globalData.hp,
    song:[],
    songer:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var th = this
       th.setData({
         songer: JSON.parse(options.songer)
       })
       console.log(th.data.songer.name)

       wx.cloud.callFunction({
        name: 'bridge',//你的云函数名称
        data: {
          url: th.data.hp+'/simpSong',
          name:"",
           singer:th.data.songer.name
        }
      }).then( (res)=>{
          console.log(res);
          
          th.setData({
            song:res.result
          })
        console.log(th.data.song)
       
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