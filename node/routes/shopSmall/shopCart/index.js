const express = require('express');
const router = express.Router();

const updateCart = require('./updateCart')
const getCart = require('./getCart')
const manageCart = require('./manageCart')

router.use('', updateCart)
router.use('', getCart)
router.use('', manageCart)

module.exports = router