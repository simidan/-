const express = require('express');
const router = express.Router();

const productBrowse = require('./productBrowse')
const productSearch = require('./productSearch')
const productShow = require('./productShow')
const productSeason = require('./productSeason')

router.use('', productBrowse)
router.use('', productSearch)
router.use('', productShow)
router.use('', productSeason)

module.exports = router