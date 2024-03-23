const express = require('express');
const router = express.Router();
const { sqlConn } = require('../../../database/index')
const verToken = require('../../../utils/verifyToken');
const statusHelper = require('../../../utils/statusHelper');
const limit = require('../../../utils/limiter')

// 根据商品信息、用户信息和支付方式生成支付二维码接口
router.post('/paySuccess', verToken, limit(60, 5), async(req, res) => {
    const orderId = req.body.orderId

    if (!orderId) {
        return statusHelper(res, 'e', 400, "缺少必要参数")
    }

    try {
        const sql = 'UPDATE orders SET status = ?, payment_status = ? WHERE order_id = ?'
        const result = await sqlConn(sql, ['paid', 'success', orderId]);

        if (!result || result.affecrtedRow === 0) {
            return statusHelper(res, 'e', 404, "订单不存在")
        }

        return statusHelper(res, 's', 200, "支付成功")
    } catch (error) {
        return statusHelper(res, 'e', 500, "处理请求时出错: " + error.message)
    }
});

module.exports = router;