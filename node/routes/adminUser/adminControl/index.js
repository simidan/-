const express = require('express');
const router = express.Router();

const adminShow = require('./adminShow')
const adminSearch = require('./adminSearch')
const adminAudit = require('./adminAudit')
const adminExamine = require('./adminExamine')
const adminAdd = require('./adminAdd')
const adminDelete = require('./adminDelete')
const adminUpdate = require('./adminUpdate')

router.use('', adminShow)
router.use('', adminSearch)
router.use('', adminAudit)
router.use('', adminExamine)
router.use('', adminAdd)
router.use('', adminDelete)
router.use('', adminUpdate)

module.exports = router