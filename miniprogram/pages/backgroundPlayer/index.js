// miniprogram/pages/backgroundPlayer/index.js
wx.cloud.init()
import {obj as lrcStr} from './content.js'
const db = wx.cloud.database()
const moment = require('../../libs/moment')
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData:{},
    animationData2:{},
    isShowHead:true,
    lrcStr:lrcStr,
    musicObj:null,
    playStatus:false,
    duration:'00:00',
    currentTime:'00:00',
    currentTimeSec:0,
    durationSec:0,
    currentLineNum: 0,
    toLineNum: -1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  handleToggleHead(){
    let isShowHead = !this.data.isShowHead
    if(isShowHead) {
      this.show()
      this.lrcHide()
    }else{
      this.hide()
      this.lrcShow()
    }
    this.setData({
      isShowHead
    })
  },
  formatLrcStr(){
    console.log(moment().valueOf())
    let lines = lrcStr
    let arr = lines.map(item=>{
      return {
        time:moment(`2020-05-27 00:${item.time}`).valueOf() - moment(`2020-05-27 00:00:00`).valueOf(),
        text:item.text
      }
    })
    console.log(arr)
    return arr
  },
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
      backgroundAudioManager.title = res.data.title
      backgroundAudioManager.epname = res.data.title
      backgroundAudioManager.singer = res.data.singer
      backgroundAudioManager.coverImgUrl = res.data.coverImg
      backgroundAudioManager.src = res.data.src
      backgroundAudioManager.onPlay(() => {
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
    backgroundAudioManager.onEnded(()=>{
      console.log('onEnded')
      this.setData({
        playStatus:false,
        currentTime:"00:00",
        currentTimeSec:0,
        currentLineNum: 0,
        toLineNum: -1,
      })
    })
  },
  onAudioTimeUpdate(){
    console.log('onAudioTimeUpdate')
    backgroundAudioManager.onTimeUpdate(()=>{
      let currentTimeSec = backgroundAudioManager.currentTime
      let durationSec = backgroundAudioManager.duration
      let currentTime = moment(currentTimeSec * 1000).format('mm:ss')
      let duration = moment(durationSec * 1000).format('mm:ss')
      this.handleLyric(currentTimeSec * 1000)
      this.setData({
        currentTime,
        duration,
        currentTimeSec,
        durationSec
      })
    })
  },
  handleLyric: function (currentTime) {
    let arr = this.data.lrcStr, lineNum
    let lines = arr.map(item=>{
      return {
        time:moment(`2020-05-27 00:${item.time}`).valueOf() - moment(`2020-05-27 00:00:00`).valueOf(),
        text:item.text
      }
    })
    for (let i = 0; i < lines.length; i++) {
      if (i < lines.length - 1) {
        let time1 = lines[i].time, time2 = lines[i + 1].time
        console.log("time1+++++"+time1)
        if (currentTime > time1 && currentTime < time2) {
          lineNum = i
          break;
        }
      } else {
        lineNum = lines.length - 1
      }
    }
    this.setData({
      currentLineNum: lineNum,
      currentText: lines[lineNum] && lines[lineNum].text
    })

    let toLineNum = lineNum - 5
    if (lineNum > 5 && toLineNum != this.data.toLineNum) {
      this.setData({
        toLineNum: toLineNum
      })
    }
  },
  handleChangeSlider({
    detail:{
      value
    }
  }){
    console.log(value)
    if(!this.data.playStatus){
      this.setData({
        currentTime:moment(value * 1000).format('mm:ss')
      })
      // this.handleLyric(value * 1000)
    }
    backgroundAudioManager.seek(value)
    backgroundAudioManager.onSeeked(()=>{
      console.log(backgroundAudioManager.duration)
    })
  },

  createAudio(){

  },
  handlePlay(){
    this.setData({
      playStatus:true
    })
    backgroundAudioManager.play()
  },
  handlePause(){
    this.setData({
      playStatus:false
    })
    backgroundAudioManager.pause()
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
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
  },
  lrcShow(){{
    this.animation.opacity(1).step()
    this.setData({
      animationData2:this.animation.export()
    })
  }},
  lrcHide(){
    this.animation.opacity(0).step()
    this.setData({
      animationData2:this.animation.export()
    })
  },
  show(){
    this.animation.opacity(1).step()
    this.setData({
      animationData:this.animation.export()
    })
  },
  hide(){
    this.animation.opacity(0).step()
    this.setData({
      animationData:this.animation.export()
    })
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