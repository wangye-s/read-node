const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/book', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let bookDetail = new Schema({
  bookName: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  info: {
    type: String
  },
  lastTime: {
    type: String,
    required: true
  },
  newChapter: {
    type: String,
    required: true
  },
  newChapterHref: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  newList: {
    type: Array,
    required: true
  },
  firstHref: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('BookDetail', bookDetail)
