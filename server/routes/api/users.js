/* this is the users.js required in the auth.js file. it handles the 
schema for new users , routes and authentication it is an optional file*/

const mongoose =  require('mongoose');
const passport= require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('users');
// an optional route is created to handle new model creation(register new users)
router.post('/', auth.optional, (req, res, next)=> {
    const { body: { user } } = req;
  
    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    const finalUser = new Users(user);
  
    finalUser.setPassword(user.password);
  
    return finalUser.save()
      .then(() => res.json({ user: finalUser.toAuthJSON() }));
  });;

//an optional route(/login) to activate passport configuration and validate password with email
router.post('/login', auth.optional, (req, res, next)=> {
    const { body: { user } } = req;
  
    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }
  
      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
  
        return res.json({ user: user.toAuthJSON() });
      }
  
      return status(400).info;
    })(req, res, next);
  });

// a required route that would be used to return the logged in user i.e users that have a succesful token
router.get('/current', auth.required, (req,res, next)=> {
    const { payload: { id } } = req;
  
    return Users.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }
  
        return res.json({ user: user.toAuthJSON() });
      });
  });
   
  module.exports= router;