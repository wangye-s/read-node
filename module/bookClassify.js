// 1. 要保存的数据：bookName: 书名， bookHref: 书籍链接 author：作者
// 2. 分类类别: bookClassify 玄幻(1) 修真(2) 都市(3) 穿越(4) 网游(5) 科幻(6) 其他(7)
const request = require('sync-request') //同步请求
const mongoose = require('mongoose')
const fs = require('fs')
const cheerio = require('cheerio')
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/book', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// { useNewUrlParser: true }

let classifySchema = new Schema({
  bookName: {
    type: String,
    required: true
  },
  bookHref: {
    type: String,
    required: true
  },
  author: {
    type: String
    // required: true
  },
  classifyType: {
    type: Number,
    required: true
  },
  clickNum: {
    type: Number,
    default: 0
  },
  collectNum: {
    type: Number,
    default: 0
  },
  recommendNum: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('bookClassify', classifySchema)

//'../data/classify-xuanhuan.html'
// function saveBook(url, index) {
//   return new Promise(function(resolve, reject) {
//     fs.readFile(url, function(err, data) {
//       if (err) {
//         reject(err)
//       } else {
//         // console.log(data)
//         let $ = cheerio.load(data.toString(), { decodeEntities: false })
//         let bookDetail = []
//         let tet = $('#list li>.s2>a').text()
//         $('#list li>.s2>a').each(function() {
//           bookDetail.push({
//             bookName: $(this).text(),
//             bookHref: $(this).attr('href'),
//             classifyType: index
//           })
//         })
//         $('#list li>.s5').each(function(i) {
//           bookDetail[i].author = $(this).text()
//         })
//         resolve(bookDetail)
//       }
//     })
//   })
// }
// let xuanhuanUrl = '../data/classify-xuanhuan.html' //1
// let xiuzhenUrl = '../data/classify-xiuzhen.html' //2
// let dushiUrl = '../data/classify-dushi.html' //3
// let chuanyueUrl = '../data/classify-chuanyue.html' //4
// let wangyouUrl = '../data/classify-wangluo.html' //5
// let kehuanUrl = '../data/classify-kehuan.html' //6
// let qitaUrl = '../data/classify-qita.html' //7

// saveBook(qitaUrl, 7)
//   .then(function(data) {
//     data.forEach((item, i) => {
//       new bookClas(item).save(function(err) {
//         if (err) {
//           console.log(err)
//         }
//       })
//     })
//   })
//   .catch(function(e) {
//     console.log(e)
//   })
