const express = require('express');
const { sqlConn } = require('../../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

// 登录路由
router.post('/login', async(req, res) => {
    const { phone, password } = req.body;
    const sql = 'SELECT * FROM users WHERE phone = ?';
    const params = [phone];
    const secretKey = process.env.SECRET_KEY;

    try {
        const results = await sqlConn(sql, params);
        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                if (user.status === 1) {
                    user.birthday = new Date(user.birthday).toISOString().split('T')[0];

                    const avatarResult = user.avatar.replace(/\\/g, "/")
                    user.avatar = `http://localhost:9000${avatarResult}`

                    const userInfo = {
                        user_id: user.user_id,
                        username: user.username,
                        phone: user.phone,
                        email: user.email,
                        full_name: user.full_name,
                        avatar: user.avatar,
                        ender: user.gender,
                        birthday: user.birthday,
                        defaultAddress: user.default_address
                    };

                    const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: '3d' });

                    res.json({
                        status: "success",
                        statusCode: 200,
                        data: {
                            token,
                            userMessage: userInfo
                        }
                    });
                } else {
                    res.json({
                        status: "success",
                        statusCode: 401,
                        message: '账号已禁用'
                    });
                }
            } else {
                res.json({
                    status: "error",
                    statusCode: 403,
                    message: '密码错误'
                });
            }
        } else {
            res.status(404).json({
                status: "error",
                statusCode: 404,
                message: '用户不存在'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '数据库出错: ' + error.message
        });
    }
});

module.exports = router;