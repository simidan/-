const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const dateO = require('../../../utils/dateOptimization')

router.get('/orderSearch', verToken, limiter(60, 5), async(req, res) => {
    const searchKey = req.query.searchKey; // 获取订单输入的关键字
    try {
        if (req.body.adminRole !== "superAdmin" && req.body.adminRole !== "orderAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 403,
                message: '你没有操作权限'
            });
        }
        if (!searchKey) {
            return res.json({
                status: "success",
                statusCode: 400,
                message: '关键词不能为空'
            });
        }

        // 在数据库中查询订单信息
        // 首先获取满足条件的总数据量
        const totalResultsBody = `SELECT COUNT(*) AS total FROM orders WHERE order_id = ?`;
        const totalResults = await sqlConn(totalResultsBody, [searchKey]);
        const total = totalResults[0].total;

        const limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        if (total === 0) {
            return res.json({
                status: "success",
                statusCode: 409,
                message: '没有找到匹配的订单',
                data: []
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
        const sql = `SELECT * FROM orders WHERE order_id = ? LIMIT ? OFFSET ?`;
        const result = await sqlConn(sql, [searchKey, limit, offset]);

        result.forEach(element => {
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);
        });

        // 返回查询结果
        return res.json({
            status: "success",
            statusCode: 200,
            message: '订单查询成功',
            data: result,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalResults: total,
                limit: limit
            }
        });
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: '订单查询失败' + ': ' + error.message
        });
    }
});

module.exports = router;