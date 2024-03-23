const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')

router.put('/productExamine/:id', verToken, limiter(60, 5), async(req, res) => {
    const productId = req.params.id
    const status = req.body.status
    try {

        if (req.body.adminRole !== "superAdmin" && req.body.adminRole !== "productAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        if (status === 2) {
            // 在数据库中查询待审核商家信息
            const result = await sqlConn('UPDATE products SET status = ?, updated_at = CURRENT_TIMESTAMP() WHERE product_id = ?', [
                status,
                productId
            ]);

            if (!result || result.affectedRows === 0) {
                res.json({
                    status: "success",
                    statusCode: 401,
                    message: '审核通过失败'
                });
            }

            // 返回查询结果
            res.json({
                status: "success",
                statusCode: 200,
                message: '审核通过已成功'
            });
        }

        if (status === 0) {
            // 在数据库中查询待审核商家信息
            const result = await sqlConn('UPDATE products SET status = ?, updated_at = CURRENT_TIMESTAMP() WHERE product_id = ?', [
                status,
                productId
            ]);

            if (!result || result.affectedRows === 0) {
                res.json({
                    status: "success",
                    statusCode: 401,
                    message: '商家禁用失败'
                });
            }

            // 返回查询结果
            res.json({
                status: "success",
                statusCode: 200,
                message: '商家禁用已成功'
            });
        }

    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '审核通过失败' + ': ' + error.message
        });
    }
});

module.exports = router;