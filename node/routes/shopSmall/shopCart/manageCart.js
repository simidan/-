const express = require('express');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');

// 清空购物车或删除购物车中的商品
router.delete('/manageCart', verToken, async(req, res) => {
    const { userId, action, productId } = req.body; // 从请求体中获取用户ID、操作类型和商品ID
    try {
        // 从 session 中获取购物车信息
        let cartItems = req.session[userId] || [];

        if (action === 'clear') {
            // 清空购物车
            req.session[userId] = [];
            return res.json({
                status: "success",
                statusCode: 200,
                message: "购物车已清空",
                data: req.session[userId]
            });
        } else if (action === 'delete' && productId) {
            // 删除购物车中的商品
            const index = cartItems.findIndex(item => item.productId === productId);
            if (index !== -1) {
                // 删除该商品
                cartItems.splice(index, 1);
                req.session[userId] = cartItems;

                return res.json({
                    status: "success",
                    statusCode: 200,
                    message: "商品删除成功",
                    data: cartItems
                });
            } else {
                return res.json({
                    status: "error",
                    statusCode: 404,
                    message: "未找到要删除的商品"
                });
            }
        } else {
            return res.json({
                status: "error",
                statusCode: 401,
                message: "无效的操作或缺少必要参数"
            });
        }
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: "操作失败：" + error.message
        });
    }
});

module.exports = router;