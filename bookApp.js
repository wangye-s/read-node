//1.获取全部小说页面所有小说链接
//2.建库存储数据 {bookName: 书名, bookHref: 链接}
//3.搜索时返回对应书名的链接, 并对该链接发起请求,返回对应的书本章节的链接
//4.对书本第一章的链接发起请求,获取章节名称和内容
//5.对获取的内容做格式处理后返回数据u
//可能需要用到的模块   express/mongoose/sync-request/cheerio
const express = require('express')
let bodyParser = require('body-parser')
let path = require('path')
const router = require('./router.js')

const app = express()

//设置跨域
app.all('*', function(req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  //允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type')
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method.toLowerCase() === 'options') res.send(200)
  //让options尝试请求快速结束
  else next()
})

//公开指定路径
// app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use(
  '/node_modules/',
  express.static(path.join(__dirname, './node_modules/'))
)
//设置视图引擎
app.engine('html', require('express-art-template'))
// 配置 body-parser 中间件（插件，专门用来解析表单 POST 请求体）
//要放在挂载路由的前面
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//挂载路由
app.use(router)

//加载处理错误请求的中间件
app.use(function(err, req, res, next) {
  if (err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})

app.listen(5888, function() {
  console.log('server is running')
})
