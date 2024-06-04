const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const dateO = require('../../../utils/dateOptimization');

// Endpoint to fetch order information by order_id
router.get('/orderDetail', verToken, async(req, res) => {
    const orderId = req.query.orderId;

    if (!orderId) {
        return res.json({
            status: "error",
            statusCode: 400,
            message: "缺少必要的订单ID参数"
        });
    }

    try {
        const orderQuery = `
            SELECT o.*, p.name AS product_name, p.image AS product_image
            FROM orders o
            JOIN products p ON o.product_id = p.product_id
            WHERE o.order_id = ?`;
        const orderResult = await sqlConn(orderQuery, [orderId]);

        if (orderResult.length === 0) {
            return res.json({
                status: "success",
                statusCode: 404,
                message: "未找到指定的订单",
            });
        }

        // Assuming the query will return a single order, we take the first element
        const orderDetails = orderResult[0];
        orderDetails.created_at = dateO(orderDetails.created_at);
        orderDetails.updated_at = dateO(orderDetails.updated_at);
        let relativePath = orderDetails.product_image.replace(/\\/g, "/");
        orderDetails.product_image = `http://localhost:9000${relativePath}`;

        res.json({
            status: "success",
            statusCode: 200,
            message: "订单详情查询成功",
            data: orderDetails
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