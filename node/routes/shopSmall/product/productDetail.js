const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const dateO = require('../../../utils/dateOptimization')

router.get('/productDetail', verToken, async(req, res) => {
    try {
        let { product_id } = req.query;
        if (!product_id) {
            return res.status(400).json({
                status: "error",
                message: "请求必须包含 product_id 参数。",
            });
        }

        if (typeof product_id === 'string') {
            product_id = product_id.split(',').map(id => id.trim());
        }

        const placeholders = product_id.map(() => '?').join(',');
        const query = `SELECT * FROM products WHERE product_id IN (${placeholders})`;
        const products = await sqlConn(query, product_id);

        if (!products || products.length === 0) {
            return res.status(404).json({
                status: "error",
                message: '未找到指定的商品',
            });
        }

        const processedProducts = products.map(product => {
            product.created_at = dateO(product.created_at);
            product.updated_at = dateO(product.updated_at);
            product.harvest_date = dateO(product.harvest_date);
            const relativePath = product.image.replace(/\\/g, "/");
            product.image = `http://localhost:9000${relativePath}`;
            return product;
        });

        if (processedProducts.length === 1) {
            return res.json({
                status: "success",
                statusCode: 200,
                message: "获取指定商品数据成功",
                data: processedProducts[0]
            });
        } else {
            return res.json({
                status: "success",
                statusCode: 200,
                message: "获取指定商品数据成功",
                data: processedProducts
            });
        }

    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "查询指定商品失败" + ": " + error.message
        });
    }
});

module.exports = router;