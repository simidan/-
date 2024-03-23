const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const limiter = require('../../../utils/limiter');

router.put('/userStatus/:id', verToken, limiter(60, 5), async(req, res) => {
    const userId = req.params.id; // 获取的用户 ID
    const { status, adminRole } = req.body

    try {
        console.log(status);
        if (adminRole !== "superAdmin" && adminRole !== "userAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }
        // 在数据库用户信息
        await sqlConn('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP() WHERE user_id = ?', [
            status,
            userId
        ]);

        // 返回成功的信息
        res.json({
            status: "success",
            statusCode: 200,
            message: status === 0 ? '用户已禁用' : '用户已取消禁用',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '用户删除失败' + ': ' + error.message
        });
    }
});

module.exports = router;