/* -- creates routes to handle user login and registration
-- */
const router = require('express').Router()
const passport = require('passport')
const genPassword = require('../config/lib/passportUtils').genPassword
const connection = require('../config/database')
const { Router } = require('express')
const User = connection.model.User

/* -- Post routes ---   */
router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }), (req, res, next) => { })
router.post('/register', (req, res, next) => {
  // lets grab the password and username values
  const saltHash = genPassword(req.body.pw)
  const salt = saltHash.salt
  const hash = saltHash.hash

  // we are now adding new user details from the database
  const newUser = new User({
    username: req.body.uname,
    hash: hash,
    salt: salt
  }
  )
  newUser.save()
    .then((user) => {
      console.log(user)
    })
  res.redirect('/login')
})

module.exports = Router
