const express = require('express');
const { sqlConn } = require('../../database/index');
const router = express.Router();
const dateO = require('../../utils/dateOptimization');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

// 登录路由
router.post('/checkToken', (req, res) => {
    const token = req.body.token;
    jwt.verify(token, secretKey, async(err, decoded) => {
        if (err) {
            console.log(err);
            // 如果在验证过程中出现错误，发送一个未授权的状态。
            return res.status(401).json({ error: '无效token' });
        }

        try {
            const sql = 'SELECT * FROM users WHERE user_id = ?';
            const users = await sqlConn(sql, decoded.userId);

            if (!users || users.length === 0) {
                return res.status(404).json({ error: '用户未找到' });
            }

            // 从查询结果中取出用户信息
            const user = users[0];

            // 移除敏感或不必要的信息
            delete user.password_hash;
            delete user.created_at;
            delete user.updated_at;
            if (user.birthday) {
                user.birthday = dateO(user.birthday)
            }
            if (user.avatar) {
                let relativePath = user.avatar.replace(/\\/g, "/"); // 替换反斜杠为正斜杠
                user.avatar = `http://localhost:9000${relativePath}`; // 使用正确的路径
            }

            // 如果找到了用户，返回用户信息。
            res.json({
                status: "success",
                statusCode: 200,
                message: 'token检查无误，用户信息获取成功',
                data: user
            });

        } catch (dbError) {
            // 处理任何数据库错误
            console.error(dbError);
            res.status(500).json({
                status: "error",
                statusCode: 500,
                message: '数据库查询失败: ' + dbError.message
            });
        }
    });
});

module.exports = router;