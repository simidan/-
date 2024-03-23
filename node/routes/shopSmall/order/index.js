const express = require('express');
const router = express.Router();

const orderCreate = require('./orderCreate')
const orderUpdate = require('./orderUpdate')
const orderGet = require('./orderGet')

router.use('', orderCreate)
router.use('', orderUpdate)
router.use('', orderGet)

module.exports = router