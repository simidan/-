const express = require('express');
const router = express.Router();

const users = require('./users/index')
const admin = require('./adminUser/index')
const shopSmall = require('./shopSmall/index')

router.use('/users', users)
router.use('/admin', admin)
router.use('/shopSmall', shopSmall)

module.exports = router