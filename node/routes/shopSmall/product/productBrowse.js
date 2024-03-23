const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const dateO = require('../../../utils/dateOptimization')
const limiter = require('../../../utils/limiter')

router.get('/productBrowse', verToken, limiter(60, 10), async(req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        // 获取总数据量
        const totalResults = await sqlConn('SELECT COUNT(*) AS total FROM products WHERE status = 2');
        const total = totalResults[0].total;
        const totalPages = Math.ceil(total / limit);

        // 如果请求的页码小于1或超出了总页数
        if (page < 1 || page > totalPages) {
            return res.json({
                status: "error",
                statusCode: 400,
                message: `请求的页码超出范围。有效页码范围为 1 到 ${totalPages}。`,
            });
        }
        // 从数据库中查询商品数据
        const offset = (page - 1) * limit;

        const product = await sqlConn('SELECT * FROM products WHERE status = 2 LIMIT ?, ?', [offset, limit]);

        if (!product || product.length === 0) {
            return res.json({
                status: "success",
                statusCode: 401,
                message: '查询失败'
            });
        }

        product.forEach(element => {
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);
        });

        // 返回商品数据
        res.json({
            status: "success",
            statusCode: 200,
            message: "获取商品数据成功",
            data: product
        });
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: "获取商品数据失败" + ": " + error.message
        });
    }
});

module.exports = router;