const express = require('express');
const { sqlConn } = require('../../database/index');
const router = express.Router();
const verToken = require('../../utils/verifyToken')
const limiter = require('../../utils/limiter')

router.put('/userUpdate', verToken, limiter(60, 5), async(req, res) => {
    const updatedUser = req.body; // 获取用户信息对象

    try {
        // 在数据库中查找并更新用户信息
        const result = await sqlConn(
            'UPDATE users SET username = ?, phone = ?, email = ?, full_name = ?, gender = ?, birthday = ?, updated_at = CURRENT_TIMESTAMP() WHERE user_id = ?', [
                updatedUser.username,
                updatedUser.phone,
                updatedUser.email,
                updatedUser.full_name,
                updatedUser.gender,
                updatedUser.birthday,
                updatedUser.userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: '用户不存在'
            });
        }

        // 返回更新后的用户信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '信息修改成功'
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '消息修改失败' + ': ' + error.message
        });
    }
});

module.exports = router;