const express = require('express');
const router = express.Router();

const addCart = require('./addCart')
const getCart = require('./getCart')
const manageCart = require('./manageCart')

router.use('', addCart)
router.use('', getCart)
router.use('', manageCart)

module.exports = router