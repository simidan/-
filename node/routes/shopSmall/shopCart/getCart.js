const express = require('express');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')

router.get('/getCart', verToken, async(req, res) => {
    const { userId } = req.body; // 从请求体中获取用户ID
    try {
        // 从 session 中获取购物车信息
        const cartItems = req.session[userId] || [];

        if (cartItems.length === 0) {
            return res.json({
                status: "error",
                statusCode: 401,
                message: "购物车为空"
            });
        }

        res.json({
            status: "success",
            statusCode: 200,
            message: "获取购物车商品成功",
            data: cartItems
        });
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: "获取购物车商品失败：" + error.message
        });
    }
});

module.exports = router;