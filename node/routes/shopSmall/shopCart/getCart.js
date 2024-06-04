const express = require('express');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const { sqlConn } = require('../../../database/index');

router.get('/getCart', verToken, async(req, res) => {
    const userId = req.body.userId;
    const limit = parseInt(req.query.limit) || 10; // 设置默认每页条数为10
    let page = parseInt(req.query.page) || 1; // 默认页码为第1页

    if (!userId) {
        return res.json({
            status: "error",
            statusCode: 400,
            message: "缺少必要的用户ID参数"
        });
    }

    try {
        // 获取总数据量
        const totalResults = await sqlConn('SELECT COUNT(*) AS total FROM shopping_cart WHERE user_id = ?', [userId]);
        const total = totalResults[0].total;
        if (total === 0) {
            // 如果总数据量为0，则直接返回空数据列表
            return res.json({
                status: "success",
                statusCode: 201,
                message: "购物车为空",
                data: {
                    cartItems: [],
                    currentPage: page,
                    totalPages: 0,
                    totalItems: total
                }
            });
        }

        const totalPages = Math.ceil(total / limit);

        // 如果请求的页码小于1或超出了总页数
        if (page < 1 || page > totalPages) {
            return res.status(400).json({
                status: "error",
                message: `请求的页码超出范围。有效页码范围为 1 到 ${totalPages}。`,
            });
        }

        // 计算查询的偏移量
        const offset = (page - 1) * limit;
        // 分页查询购物车数据
        const sql = `
            SELECT sc.product_id, sc.quantity, p.name, p.price, p.image
            FROM shopping_cart sc
            JOIN products p ON sc.product_id = p.product_id
            WHERE sc.user_id = ?
            LIMIT ?, ?`;
        const cartItems = await sqlConn(sql, [userId, offset, limit]);

        // 调整图片路径和构造响应数据
        const formattedCartItems = cartItems.map(item => ({
            productId: item.product_id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
            image: `http://localhost:9000${item.image.replace(/\\/g, "/")}`,
        }));

        res.json({
            status: "success",
            statusCode: 200,
            message: "获取购物车商品成功",
            data: formattedCartItems,
            pagination: {
                total: total,
                page: page,
                limit: limit,
                totalPages: totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.json({
            status: "error",
            statusCode: 500,
            message: "获取购物车商品失败：" + error.message
        });
    }
});

module.exports = router;