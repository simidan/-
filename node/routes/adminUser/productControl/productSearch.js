const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const dateO = require('../../../utils/dateOptimization')

router.get('/productSearch', verToken, limiter(60, 5), async(req, res) => {
    const searchKey = req.query.searchKey; // 获取商品输入的关键字
    try {

        if (req.body.adminRole !== "superAdmin" && req.body.adminRole !== "productAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
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

        const totalResultsBody = `SELECT COUNT(*) AS total FROM products WHERE name = ?`;
        const totalResults = await sqlConn(totalResultsBody, [searchKey]);
        const total = totalResults[0].total;

        const limit = parseInt(req.body.limit) || 10;
        let page = parseInt(req.body.page) || 1;

        if (total === 0) {
            return res.json({
                status: "success",
                statusCode: 200,
                message: '没有找到匹配的商品',
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

        // 在数据库中查询商品信息
        const result = await sqlConn(`SELECT * FROM products WHERE name = ? LIMIT ? OFFSET ?`, [searchKey, limit, offset]);

        result.forEach(element => {
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);
        });

        // 返回查询结果
        return res.json({
            status: "success",
            statusCode: 200,
            message: '商品查询成功',
            data: result,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalResults: total,
                limit: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '商品查询失败' + ': ' + error.message
        });
    }
});

module.exports = router;