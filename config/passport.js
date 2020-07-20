
const passport = require('passport')
const LocalStrategy = require('passport-local')
const connection = require('./database')

const validPassword = require('./lib/passportUtils').validPassword

// the model user is brought into the model as we wish to use passport for authentication
const User = connection.models.User

// custom fields are created so passport can recognise the input from the request body
const customFields = {
  usernameField: 'users[email]',
  passwordField: 'users[password]'
}

const verifyCallback = (username, password, done) => {
//  personal created form of verification
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return (done, null)
      };
      // function is validPassword is defined in the passport utils file
      const isValid = validPassword(password, user.hash, user.salt)
      if (isValid) {
        return done(null, user)
      } else {
        return done(null, false)
      };
    })
    .catch((err) => {
      done(err)
    })

  const strategy = new LocalStrategy(customFields, verifyCallback)
  passport.use(strategy)

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((userId, done) => {
    User.findById(userId)
      .then((user) => {
        done(null, user)
      })
      .catch(err => done(err))
  })
}
