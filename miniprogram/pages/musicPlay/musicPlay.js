// miniprogram/pages/musicPlay/musicPlay.js
wx.cloud.init()
const db = wx.cloud.database()
const innerAudioContext = wx.createInnerAudioContext()
const moment = require('../../libs/moment')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicObj:null,
    playStatus:false,
    duration:0,
    currentTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusicById(options.id)
  },
  async getMusicById(id){
    let res = await db.collection('music').doc(id).get()
    console.log('getMusicById',res)
    this.setData({
      musicObj:res.data
    },()=>{
      console.log('setData')
      innerAudioContext.src = res.data.src
      innerAudioContext.autoplay = true
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
        innerAudioContext.onTimeUpdate(()=>{
          let currentTime = moment(innerAudioContext.currentTime * 1000).format('mm:ss')
          let duration = moment(innerAudioContext.duration * 1000).format('mm:ss')
          console.log('duration',duration)
          this.setData({
            currentTime,
            duration,
          })
        })
        this.setData({
          // currentTime,
          // duration,
          playStatus:true
        })
      })
    })
  },
  createAudio(){

  },
  handlePlay(){
    this.setData({
      playStatus:true
    })
    innerAudioContext.play()
  },
  handlePause(){
    this.setData({
      playStatus:false
    })
    innerAudioContext.pause()
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