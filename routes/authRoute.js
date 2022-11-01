'use strict';
const express = require('express');
const router = express.Router();
const {login} = require('../controllers/authController');
const { user_post } = require('../controllers/userController');
const {body} = require('express-validator');

router.post('/login', login);

router.post('/register', 
        body("fullName").isLength({ min: 3 }),
        body('email').isEmail(),
        body('password').matches('(?=.*[A-Z]).{8,}'),
        user_post);

module.exports = router;