const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')

router.post('/orderUpdate', verToken, limiter(60, 5), async(req, res) => {
    const orderId = req.body.orderId; // 订单ID
    const newPaymentStatus = req.body.paymentStatus; // 客户端指定的新支付状态

    // 验证新支付状态是否有效
    const validPaymentStatuses = ['unpaid', 'success', 'failed'];
    if (!validPaymentStatuses.includes(newPaymentStatus)) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "无效的支付状态"
        });
    }

    try {
        // 检查订单是否存在并获取当前订单状态
        const checkOrderQuery = 'SELECT order_id, status FROM orders WHERE order_id = ?';
        const orderResult = await sqlConn(checkOrderQuery, [orderId]);
        if (orderResult.length === 0) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "订单未找到"
            });
        }

        let updateQuery;
        let queryParams;

        // 如果支付失败，更新订单的支付状态为'failed'，但保持订单的主状态不变
        if (newPaymentStatus === 'failed') {
            updateQuery = 'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE order_id = ?';
            queryParams = [newPaymentStatus, orderId];
        } else if (newPaymentStatus === 'success') {
            updateQuery = 'UPDATE orders SET payment_status = ?, status = ?, updated_at = NOW() WHERE order_id = ?';
            queryParams = [newPaymentStatus, 'paid', orderId];
        }

        await sqlConn(updateQuery, queryParams);

        res.json({
            status: "success",
            statusCode: 200,
            message: "订单支付状态更新成功"
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