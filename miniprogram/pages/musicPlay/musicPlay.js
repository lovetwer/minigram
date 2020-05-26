// miniprogram/pages/musicPlay/musicPlay.js
wx.cloud.init()
const db = wx.cloud.database()
const moment = require('../../libs/moment')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lrcDir: '[ti:成都][ar:赵雷][al:无法长大][by:0][offset:0][00:01]成都[00:02][00:03]作词：赵雷[00:03]作曲：赵雷[00:05]编曲：赵雷,喜子[00:09]演唱：赵雷[00:12][00:17]让我掉下眼泪的[00:21]不止昨夜的酒[00:25]让我依依不舍的[00:29]不止你的温柔[00:33]余路还要走多久[00:37]你攥着我的手[00:41]让我感到为难的[00:45]是挣扎的自由[00:49][00:51]分别总是在九月[00:55]回忆是思念的愁[00:59]深秋嫩绿的垂柳 [01:03]亲吻着我额头[01:07]在那座阴雨的小城里[01:11]我从未忘记你[01:15]成都 带不走的 只有你[01:21][01:22]和我在成都的街头走一走[01:31]直到所有的灯都熄灭了也不停留[01:38]你会挽着我的衣袖[01:42]我会把手揣进裤兜[01:46]走到玉林路的尽头[01:50]坐在小酒馆的门口[01:55][02:30]分别总是在九月[02:34]回忆是思念的愁[02:38]深秋嫩绿的垂柳[02:42]亲吻着我额头[02:46]在那座阴雨的小城里[02:50]我从未忘记你[02:53]成都 带不走的 只有你[03:00][03:02]和我在成都的街头走一走[03:10]直到所有的灯都熄灭了也不停留[03:18]你会挽着我的衣袖[03:21]我会把手揣进裤兜[03:25]走到玉林路的尽头[03:29]坐在小酒馆的门口[03:36][03:38]和我在成都的街头走一走[03:46]直到所有的灯都熄灭了也不停留[03:54]和我在成都的街头走一走[04:02]直到所有的灯都熄灭了也不停留[04:10]你会挽着我的衣袖[04:13]我会把手揣进裤兜[04:17]走到玉林路的尽头[04:21]坐在(走过)小酒馆的门口[04:27][04:36]和我在成都的街头走一走[04:44]直到所有的灯都熄灭了也不停留[04:51]',
    musicObj:null,
    playStatus:false,
    duration:'00:00',
    currentTime:'00:00',
    currentTimeSec:0,
    durationSec:0
  },
  innerAudioContext:null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.getMusicById(options.id)
  },
  async getMusicById(id){
    let res = await db.collection('music').doc(id).get()
    console.log('getMusicById',res)
    this.setData({
      musicObj:res.data
    },()=>{
      console.log('setData')
      this.innerAudioContext.src = res.data.src
      this.innerAudioContext.autoplay = true
      this.innerAudioContext.onPlay(() => {
        console.log('开始播放')
        this.setData({
          playStatus:true
        })
        this.onAudioTimeUpdate()
        this.onAudioPalyEnded()
      })
    })
  },
  onAudioPalyEnded(){
    this.innerAudioContext.onEnded(()=>{
      console.log('onEnded')
      this.setData({
        playStatus:false,
        currentTime:"00:00",
        currentTimeSec:0,
      })
    })
  },
  onAudioTimeUpdate(){
    console.log('onAudioTimeUpdate')
    this.innerAudioContext.onTimeUpdate(()=>{
      let currentTimeSec = this.innerAudioContext.currentTime
      let durationSec = this.innerAudioContext.duration
      let currentTime = moment(currentTimeSec * 1000).format('mm:ss')
      let duration = moment(durationSec * 1000).format('mm:ss')
      console.log('duration',duration)
      this.setData({
        currentTime,
        duration,
        currentTimeSec,
        durationSec
      })
    })
  },
  handleChangeSlider({
    detail:{
      value
    }
  }){
    console.log(value)

      this.innerAudioContext.seek(value)
      this.innerAudioContext.onSeeked(()=>{
        console.log(this.innerAudioContext.duration)
      })
    
    // this.innerAudioContext.onSeeked(()=>{
    //   // console.log(this.innerAudioContext.currentTime)
    //   this.innerAudioContext.offSeeked()
    // })
  },
  createAudio(){

  },
  handlePlay(){
    this.setData({
      playStatus:true
    })
    this.innerAudioContext.play()
  },
  handlePause(){
    this.setData({
      playStatus:false
    })
    this.innerAudioContext.pause()
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
    this.handlePause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {this
    this.innerAudioContext.destroy()
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