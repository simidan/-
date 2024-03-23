const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')

router.put('/businessUpdate/:id', verToken, limiter(60, 5), async(req, res) => {
    const businessId = req.params.id;
    const updatedBusiness = req.body; // 获取商家信息对象

    try {
        if (updatedBusiness.adminRole !== "superAdmin" && updatedBusiness.adminRole !== "businessAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        // 在数据库中查找并更新商家信息
        const result = await sqlConn(
            'UPDATE business SET business_name = ?, phone = ?, email = ?, address = ?, updated_at = CURRENT_TIMESTAMP() WHERE business_id = ?', [
                updatedBusiness.businessName,
                updatedBusiness.phone,
                updatedBusiness.email,
                updatedBusiness.address,
                businessId
            ]
        );

        if (!result || result.affectedRows === 0) {
            return res.json({
                status: "error",
                statusCode: 404,
                message: '商家不存在'
            });
        }

        // 返回更新后的商家信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '商家信息修改成功'
        });
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: '商家消息修改失败' + ': ' + error.message
        });
    }
});

module.exports = router;