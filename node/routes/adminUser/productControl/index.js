const express = require('express');
const router = express.Router();

const productAdd = require('./productAdd')
const productShow = require('./productShow')
const productDelete = require('./productDelete')
const productSearch = require('./productSearch')
const productUpdate = require('./productUpdate')
const productAudit = require('./productAudit')
const productExamine = require('./productExamine')
const productImage = require('./productImage')

router.use('', productAdd)
router.use('', productShow)
router.use('', productDelete)
router.use('', productSearch)
router.use('', productUpdate)
router.use('', productAudit)
router.use('', productExamine)
router.use('', productImage)

module.exports = router