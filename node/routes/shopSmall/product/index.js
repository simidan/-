const express = require('express');
const router = express.Router();

const productBrowse = require('./productBrowse')
const productSearch = require('./productSearch')
const productSearchOther = require('./productSearchOther')
const productShow = require('./productShow')
const productSeason = require('./productSeason')
const productDetail = require('./productDetail')

router.use('', productBrowse)
router.use('', productSearch)
router.use('', productSearchOther)
router.use('', productShow)
router.use('', productSeason)
router.use('', productDetail)

module.exports = router