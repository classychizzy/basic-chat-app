const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-expressions
require('dotenv').config

/* ---- DATABASE, connection to mongodb atlas ---- */
const userSchema = require('../models/users')
const connection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const User = connection.model('user', userSchema, 'user')

async function createUser (username) {
  return new User({
    username,
    created: Date.now()
  }).save()
}

async function findUser (username) {
  return await User.findOne({ username })
}

;(async () => {
  const connector = mongoose.connect(process.env.MONGO_URI)
  const username = process.argv[2].split('=')[1]

  let user = await connector.then(async () => {
    return findUser(username)
  })

  if (!user) {
    user = await createUser(username)
  }

  console.log(user)
  process.exit(0)
})()

module.exports = connection
