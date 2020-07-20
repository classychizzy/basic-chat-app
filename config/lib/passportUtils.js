const crypto = require('crypto')

function genPassword (password) {
  // password argument comes from the user input in the register form
  const salt = crypto.randomBytes(32).toString('hex') // generates a pseudo random value
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return {
    salt: salt,
    hash: genHash
  }
};

function validPassword (password, hash, salt) {
  /* this comes from the user database is basically the same as genHash
and is compared with genHash as a  validation process */
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === hashVerify
};

module.exports.validPassword = validPassword
module.exports.genPassword = genPassword
