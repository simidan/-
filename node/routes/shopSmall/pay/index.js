const express = require('express');
const router = express.Router();

const payUser = require('./payUser')
const refund = require('./refund')
const paySuccess = require('./paySuccess')

router.use('', payUser)
router.use('', refund)
router.use('', paySuccess)

module.exports = router