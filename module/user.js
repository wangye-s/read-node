const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/book', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let UserSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('UserSchema', UserSchema)
