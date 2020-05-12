// miniprogram/pages/paly/play.js
const mic = wx.createInnerAudioContext()
Page({

      /**
       * 页面的初始数据
       */
      data: {
       show:'none',
       showOut:''
      },

      /**
       * 生命周期函数--监听页面加载
       */
      /* var myAudio =e.currentTarget.dataset.id
         console.log(myAudio)
         this.audioCtx = wx.createAudioContext(myAudio);
         console.log(this.audioCtx);
         this.audioCtx .play();
       },
       /**
        * 生命周期函数--监听页面加载
        */
      dow: function (e) {
        var fileName = e.currentTarget.dataset.file
        console.log(fileName)
              var _this = this;
              wx.downloadFile({
                url: 'http://192.168.137.1/download?fileName=' + fileName,
                success: function(res) {
                  var tempFilePath = res.tempFilePath
                  //console.log('临时文件地址是：' + tempFilePath)
                  wx.saveFile({
                    tempFilePath: tempFilePath,
                    success: function(res) {
                        var saveFilePath = res.savedFilePath   
                    },//可以将saveFilePath写入到页面数据中
                    fail: function(res) {},
                    complete: function(res) {
                      console.log('complete后的res数据：')
                    },
                  }) //,
                },
                fail: function(res) {
                  wx.showModal({
                    title: '下载失败'
                  })
                },
              })
          
      },
          playing: function (e) {
            var src = e.currentTarget.dataset.src;
            mic.src = src;
            console.log(mic);
            mic.play();
          },
          onLoad: function (options) {
            var id = options.id;
            var name = options.name;
            var singer = options.singer;
            var micPic = options.micPic;
            var th = this
            console.log(id + name + singer + micPic)
            wx.request({
              url: 'http://192.168.137.1/songMore',
              data: {
                'id': id,
                'name': name,
                'singer': singer,
                'micPic': micPic,
              },
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                th.setData({
                  song: res.data,
                })
              }
            }),
            wx.request({
              url: 'http://192.168.137.1/loveSongMore',
              data: {
                'name': name,
              },
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if(res.data.song!=null){
                  th.setData({
                    show:'none',
                    showOut:'true'
                   
                  })
                  console.log('000000000000000000')
                }
                else{
                  th.setData({
                    show:'true',
                    showOut:'none'
                   
                  })
                  console.log('11111111111')
                }
              }
            })
          },
collect: function(e){
  var th = this
  
  var name = e.currentTarget.dataset.name
  console.log(name)
  var that = this
  wx.request({
    url: 'http://192.168.137.1/collect',
    method : 'post',
    data: {
      'name': name
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res.data)
      if(res.data.status==0){
        th.setData({
          show:'none',
          showOut:'true'
        })
      }else{
        th.setData({
          show:'true',
          showOut:'none'
        })
      }
    }
  })
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