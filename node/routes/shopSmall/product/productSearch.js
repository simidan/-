const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const dateO = require('../../../utils/dateOptimization');

router.get('/productSearch', verToken, async(req, res) => {
    try {
        let { name, limit, page, sortBy, order, origin, harvestDateStart, harvestDateEnd } = req.query;

        // 输入处理和验证
        console.log(name, limit, page, sortBy, order, origin, harvestDateStart, harvestDateEnd);
        name = typeof name === 'string' ? name.trim() : '';
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        sortBy = sortBy ? sortBy.trim() : 'created_at'; // 若 sortBy 为空，则默认为 'created_at'
        order = typeof order === 'string' && ['asc', 'desc'].includes(order.toLowerCase()) ? order : 'asc';
        origin = typeof origin === 'string' ? origin.trim() : null;
        harvestDateStart = typeof harvestDateStart === 'string' ? harvestDateStart : null;
        harvestDateEnd = typeof harvestDateEnd === 'string' ? harvestDateEnd : null;

        // 构建查询条件
        let query = `SELECT * FROM products WHERE status = 2 AND name LIKE ?`;
        let queryParams = [`%${name}%`];

        if (origin) {
            // 分割origin并处理特殊情况
            let [province, city, district] = origin.split('-').filter(v => v.trim() !== '');
            if (city === '市辖区' || city === province) { city = ''; }
            if (district === '市辖区') { district = ''; }
            let originPattern = `${province}%`;
            if (city) originPattern += `${city}%`;
            if (district) originPattern += `${district}`;
            query += " AND origin LIKE ?";
            queryParams.push(originPattern);
        }

        if (harvestDateStart && harvestDateEnd) {
            query += " AND harvest_date BETWEEN ? AND ?";
            queryParams.push(harvestDateStart, harvestDateEnd);
        }

        const totalResults = await sqlConn(`SELECT COUNT(*) AS total FROM (${query}) as totalQuery`, queryParams);
        const total = totalResults[0].total;
        const totalPages = Math.ceil(total / limit);

        page = Math.max(1, Math.min(page, totalPages)); // 保持页码在有效范围内

        const offset = (page - 1) * limit;
        query += ` ORDER BY ${sortBy === 'price' ? 'price' : 'created_at'} ${order} LIMIT ? OFFSET ?`; // 根据 sortBy 参数选择排序字段
        queryParams.push(limit, offset);

        const products = await sqlConn(query, queryParams);

        // 时间格式化
        products.forEach(product => {
            product.created_at = dateO(product.created_at);
            product.updated_at = dateO(product.updated_at);
            product.harvest_date = dateO(product.harvest_date);
            let relativePath = product.image.replace(/\\/g, "/"); // 替换反斜杠为正斜杠
            product.image = `http://localhost:9000${relativePath}`;
        });

        // 返回数据
        res.json({
            status: "success",
            statusCode: 200,
            message: "获取商品数据成功",
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
            message: "搜索商品失败: " + error.message
        });
    }
});

module.exports = router;