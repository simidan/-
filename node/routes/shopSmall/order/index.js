const express = require('express');
const router = express.Router();

const orderCreate = require('./orderCreate')
const orderUpdate = require('./orderUpdate')
const orderGet = require('./orderGet')
const orderDetail = require('./orderDetail')
const orderCreatePhone = require('./orderCreatePhone')

router.use('', orderCreate)
router.use('', orderUpdate)
router.use('', orderGet)
router.use('', orderDetail)
router.use('', orderCreatePhone)

module.exports = router