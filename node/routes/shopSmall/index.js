const express = require('express');
const router = express.Router();

const product = require('./product/index')
const shopCart = require('./shopCart/index')
const order = require('./order/index')
const pay = require('./pay/index')

router.use('/product', product)
router.use('/shopCart', shopCart)
router.use('/order', order)
router.use('/pay', pay)

module.exports = router