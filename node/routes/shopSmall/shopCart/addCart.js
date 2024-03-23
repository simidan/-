const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')

router.post('/addCart', verToken, async(req, res) => {
    try {
        const { productId, quantity, userId } = req.body;

        // 检查必要参数是否存在
        if (!productId || !quantity) {
            return res.json({
                status: "error",
                statusCode: 400,
                message: "产品ID和数量为必填项"
            });
        }

        const sql = 'SELECT * FROM products WHERE product_id = ?'
        const product = await sqlConn(sql, [productId])

        if (!product || product === 0) {
            return re.json({
                status: "error",
                statusCode: 404,
                message: "未找到对应的商品"
            });
        }

        if (!req.session[userId]) {
            req.session[userId] = [];
        }

        // 检查购物车中是否已经存在相同商品
        const existingProductIndex = req.session[userId].findIndex(item => item.productId === productId);

        const price = product[0].price;
        const totalPrice = price * quantity;
        const formattedTotalPrice = parseFloat(totalPrice.toFixed(2));

        if (existingProductIndex !== -1) {
            req.session[userId][existingProductIndex].total = parseFloat((req.session[userId][existingProductIndex].total + formattedTotalPrice).toFixed(2));
            req.session[userId][existingProductIndex].quantity += quantity;
        } else {
            req.session[userId].push({ productId, quantity, total: formattedTotalPrice, image: product[0].image, unit: product[0].unit });
        }

        res.json({
            status: "success",
            statusCode: 200,
            message: "商品成功添加到购物车",
            data: req.session[userId]
        });
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: "添加商品到购物车失败：" + error.message
        });
    }
});

module.exports = router;