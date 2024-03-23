const express = require('express');
const router = express.Router();

const register = require('./register')
const login = require('./login')
const checkToken = require('./checkToken')
const userControl = require('./userControl/index')
const businessControl = require('./businessControl/index')
const orderControl = require('./orderControl/index')
const productControl = require('./productControl/index')
const adminControl = require('./adminControl/index')

router.use('', register)
router.use('', login)
router.use('', checkToken)
router.use('/userControl', userControl)
router.use('/businessControl', businessControl)
router.use('/orderControl', orderControl)
router.use('/productControl', productControl)
router.use('/adminControl', adminControl)

module.exports = router