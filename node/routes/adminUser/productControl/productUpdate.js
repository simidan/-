const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const limiter = require('../../../utils/limiter');

router.put('/productUpdate/:id', verToken, limiter(60, 5), async(req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body; // 获取商品信息对象

    try {
        if (updatedProduct.adminRole !== "superAdmin" && updatedProduct.adminRole !== "productAdmin") {
            return res.status(403).json({
                status: "error",
                statusCode: 403,
                message: '你没有操作权限'
            });
        }

        const updateQuery = `
            UPDATE products 
            SET sub_category_id = ?, 
                business_id = ?, 
                name = ?, 
                price = ?, 
                unit = ?, 
                stock_quantity = ?, 
                description = ?, 
                origin = ?, 
                harvest_date = ?, 
                shelf_life = ?, 
                certification = ?, 
                season = ?, 
                safety_standards = ?, 
                storage_conditions = ?, 
                grade = ?,
                updated_at = CURRENT_TIMESTAMP() 
            WHERE product_id = ?;
        `;

        // 在数据库中查找并更新商品信息
        const result = await sqlConn(updateQuery, [
            updatedProduct.sub_category_id,
            updatedProduct.business_id,
            updatedProduct.name,
            updatedProduct.price,
            updatedProduct.unit,
            updatedProduct.stock_quantity,
            updatedProduct.description,
            updatedProduct.origin,
            updatedProduct.harvest_date,
            updatedProduct.shelf_life,
            updatedProduct.certification,
            updatedProduct.season,
            updatedProduct.safety_standards,
            updatedProduct.storage_conditions,
            updatedProduct.grade,
            productId
        ]);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: '商品不存在'
            });
        }

        // 返回更新后的商品信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '商品信息修改成功'
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '商品消息修改失败' + ': ' + error.message
        });
    }
});

module.exports = router;