const express = require('express');
const router = express.Router();
const { sqlConn } = require('../../../database/index');
const verToken = require('../../../utils/verifyToken');
const limiter = require('../../../utils/limiter');

router.post('/orderCreatePhone', verToken, limiter(60, 5), async(req, res) => {
    const { userId, payment_method, shippingAddress, items } = req.body;

    try {
        // 获取用户的收货信息
        const userQuery = 'SELECT username, phone FROM users WHERE user_id = ?';
        const userResults = await sqlConn(userQuery, [userId]);
        if (userResults.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "用户未找到"
            });
        }
        const shipping_name = userResults[0].username;
        const shipping_phone = userResults[0].phone;

        for (const { productId, quantity }
            of items) {
            // 验证产品是否存在并获取产品信息
            const productQuery = 'SELECT product_id, business_id, price, stock_quantity FROM products WHERE product_id = ?';
            const productResults = await sqlConn(productQuery, [productId]);
            if (productResults.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "商品未找到"
                });
            }

            const { business_id, price, stock_quantity } = productResults[0];

            // 检查库存是否足够
            if (quantity > stock_quantity) {
                return res.status(400).json({
                    status: "error",
                    message: "库存不足"
                });
            }

            // 创建订单
            const total_amount = price * quantity;
            const orderQuery = 'INSERT INTO orders (user_id, business_id, product_id, quantity, total_amount, status, payment_method, payment_status, shipping_name, shipping_phone, shipping_address) VALUES (?, ?, ?, ?, ?, "pending", ?, "unpaid", ?, ?, ?)';
            await sqlConn(orderQuery, [userId, business_id, productId, quantity, total_amount, payment_method, shipping_name, shipping_phone, shippingAddress]);

            // 更新库存
            const newStockQuantity = stock_quantity - quantity;
            const updateStockQuery = 'UPDATE products SET stock_quantity = ? WHERE product_id = ?';
            await sqlConn(updateStockQuery, [newStockQuantity, productId]);
        }
        res.json({
            status: "success",
            message: "订单创建成功"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "处理请求时出错: " + error.message
        });
    }
});

module.exports = router;