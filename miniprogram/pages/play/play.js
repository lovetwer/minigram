// miniprogram/pages/paly/play.js
const app = getApp();
const mic = wx.createInnerAudioContext()
const moment = require('../../libs/moment')
Page({

      /**
       * 页面的初始数据
       */
      data: {
        hp:app.globalData.hp,
        currentTime:0,
        duration:0,
        lrcFile: '',
        lrc:[],
        currentLineNum: 0,
        toLineNum: -1,
       showOut:'',
       play:true,
       paused:false,
       playSatus: "",
       info:'',
       song:'',
       songName:"",
       comment:'',
       condition:true,
       shotStatus:false,
       currentIndex:'',
       shotYes:'',
       statusBarHeight: app.globalData.statusBarHeight,
       scrollTop:0,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onPageScroll: function (ev) {
        this.setData({
          scrollTop: ev.scrollTop   
        })
      },
      
          playing: function (e) {
            var th= this
            var src = 'http://112.124.203.93'+th.data.song.url;
            console.log('lianjie---'+src)
            mic.src = src;
            wx.cloud.callFunction({
              name: 'bridge',//你的云函数名称
              data: {
                url: 'http://112.124.203.93/lrc',
                fileName: 'http://112.124.203.93'+th.data.lrcFile,
              } 
                }).then( (res)=>{
        console.log(res);
        console.log(res.result)
        th.setData({
          lrc: res.result
          
         })
              }),
              console.log("对不对————"+th.data.playSatus)
            if(th.data.playSatus){
              mic.pause();
              th.setData({
                playSatus:false
              })
            }else{
              mic.play();
              app.globalData.playStauts=true
            mic.autoplay = true    
            mic.onPlay(() => {
              console.log('开始播放')
              th.setData({
                play : false,
                paused: true,
                playSatus: true
              })
             
              th.onAudioTimeUpdate()
            })
      }},
      onAudioTimeUpdate() {
        mic.onTimeUpdate(()=>{
          var th = this
        let currentT= mic.currentTime
        let duration = mic.duration.toFixed(2)*1000
        let currentTime = currentT.toFixed(2)*1000
        th.setData({
          currentTime,
          duration
        })
        let lineNum = "";
        let lrc = th.data.lrc
        for (let i = 0; i < lrc.length; i++) {
         
          if (i < lrc.length - 1) {
            let time1 = lrc[i].time, time2 = lrc[i + 1].time
            if (currentTime > time1 && currentTime < time2) {
              lineNum = i
              break;
            }
          } else {
            lineNum = lrc.length - 1
          }
        }
        console.log("lrc[lineNum].text---"+lrc[lineNum].text)
        th.setData({
          currentLineNum: lineNum,
          currentText: lrc[lineNum] && lrc[lineNum].text
        })
        let toLineNum = lineNum - 2
        if (lineNum > 2 && toLineNum != th.data.toLineNum) {
          th.setData({
            toLineNum: toLineNum
          })
        }
      })
  },

  comment: function(e){
    var th  = this
    th.setData({
      info: e.detail.value
    })
  },
  
  push: function() {
    var th = this
    var  header = getApp().globalData.header;
    console.log("header---------"+header.Cookie)
    if(header.Cookie.length==0){
    wx.showToast({
      title: '先登录！',
      icon: 'none',
      duration: 1500
    })
    wx.navigateTo({
      url: '../login/login'
    })
    }else{  
      
      wx.cloud.callFunction({
      name: 'bridge',//你的云函数名称
      data: {
        url: 'http://112.124.203.93/comment',
        info:th.data.info,
        sid: header.Cookie,
        sId: th.data.song.sId
      } 
    }).then( (res)=>{
      console.log(res);
      console.log(res.result)
      console.log('res.data------'+res.result)
          th.setData({
            comment:res.result
          })
      })
  }
  },
  more: function() {
    var th = this
    wx.cloud.callFunction({
      name: 'bridge',//你的云函数名称
      data: {
        url: 'http://112.124.203.93/commMore',
        sId: th.data.song.sId
      } 
    }).then( (res)=>{
      console.log(res);
      console.log(res.result)
      th.setData({
        comment:res.result.comment,
        condition:false
      })
    })
  }, 
          onLoad: function (options) {
            var name = options.name;
            var singer = options.singer;
            var sId = options.id;
            var th = this
            console.log('----------------'+name+singer)
            wx.cloud.callFunction({
              name: 'bridge',//你的云函数名称
              data: {
                url: 'http://112.124.203.93/songMore',
                name: name,
                singer: singer,
                sId: sId,
              } 
            }).then( (res)=>{
              console.log(res);
              console.log(res.result)
              th.setData({
                song:res.result.song,
                songName: res.result.song.name,
                lrcFile: res.result.song.lrc,
                shotYes: res.result.shotYes,
                comment:res.result.comment,
              })
              wx.setNavigationBarTitle({
                title: th.data.songName
              })
              if(res.result.comment.length<5){
                th.setData({
                  condition:false,
                })
              }else{
                th.setData({
                  condition:true,
                })
              }
          })
            },
           
   shotYes: function(e){
    var date = e.currentTarget.dataset.date;
    var sId = e.currentTarget.dataset.sid;
    var cId = e.currentTarget.dataset.cid;
    var index =e.currentTarget.dataset.index
    var th = this
    console.log('sId------'+sId+"date-----"+date)
    var  header = getApp().globalData.header;
    console.log("header---------"+header.Cookie)
    if(header.Cookie.length==0){
    wx.showToast({
      title: '先登录！',
      icon: 'none',
      duration: 1500
    })
    wx.navigateTo({
      url: '../login/login'
    })
  }else{
    // let arr = this.data.comment
    // arr[index].shotStatus = !arr[index].shotStatus
    // this.setData({
    //   comment:arr
    // })
    wx.cloud.callFunction({
      name: 'bridge',//你的云函数名称
      data: {
        url: 'http://112.124.203.93/shotYes',
        date: date,
          sId:sId,
          cId:cId
      } 
    }).then( (res)=>{
      console.log(res);
      console.log(res.result)
      th.setData({
        comment:res.result.comment,
        shotYes: res.result.shotYes
      })
      })
    }   
   },
// collect: function(e){
//   var th = this
  
//   var name = e.currentTarget.dataset.name
//   console.log(name)
//   var that = this
//   wx.request({
//     url: 'http://32jv006215.wicp.vip/collect',
//     method : 'post',
//     data: {
//       'name': name
//     },
//     header: {
//       'content-type': 'application/x-www-form-urlencoded'
//     },
//     success: function (res) {
//       console.log(res.data)
//       if(res.data.status==0){
//         th.setData({
//           show:false
//         })
//       }else{
//         th.setData({
//           show:true
//         })
//       }
//     }
//   })
// },
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