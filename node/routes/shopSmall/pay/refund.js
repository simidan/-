const express = require('express');
const router = express.Router();
const { sqlConn } = require('../../../database/index');
const verToken = require('../../../utils/verifyToken');
const statusHelper = require('../../../utils/statusHelper');
const limit = require('../../../utils/limiter');

// 发起退款接口
router.post('/refund', verToken, limit(30, 3), async(req, res) => {
    const orderId = req.body.orderId;

    if (!orderId) {
        return statusHelper(res, 'e', 400, "缺少必要参数");
    }

    try {
        // 从订单中获取产品ID和购买数量
        const getOrderInfoSql = 'SELECT product_id, quantity FROM orders WHERE order_id = ?';
        const orderInfo = await sqlConn(getOrderInfoSql, [orderId]);

        if (orderInfo.length === 0) {
            return statusHelper(res, 'e', 404, "该订单不存在");
        }

        const { product_id, quantity } = orderInfo[0];

        // 更新订单状态为取消和支付状态为失败
        const updateOrderSql = 'UPDATE orders SET status = ?, payment_status = ? WHERE order_id = ?';
        const result = await sqlConn(updateOrderSql, ['cancelled', 'failed', orderId]);

        if (!result || result.affectedRows === 0) {
            return statusHelper(res, 'e', 404, "订单状态更新失败");
        }

        // 将取消的订单数量添加回产品库存
        const updateProductSql = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_id = ?';
        await sqlConn(updateProductSql, [quantity, product_id]);

        return statusHelper(res, 's', 200, "退款成功，订单已取消，产品库存已更新");
    } catch (error) {
        return statusHelper(res, 'e', 500, "处理请求时出错: " + error.message);
    }
});

module.exports = router;