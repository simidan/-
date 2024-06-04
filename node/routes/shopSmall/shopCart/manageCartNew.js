const express = require('express');
const router = express.Router();
const { sqlConn } = require('../../../database/index');
const verToken = require('../../../utils/verifyToken');

// 清空购物车或删除购物车中的一个或多个商品
router.post('/manageCart', verToken, async(req, res) => {
    const { action, productId, userId } = req.body;

    try {
        if (action === 'clear') {
            // 清空购物车的操作
            const sqlClear = 'DELETE FROM shopping_cart WHERE user_id = ?';
            await sqlConn(sqlClear, [userId]);
            res.json({
                status: "success",
                statusCode: 200,
                message: "购物车已清空"
            });
        } else if (action === 'delete' && productId) {
            // 删除购物车中的一个或多个指定商品
            let sqlDelete = '';
            let params = [];
            if (Array.isArray(productId) && productId.length > 0) {
                // 当productId是一个数组时，处理多个商品ID
                const placeholders = productId.map(() => '?').join(', ');
                sqlDelete = `DELETE FROM shopping_cart WHERE user_id = ? AND product_id IN (${placeholders})`;
                params = [userId, ...productId];
            } else if (productId) {
                // 当productId是单个ID时的处理
                sqlDelete = 'DELETE FROM shopping_cart WHERE user_id = ? AND product_id = ?';
                params = [userId, productId];
            }

            if (sqlDelete) {
                const result = await sqlConn(sqlDelete, params);
                if (result.affectedRows === 0) {
                    res.json({
                        status: "error",
                        statusCode: 404,
                        message: "未找到要删除的商品"
                    });
                } else {
                    res.json({
                        status: "success",
                        statusCode: 200,
                        message: "商品删除成功"
                    });
                }
            } else {
                throw new Error('无效的操作或缺少必要参数');
            }
        } else {
            res.json({
                status: "error",
                statusCode: 400,
                message: "无效的操作或缺少必要参数"
            });
        }
    } catch (error) {
        console.error('Error managing cart:', error);
        res.json({
            status: "error",
            statusCode: 500,
            message: `操作失败：${error.message}`
        });
    }
});

module.exports = router;