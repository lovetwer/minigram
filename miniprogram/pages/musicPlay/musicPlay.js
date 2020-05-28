// miniprogram/pages/musicPlay/musicPlay.js
wx.cloud.init()
const db = wx.cloud.database()
const moment = require('../../libs/moment')
import {obj as lrcStr} from './content.js'
var result
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lrcStr:lrcStr,
    storyContent:'',
    lrcDir: '[00:00.00]张紫豪 - 可不可以\n[00:02.00]词：刘伟锋\n[00:03.00]曲：刘伟锋\n[00:04.00]编曲：刘伟锋\n[00:05.00]录制混缩：巨人先生\n[00:07.00]出品：西亚斯音频工作室\n[00:16.01]说好带你流浪\n[00:19.59]而我却半路返航\n[00:23.10]坠落自责的海洋',
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
  formatLrcStr(){
    console.log(moment().valueOf())
    let lines = lrcStr
    let arr = lines.map(item=>{
      return {
        time:(moment(`2020-05-27 00:${item.time}`).valueOf() - moment(`2020-05-27 00:00:00`).valueOf())==0?0:(moment(`2020-05-27 00:${item.time}`).valueOf() - moment(`2020-05-27 00:00:00`).valueOf()) / 1000,
        title:item.text
      }
    })
    console.log(arr)
    return arr
  },
  onLoad: function (options) {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.getMusicById(options.id)
    // this.handleLyric()
    // this.formatLrcStr()
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
        time:(moment(`2020-05-27 00:${item.time}`).valueOf() - moment(`2020-05-27 00:00:00`).valueOf())==0?0:(moment(`2020-05-27 00:${item.time}`).valueOf() - moment(`2020-05-27 00:00:00`).valueOf()),
        title:item.text
      }
    })
    for (let i = 0; i < lines.length; i++) {
      if (i < lines.length - 1) {
        let time1 = lines[i].time, time2 = lines[i + 1].time
        if (currentTime > time1 && currentTime < time2) {
          lineNum = i - 1
          break;
        }
      } else {
        lineNum = lines.length - 2
      }
    }
    this.setData({
      currentLineNum: lineNum,
      currentText: lines[lineNum + 1] && lines[lineNum + 1].text
    })

    let toLineNum = lineNum - 3
    if (lineNum > 3 && toLineNum != this.data.toLineNum) {
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

      this.innerAudioContext.seek(value)
      this.innerAudioContext.onSeeked(()=>{
        console.log(this.innerAudioContext.duration)
      })
  },
  //去除空白
  sliceNull: function (lrc) {
    var result = []
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i][1] == "") {
      } else {
        result.push(lrc[i]);
      }
    }
    return result
  },
  playFun:function(){
    this.setData({
       storyContent: this.sliceNull(this.parseLyric(this.data.lrcDir))
     })
     console.log('storyContent',this.data.storyContent)
  },
  parseLyric: function (text) {
    result = [];
    var lines = text.split('\n'), //切割每一行
     pattern = /\[\d{2}:\d{2}.\d{2}\]/g //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };
    //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
      //提取出时间[xx:xx.xx]
      var time = v.match(pattern),
        //提取歌词
        value = v.replace(pattern, '');
      // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
      time.forEach(function (v1, i1, a1) {
        //去掉时间里的中括号得到xx:xx.xx
        var t = v1.slice(1, -1).split(':');
        //将结果压入最终数组
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      });
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
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