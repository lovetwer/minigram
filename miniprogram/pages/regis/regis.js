// miniprogram/pages/regis/regis.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hp:app.globalData.hp,
    id:'',
    userName:'',
    passWord:'',
    type:'',
    picSrc:''
  },
  user: function(e){
    var th  = this
    th.setData({
      id: e.detail.value
    })
  },
  userName: function(e){
    var th  = this
    th.setData({
      userName: e.detail.value
    })
  },
  passWord: function(e){
    var th  = this
    th.setData({
      passWord: e.detail.value
    })
  },
  type: function(e){
    var th  = this
    th.setData({
      type: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  headPic: function (options) {
    var th = this　　
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: th.data.hp+'/upload', 
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            console.log('res-------------'+res.data)
            let scr = th.data.hp+'/img/'+res.data
            if (res.statusCode === 200) {
                th.setData({
                  picSrc:JSON.parse(scr)
                })
                console.log(th.data.picSrc)
            }
            
          }
        })
      }
    })
  },
  regis: function(){
    wx.request({
      url: th.data.hp+'/regis',
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'id': th.data.id,
        'userName':th.data.userName,
        'passWord': th.data.passWord,
        'type':th.data.type
      },
      success: function(res){
      }
    })
  },
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