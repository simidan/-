const express = require('express');
const router = express.Router();

const userShow = require('./userShow')
const userUpdate = require('./userUpdate')
const userAdd = require('./userAdd')
const userSearch = require('./userSearch')
const userDelete = require('./userDelete')
const userStatus = require('./userStatus')
const avatar = require('./avater')
const getAvatar = require('./getAvater')

router.use('', userShow)
router.use('', userUpdate)
router.use('', userAdd)
router.use('', userSearch)
router.use('', userDelete)
router.use('', userStatus)
router.use('', avatar)
router.use('', getAvatar)

module.exports = router