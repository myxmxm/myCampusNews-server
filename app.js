'use strict';
require('dotenv').config();
const express = require('express')
const cors = require('cors');
const newsRoute = require('./routes/newsRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const { httpError } = require('./utils/errors');
const passport = require('./utils/pass');
const app = express()
const port = 3000

app.use(cors());
app.use(passport.initialize());
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(express.static('uploads')); 
app.use('/avatar',express.static('avatar'));


app.use('/auth', authRoute);
app.use('/news', passport.authenticate('jwt', {session: false}), newsRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);

app.use((req, res, next)=>{
  const err = httpError('Not found', 404);
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({message: err.message || "internal error"});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})