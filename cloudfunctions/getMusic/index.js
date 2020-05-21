// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()
const musics = db.collection('music')
cloud.init({
  env:'dev-5pdi2'
})

// 云函数入口函数
exports.main = async (event, context) => {
  let list = musics.get()
  console.log('list',list)

  return {
    musicList:list
  }
}