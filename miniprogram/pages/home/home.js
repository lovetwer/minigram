// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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





























