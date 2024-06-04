const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');

router.post('/updateCart', verToken, async(req, res) => {
    try {
        const { productId, quantity, userId } = req.body;

        // 检查必要参数是否存在
        if (!productId || quantity === undefined || !userId) {
            return res.json({
                status: "error",
                statusCode: 400,
                message: "产品ID、用户ID和数量为必填项"
            });
        }

        // 确保提供的数量至少为1
        const finalQuantity = Math.max(quantity, 1);

        // 检查商品是否存在
        const productSql = 'SELECT * FROM products WHERE product_id = ?';
        const product = await sqlConn(productSql, [productId]);
        if (!product || product.length === 0) {
            return res.json({
                status: "error",
                statusCode: 404,
                message: "未找到对应的商品"
            });
        }

        // 检查购物车中是否已经存在相同商品
        const cartSql = 'SELECT * FROM shopping_cart WHERE user_id = ? AND product_id = ?';
        const cartProduct = await sqlConn(cartSql, [userId, productId]);

        if (cartProduct.length > 0) {
            // 更新已存在商品的数量
            const updateSql = 'UPDATE shopping_cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
            await sqlConn(updateSql, [finalQuantity, userId, productId]);
            res.json({
                status: "success",
                statusCode: 200,
                message: "购物车中商品数量更新成功"
            });
        } else {
            // 将新商品添加到购物车，数量至少为1
            const insertSql = 'INSERT INTO shopping_cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
            await sqlConn(insertSql, [userId, productId, finalQuantity]);
            res.json({
                status: "success",
                statusCode: 200,
                message: "商品成功添加到购物车"
            });
        }
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: "更新购物车失败：" + error.message
        });
    }
});


module.exports = router;