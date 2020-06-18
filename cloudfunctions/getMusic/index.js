// 云函数入口文件
const cloud = require('wx-server-sdk')


// 初始化 cloud
cloud.init({
  env:'dev-5pdi2'
})
const db = cloud.database()
const musics = db.collection('music')


// 云函数入口函数
exports.main = async (event, context) => {
    let result = await musics.get()
      return result
}