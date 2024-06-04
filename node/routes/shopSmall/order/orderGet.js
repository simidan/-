const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const dateO = require('../../../utils/dateOptimization')

// 根据 user_id 查询订单接口
router.get('/orderGet', verToken, async(req, res) => {
    const userId = req.body.userId;
    const limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;

    if (!userId) {
        return res.json({
            status: "error",
            statusCode: 400,
            message: "缺少必要的用户ID参数"
        });
    }

    try {
        const totalResults = await sqlConn('SELECT COUNT(*) AS total FROM orders WHERE user_id = ?', [userId]);
        const total = totalResults[0].total;
        if (total === 0) {
            return res.json({
                status: "success",
                statusCode: 200,
                message: "未找到该用户的订单",
                data: {
                    orders: [],
                    currentPage: page,
                    totalPages: 0,
                    totalOrders: total
                }
            });
        }

        const totalPages = Math.ceil(total / limit);

        if (page < 1 || page > totalPages) {
            return res.status(400).json({
                status: "error",
                message: `请求的页码超出范围。有效页码范围为 1 到 ${totalPages}。`,
            });
        }

        const offset = (page - 1) * limit;
        const orderQuery = `
            SELECT o.*, p.name AS product_name, p.image AS product_image
            FROM orders o
            JOIN products p ON o.product_id = p.product_id
            WHERE o.user_id = ?
            LIMIT ?, ?`;
        const orderResult = await sqlConn(orderQuery, [userId, offset, limit]);

        orderResult.forEach(element => {
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);
            let relativePath = element.product_image.replace(/\\/g, "/"); // 替换反斜杠为正斜杠
            element.product_image = `http://localhost:9000${relativePath}`; // 使用正确的路径
        });

        res.json({
            status: "success",
            statusCode: 200,
            message: "订单查询成功",
            data: orderResult,
            pagination: {
                total: total,
                page: page,
                limit: limit,
                totalPages: totalPages
            }

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