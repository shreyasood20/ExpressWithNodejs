const userController = require('../Controller/userController')
const express = require('express');
const router = express.Router();

router.route('/').post(userController.signup);
router.route('/login').post(userController.logIn);

module.exports=router