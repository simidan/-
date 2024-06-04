const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const dateO = require('../../../utils/dateOptimization');

router.get('/productSearchByCategory', verToken, async(req, res) => {
    try {
        let { category_id, sub_category_id, limit, page, sortBy, order, origin, harvestDateStart, harvestDateEnd } = req.query;

        // 输入处理和验证
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        sortBy = sortBy ? sortBy.trim() : 'created_at';
        order = typeof order === 'string' && ['asc', 'desc'].includes(order.toLowerCase()) ? order : 'asc';
        origin = typeof origin === 'string' ? origin.trim() : null;
        harvestDateStart = typeof harvestDateStart === 'string' ? harvestDateStart : null;
        harvestDateEnd = typeof harvestDateEnd === 'string' ? harvestDateEnd : null;

        // 构建查询条件
        let query = `SELECT p.* FROM products p`;
        let queryParams = [];

        if (sub_category_id > 0) {
            query += " JOIN sub_categories sc ON p.sub_category_id = sc.sub_category_id WHERE p.status = 2 AND sc.sub_category_id = ?";
            queryParams.push(sub_category_id);
        } else if (category_id) {
            query += " JOIN sub_categories sc ON p.sub_category_id = sc.sub_category_id WHERE p.status = 2 AND sc.category_id = ?";
            queryParams.push(category_id);
        }

        if (origin) {
            // 分割origin为省、市、区
            let [province, city, district] = origin.split('-');

            // 处理特殊情况：数据库存储为“市辖区”而前端传来的是具体城市名
            let originQueryParts = [];
            originQueryParts.push(`p.origin LIKE '${province}%'`); // 省份部分使用LIKE匹配

            // 对于市辖区的特殊处理，如果前端传来的是具体城市名，数据库中可能记录为“市辖区”
            if (city && city !== province) { // 城市名存在且不等于省份名（避免直辖市问题）
                originQueryParts.push(`(p.origin LIKE '%${city}%' OR p.origin LIKE '%市辖区%')`);
            }

            // 对于区域，使用精确匹配
            if (district) {
                originQueryParts.push(`p.origin LIKE '%${district}'`);
            }

            let originQuery = originQueryParts.join(' AND ');
            query += ` AND (${originQuery})`;
        }

        if (harvestDateStart && harvestDateEnd) {
            query += " AND p.harvest_date BETWEEN ? AND ?";
            queryParams.push(harvestDateStart, harvestDateEnd);
        }

        const totalResults = await sqlConn(`SELECT COUNT(*) AS total FROM (${query}) as totalQuery`, queryParams);
        const total = totalResults[0].total;
        const totalPages = Math.ceil(total / limit);

        page = Math.max(1, Math.min(page, totalPages)); // 保持页码在有效范围内

        const offset = (page - 1) * limit;
        query += ` ORDER BY p.${sortBy === 'price' ? 'price' : 'created_at'} ${order} LIMIT ? OFFSET ?`;
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