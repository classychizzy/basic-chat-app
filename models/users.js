// models for the user

const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');
//set up for the user schema

const UsersSchema = new mongoose.Schema({
    email: String,
    hash: String,
    salt: String
})
 module.exports= mongoose.model('users', UsersSchema);

// model definition and validation
UsersSchema.method.setPassword = (password) => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString("hex")
};

UsersSchema.method.validatePassword = (password) => {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex')
    return this.hash === hash
};

UsersSchema.method.generateJWT = () => {
    const today = newDate();
    const expirationDate = newDate(today);
    expirationDate.setDate(today.getDate() + 60);

    return JWT.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

UsersSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

