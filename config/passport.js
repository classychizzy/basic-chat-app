const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// the model user is brought into the model as we wish to use passport for authentication 

const Users = mongoose.model('users');

// custom fields are created so passport can recognise the input
const customFields = {
    usernameField: 'users[email]',
    passwordField: 'users[password]'
};

const verifyCallback = (username, password, done) =>{
//  personal created form of verification
user.findOne({username: username})
.then((user) =>{
    if (! user){
        return (done,null)
    };
    const isValid = validPassword(password, user.hash, user.salt);
    if(isValid){
        return done(null,user);
    }
    else{
        return done(null,false)
    };

  

})
.catch((err)=>
{
    done(err);
});
  
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});

}


  
 