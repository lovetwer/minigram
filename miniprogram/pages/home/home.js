// miniprogram/pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hp:app.globalData.hp,
    name: 'bingbing',
    body: [
      {head:'big',hand:'small'},
      {head:'small',hand:'short'}
    ]
  },
  click(){
   wx.navigateTo({
     url: '../search/search',
   })
  },
  go: function(){
    wx.navigateTo({
      url: '../putSong/putSong',
    })
  }
})





























