const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const limiter = require('../../../utils/limiter');

router.post('/orderCreate', verToken, limiter(60, 5), async(req, res) => {
    const { userId, payment_method, shippingAddress, items } = req.body;
    const orders = items || [{ productId: req.body.productId, quantity: req.body.quantity || 1 }];

    try {
        // 验证用户是否存在
        const userQuery = 'SELECT username, phone FROM users WHERE user_id = ?';
        const userResult = await sqlConn(userQuery, [userId]);
        if (userResult.length === 0) {
            return res.json({
                status: "error",
                statusCode: 404,
                message: "用户未找到"
            });
        }
        const shipping_name = userResult[0].username;
        const shipping_phone = userResult[0].phone;

        for (const { productId, quantity }
            of orders) {
            // 验证产品是否存在并获取产品信息
            const productQuery = 'SELECT product_id, business_id, price, stock_quantity FROM products WHERE product_id = ?';
            const productResult = await sqlConn(productQuery, [productId]);
            if (productResult.length === 0) {
                return res.json({
                    status: "error",
                    statusCode: 404,
                    message: "商品未找到"
                });
            }

            const { product_id, business_id, price, stock_quantity } = productResult[0];

            // 检查库存是否足够
            if (quantity > stock_quantity) {
                return res.json({
                    status: "error",
                    statusCode: 400,
                    message: "库存不足"
                });
            }

            // 创建订单
            const total_amount = price * quantity;
            const insertOrderQuery = 'INSERT INTO orders (user_id, business_id, product_id, total_amount, status, payment_method, payment_status, shipping_name, shipping_phone, shipping_address) VALUES (?, ?, ?, ?, "pending", ?, "unpaid", ?, ?, ?)';
            await sqlConn(insertOrderQuery, [userId, business_id, product_id, total_amount, payment_method, shipping_name, shipping_phone, shippingAddress]);

            // 更新库存
            const newStockQuantity = stock_quantity - quantity;
            const updateStockQuery = 'UPDATE products SET stock_quantity = ? WHERE product_id = ?';
            await sqlConn(updateStockQuery, [newStockQuantity, productId]);
        }

        res.json({
            status: "success",
            statusCode: 200,
            message: "订单创建成功"
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: "error",
            statusCode: 500,
            message: "处理请求时出错: " + error.message
        });
    }
});

module.exports = router;