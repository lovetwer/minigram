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
       comm:'',
       song:'',
       songName:"",
       comment:'',
       condition:true,
       shotStatus:false,
       currentIndex:''
      },

      /**
       * 生命周期函数--监听页面加载
       */

      
          playing: function (e) {
            var th= this
            var src = e.currentTarget.dataset.src;
            mic.src = src;
            wx.request({
              url: th.data.hp+'/lrc',
              data: {
                'fileName': th.data.hp+th.data.lrcFile,
              },
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                
                th.setData({
                 lrc: res.data
                 
                })
              }
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
            //mic.autoplay = true    
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
        this.setData({
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
      comm: e.detail.value
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
    wx.request({
      url: th.data.hp+'/comment',
      data: {
        'comm':th.data.comm,
        'sid': header.Cookie,
        'song': th.data.songName
      },
      method: 'post',
      header: header, 
      success: function (res) {
        console.log('res.data------'+res.data)
          th.setData({
            comment:res.data
          })
      }
    })
  }
  },
  more: function() {
    var th = this
    wx.request({
      url: th.data.hp+'/commMore',
      data: {
        'song': th.data.songName
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
          th.setData({
            comment:res.data,
            condition:false
          })
      }
    })

  },
          onLoad: function (options) {
            var name = options.name;
            var singer = options.singer;
            var th = this
            console.log(name + singer )
            wx.request({
              url: th.data.hp+'/songMore',
              data: {
                'name': name,
                'singer': singer,
              },
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                th.setData({
                  song:res.data,
                  songName: res.data.name,
                  lrcFile: res.data.lrc
                })
                console.log("??????????"+th.data.songName) 
              }
            }),
           console.log("??????????"+th.data.songName) 
            wx.request({
              url: th.data.hp+'/commentMore',
              data: {
                'song': name
              },
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                th.setData({
                  comment:res.data,
                })
                console.log('res++++++++++'+res.data.length)
                if(res.data.length<5){
                  th.setData({
                    condition:false,
                  })
                }else{
                  th.setData({
                    condition:true,
                  })
                } 
              }
            })
            console.log("th.data.comment======"+th.data.comment)
          },
   shotYes: function(e){
    var date = e.currentTarget.dataset.date;
    var song = e.currentTarget.dataset.song;
    var index =e.currentTarget.dataset.index
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
      wx.request({
        url: th.data.hp+'/shotYes',
        data: {
          'date': date,
          'song':song
        },
        method: 'post',
        header: header,
        success: function (res) {
          th.setData({
            comment:res.data.comment,
            shotStatus:res.data.shotStatus,
            currentIndex:index,
          })
          console.log(res.data.shotStatus)
          }
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