const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const dateO = require('../../../utils/dateOptimization');

router.get('/productSearch', verToken, async(req, res) => {
    try {
        let { name, field, limit, page } = req.query;

        // 输入验证和清理
        name = typeof name === 'string' ? name.trim() : '';
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        if (!name) {
            return res.status(400).json({ status: "error", message: "搜索产品名称不能为空" });
        }

        // 计算总页数
        const totalResults = await sqlConn(`SELECT COUNT(*) AS total FROM products WHERE status = 2 AND ${field} LIKE ? AND stock_quantity > 0`, [`%${name}%`]);
        const total = totalResults[0].total;
        const totalPages = Math.ceil(total / limit);

        // 分页逻辑
        if (page < 1 || page > totalPages) {
            page = Math.max(1, Math.min(page, totalPages)); // 调整页码至有效范围
        }

        // 数据库查询
        const offset = (page - 1) * limit;
        const products = await sqlConn(`SELECT * FROM products WHERE status = 2 AND ${field} LIKE ? AND stock_quantity > 0 LIMIT ? OFFSET ?`, [`%${name}%`, limit, offset]);

        // 时间格式转换
        products.forEach(product => {
            product.created_at = dateO(product.created_at);
            product.updated_at = dateO(product.updated_at);
            product.harvest_date = dateO(product.harvest_date);
        });

        // 返回数据
        res.json({
            status: "success",
            message: "获取匹配的商品数据成功",
            data: {
                products,
                pagination: { limit, page, total, totalPages }
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "搜索商品失败: " + error.message });
    }
});

module.exports = router;