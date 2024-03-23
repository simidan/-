const express = require('express');
const router = express.Router();

const businessAdd = require('./businessAdd')
const businessShow = require('./businessShow')
const businessSearch = require('./businessSearch')
const businessDelete = require('./businessDelete')
const businessUpdate = require('./businessUpdate')
const businessAudit = require('./businessAudit')
const businessExamine = require('./businessExamine')
const businessImage = require('./businessImage')

router.use('', businessAdd)
router.use('', businessShow)
router.use('', businessSearch)
router.use('', businessDelete)
router.use('', businessUpdate)
router.use('', businessAudit)
router.use('', businessExamine)
router.use('', businessImage)

module.exports = router