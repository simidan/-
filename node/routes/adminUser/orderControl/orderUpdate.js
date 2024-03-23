const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')

router.put('/orderUpdate/:id', verToken, limiter(60, 5), async(req, res) => {
    const orderId = req.params.id;
    const updatedOrder = req.body; // 获取订单信息对象

    try {
        if (updatedOrder.adminRole !== "superAdmin" && updatedOrder.adminRole !== "ordertAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        // 在数据库中查找并更新订单信息
        const result = await sqlConn(
            'UPDATE orders SET user_id = ?, business_id = ?, product_id = ?, quantity=?,total_amount = ?, status = ?, payment_method = ?, payment_status = ?, shipping_name = ?, shipping_phone = ?, shipping_address = ?, updated_at = CURRENT_TIMESTAMP() WHERE order_id = ?;', [
                updatedOrder.user_id,
                updatedOrder.business_id,
                updatedOrder.product_id,
                updatedOrder.quantity,
                updatedOrder.total_amount,
                updatedOrder.status,
                updatedOrder.payment_method,
                updatedOrder.payment_status,
                updatedOrder.shipping_name,
                updatedOrder.shipping_phone,
                updatedOrder.shipping_address,
                orderId
            ]
        );

        if (!result || result.affectedRows === 0) {
            return res.json({
                status: "error",
                statusCode: 404,
                message: '订单不存在'
            });
        }

        // 返回更新后的订单信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '订单信息修改成功',
            data: result
        });
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: '订单消息修改失败' + ': ' + error.message
        });
    }
});

module.exports = router;