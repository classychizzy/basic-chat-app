// models for the user

const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')
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
// exports the new user model for the database
module.exports = userSchema
