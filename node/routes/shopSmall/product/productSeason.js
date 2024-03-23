const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const dateO = require('../../../utils/dateOptimization')

// 假设已经像你原始文件中一样导入了express、sqlConn和其他工具

router.get('/productSeason', verToken, async(req, res) => {
    try {
        const month = parseInt(req.query.month); // 从前端发送的月份

        if (isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({
                status: "error",
                message: "无效的月份，应在1至12之间。"
            });
        }

        // 将月份转换为季节
        let season;
        if ([3, 4, 5].includes(month)) {
            season = '春季';
        } else if ([6, 7, 8].includes(month)) {
            season = '夏季';
        } else if ([9, 10, 11].includes(month)) {
            season = '秋季';
        } else {
            season = '冬季';
        }

        // 查询数据库中这一季节的产品
        const query = 'SELECT * FROM products WHERE season = ? AND status = 2 AND stock_quantity > 0';
        const products = await sqlConn(query, [season]);

        // 优化日期字段
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
                message: '未找到匹配季节的商品'
            });
        }

        // 返回匹配的产品
        res.json({
            status: "success",
            statusCode: 200,
            message: "获取匹配季节的商品数据成功",
            data: products
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "搜索季节商品失败: " + error.message
        });
    }
});

module.exports = router;