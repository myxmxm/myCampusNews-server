'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { httpError } = require("../utils/errors");

const login = (req, res, next) => {
  // TODO: add passport authenticate
  passport.authenticate('local', {session: false}, (err, user, info)=>{
    console.log('local params', err, user, info);
    if(err || !user){
        // next(err);
        next(httpError('username / password incorrect', 400));
        return;
      }
      req.login(user, {session: false}, (err)=>{
        if (err) {
            //   next(err);
            next(httpError('login error', 400));
            return;
          }
      });

      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({user: user, token: token});
  })(req, res, next);
};


module.exports = {
  login,
};