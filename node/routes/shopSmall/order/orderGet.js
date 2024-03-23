const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');

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
        // 获取总数据量
        const totalResults = await sqlConn('SELECT COUNT(*) AS total FROM orders WHERE user_id = ?', [userId]);
        const total = totalResults[0].total;
        if (total === 0) {
            // 如果总数据量为0，则直接返回空数据列表，无需进一步查询
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

        // 如果请求的页码小于1或超出了总页数
        if (page < 1 || page > totalPages) {
            return res.status(400).json({
                status: "error",
                message: `请求的页码超出范围。有效页码范围为 1 到 ${totalPages}。`,
            });
        }

        // 从数据库中查询订单数据
        const offset = (page - 1) * limit;
        const orderQuery = 'SELECT * FROM orders WHERE user_id = ? LIMIT ?, ?';
        const orderResult = await sqlConn(orderQuery, [userId, offset, limit]);

        // 返回所有找到的订单以及分页信息
        res.json({
            status: "success",
            statusCode: 200,
            message: "订单查询成功",
            data: {
                orders: orderResult,
                currentPage: page,
                totalPages: totalPages,
                totalOrders: total
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