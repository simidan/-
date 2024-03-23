const express = require('express');
const { sqlConn } = require('../../database/index');
const router = express.Router();
const verToken = require('../../utils/verifyToken')
const limiter = require('../../utils/limiter')

router.put('/address', verToken, limiter(60, 5), async(req, res) => {
    let { default_address, userId } = req.body; // 获取用户信息对象

    try {

        // 在数据库中查找并更新用户信息
        const result = await sqlConn(
            'UPDATE users SET default_address = ?, updated_at = CURRENT_TIMESTAMP() WHERE user_id = ?', [
                default_address,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.json({
                status: "error",
                statusCode: 404,
                message: '用户不存在'
            });
        }

        // 返回更新后的用户信息
        const updatedUserInfo = default_address // 更新后的用户信息对象
        res.json({
            status: "success",
            statusCode: 200,
            message: '地址修改成功',
            data: updatedUserInfo
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '地址修改失败' + ': ' + error.message
        });
    }
});

module.exports = router;