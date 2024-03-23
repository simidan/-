const express = require('express');
const router = express.Router();

const register = require('./register')
const login = require('./login')
const userUpdate = require('./userUpdate')
const userAdress = require('./userAdress')
const userAvater = require('./avater')

router.use('', register)
router.use('', login)
router.use('', userUpdate)
router.use('', userAdress)
router.use('', userAvater)

module.exports = router