// models for the user

const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// set up for the user schema

const userSchema = new mongoose.Schema({
  name: String,
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: String
}, { timestamps: true })

// authentication of password using presave hooks
userSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) { return next() };
  bcrypt.hash(user.password, 10)
  .then((hashedPassword) => {
    user.password = hashedPassword
    next()
  }),
 // error handling


userSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return next(err)
    next(null, isMatch)
  })
}

// exports the new user model
module.exports = mongoose.model('users')