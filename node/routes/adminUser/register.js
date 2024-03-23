const express = require('express');
const bcrypt = require('bcrypt');
const { sqlConn } = require('../../database/index');
const router = express.Router();

// 注册路由
router.post('/register', async(req, res) => {
    try {
        const { username, password, email, phone, role, gender, birthday } = req.body;
        // 输入验证（示例，需要根据实际情况调整）
        if (!username || !password || !email) {
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
                message: '请输入长度在6到10位之间的密码'
            });
        }


        // 检查用户名或邮箱的唯一性
        const checkUserSql = 'SELECT * FROM admin_users WHERE username = ? LIMIT 1';
        const adminExists = await sqlConn(checkUserSql, [username]);
        if (adminExists.length > 0) {
            return res.status(409).json({
                status: "error",
                statusCode: 409,
                message: '用户已注册名或邮箱'
            });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用户
        const insertSql = 'INSERT INTO admin_users (username, password, role, email, phone, gender, birthday, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await sqlConn(insertSql, [username, hashedPassword, role, email, phone, gender, birthday, 1]);

        res.status(201).json({
            status: "success",
            statusCode: 201,
            message: '注册成功,待审核'
        });
        // console.log(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '注册失败' + ': ' + error.message
        });
    }
});

module.exports = router;