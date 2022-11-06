'use strict';
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { getAllUsers, insertUser } = require('../models/userModel');
const { httpError } = require('../utils/errors');

const login = (req, res, next) => {
  // TODO: add passport authenticate
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log('local params', err, user, info);
    if (err || !user) {
      // next(err);
      next(httpError('email / password incorrect', 400));
      return;
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        //   next(err);
        next(httpError('login error', 400));
        return;
      }
    });

    // generate a signed son web token with the contents of user object and return it in the response
    const token = jwt.sign(user, process.env.JWT_SECRET);
    return res.json({ user: user, token: token });
  })(req, res, next);
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('user_post validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }
  const allUsers = await getAllUsers();
  let emailExists = false;
  allUsers.map((user) => {
    if (user.email == req.body.email) {
      emailExists = true;
    }
  });

  if (emailExists) {
    res.json({ message: 'This user email already exist', status: 409 });
    return;
  }
  const uid = await insertUser(req.body);
  res.json({ message: `user added with id: ${uid}`, status: 200 });
};

module.exports = {
  login,
  signUp,
};
