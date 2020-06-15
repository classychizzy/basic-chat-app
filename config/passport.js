const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// the model user is brought into the model as we wish to use passport for authentication 

const Users = mongoose.model('users');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
},
    (email, password) => {
        Users.findOne({ email })
            .then((user) => {
                if (!user || !user.validatepassword(password)) {

                    return done(null, false, {
                        errors: { 'email or password': 'is invalid' }
                    });
                }
                return done(null, user);
            }).catch(done);
    }));