const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const dateO = require('../../../utils/dateOptimization')

router.get('/productShow', verToken, async(req, res) => {
    try {
        const productId = req.query.productId

        const limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        // 获取总数据量，添加 WHERE 子句以过滤掉 status 不为 2 且 库存 不为 0 的数据
        const totalResults = await sqlConn(`SELECT COUNT(*) AS total FROM products WHERE status = 2 AND stock_quantity > 0`, []);
        const total = totalResults[0].total;
        const totalPages = Math.ceil(total / limit);

        // 如果请求的页码小于1或超出了总页数
        if (page < 1 || page > totalPages) {
            return res.status(400).json({
                status: "error",
                message: `请求的页码超出范围。有效页码范围为 1 到 ${totalPages}。`,
            });
        }

        // 从数据库中查询商品数据，添加 WHERE 子句以过滤掉 status 不为 2 且 库存 不为 0 的数据
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM products WHERE status = 2 AND stock_quantity > 0 LIMIT ? OFFSET ?`;
        const products = await sqlConn(query, [limit, offset]);

        products.forEach(product => {
            product.created_at = dateO(product.created_at);
            product.updated_at = dateO(product.updated_at);
            product.harvest_date = dateO(product.harvest_date);
            const relativePath = product.image.replace(/\\/g, "/")
            product.image = `http://localhost:9000${relativePath}`
        });

        if (!products || products.length === 0) {
            return res.json({
                status: "error",
                statusCode: 404,
                message: '未找到匹配的商品'
            });
        }

        // 返回匹配的商品数据
        res.json({
            status: "success",
            statusCode: 200,
            message: "获取匹配的商品数据成功",
            data: products,
            pagination: {
                total: total,
                page: page,
                limit: limit,
                totalPages: totalPages
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "搜索商品失败" + ": " + error.message
        });
    }
});

module.exports = router;