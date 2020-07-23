// this contains schemas to handle the project
const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 4,
    maxlength: 5000
  },
  name: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Message', messageSchema)
