const express = require('express');
const { sqlConn } = require('../../../database/index');
const limiter = require('../../../utils/limiter');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const dateO = require('../../../utils/dateOptimization')
const path = require('path');

router.get('/getAvatar/:id', verToken, limiter(60, 5), async(req, res) => {
    const userId = req.params.id;

    try {
        // 从数据库中查询用户头像路径
        const result = await sqlConn('SELECT avatar FROM users WHERE user_id = ?', [userId]);

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: '用户不存在或没有上传头像'
            });
        }

        const avatarPath = result[0].avatar;

        if (!avatarPath) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: '没有找到用户的头像'
            });
        }

        // 发送头像文件回客户端
        const filePath = path.join(__dirname, '..', '..', avatarPath); // 确保路径正确
        console.log(filePath);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '获取头像失败: ' + error.message
        });
    }
});

module.exports = router;