// miniprogram/pages/search/search.js
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
  click: function(e){
    var th  = this
    th.setData({
      a: e.detail.value
    })
    console.log(th.data.a)

    wx.cloud.callFunction({
      name: 'bridge',//你的云函数名称
      data: {
        url: th.data.hp+'/search',
        a: th.data.a,
      }
    }).then( (res)=>{
        console.log(res);
        th.setData({
          song: res.result.song
        })
      console.log(th.data.song)   
    })
  },
    toSmor: function(e){
      var name =e.currentTarget.dataset.name
      var singerName =e.currentTarget.dataset.singer
      var th =this
      if(name!=null){
      wx.navigateTo({
        url: '../play/play?name='+name,
      })
    }else{

      wx.cloud.callFunction({
        name: 'bridge',//你的云函数名称
        data: {
          url: th.data.hp+'/singerMore',
          'name': singerName,
        }
      }).then( (res)=>{
          console.log(res);
          th.setData({
            songer: res.result
          })           
          wx.navigateTo({
            url: '../singer/singer?songer='+JSON.stringify(th.data.songer)
          })
        }) 
      }     
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