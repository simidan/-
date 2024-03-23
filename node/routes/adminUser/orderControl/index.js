const express = require('express');
const router = express.Router();

const orderAdd = require('./orderAdd')
const orderShow = require('./orderShow')
const orderDelete = require('./orderDelete')
const orderSearch = require('./orderSearch')
const orderUpdate = require('./orderUpdate')

router.use('', orderAdd)
router.use('', orderShow)
router.use('', orderDelete)
router.use('', orderSearch)
router.use('', orderUpdate)

module.exports = router