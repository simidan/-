const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const limiter = require('../../../utils/limiter');

router.delete('/businessDelete/:id', verToken, limiter(60, 5), async(req, res) => {
    const businessId = req.params.id; // 获取要删除的商家 ID

    try {
        if (req.body.adminRole !== "superAdmin" && req.body.adminRole !== "businessAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        // 在数据库中删除商家信息
        const result = await sqlConn('DELETE FROM business WHERE business_id = ?', [businessId]);

        if (!result || result.affectedRows === 0) {
            res.json({
                status: "error",
                statusCode: 500,
                message: '商家删除失败',
            });
        }

        // 返回删除成功的信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '商家删除成功',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '商家删除失败' + ': ' + error.message
        });
    }
});

module.exports = router;