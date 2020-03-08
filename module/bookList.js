//0.引包
const mongoose = require('mongoose')

const Schema = mongoose.Schema

//1.连接数据库
mongoose.connect('mongodb://localhost/book')

//2.设计文档结构
let bookListSchema = new Schema({
  bookName: {
    type: String,
    required: true
  },
  bookHref: {
    type: String,
    required: true
  },
  clickNum: {
    type: Number,
    default: 0
  }
})

//3.将文档发布为模型
module.exports = mongoose.model('BookList', bookListSchema)

// let bookList = mongoose.model('BookList', bookListSchema)

//4.利用模型构造函数对User进行数据操作
// let book = new bookList({
//   name: '诸天剧透群',
//   href: 'http://www.xbiquge.la/36/36033/'
// })
// console.log(book)
// book.save(function(err, ret) {
//   if (err) {
//     console.log('保存失败')
//   } else {
//     console.log('保存成功')
//     console.log(ret)
//   }
// })
