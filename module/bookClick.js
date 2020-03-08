const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/book', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let bookClick = new Schema({
  bookName: {
    type: String,
    require: true
  },
  clickNum: {
    type: Number,
    default: 0
  }
})
module.exports = mongoose.model('BookClick', bookClick)
