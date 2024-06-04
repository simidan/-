const express = require('express');
const bcrypt = require('bcrypt');
const { sqlConn } = require('../../database/index');
const router = express.Router();

// 注册路由
router.post('/register', async(req, res) => {
    try {
        const { username, password, email, phone, gender, birthday } = req.body;
        // 输入验证（示例，需要根据实际情况调整）
        if (!username || !password || !phone) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: '请填写完整信息'
            });
        }

        if (password.length < 6 || password.length > 15) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: '请输入长度在6到15位之间的密码'
            });
        }

        // 检查用户名或手机的唯一性
        const checkUserSql = 'SELECT * FROM users WHERE username = ? OR phone = ? LIMIT 1';
        const userExists = await sqlConn(checkUserSql, [username, phone]);
        if (userExists.length > 0) {
            return res.status(409).json({
                status: "error",
                statusCode: 409,
                message: '用户已注册名或邮箱'
            });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用户
        const insertSql = 'INSERT INTO users (username, password_hash, email, phone, gender, birthday, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await sqlConn(insertSql, [username, hashedPassword, email, phone, gender, birthday, 1]);

        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: '用户注册成功'
        });
        // console.log(res);
    } catch (error) {
        // console.error(error);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '用户注册失败' + ': ' + error.message
        });
    }
});

module.exports = router;