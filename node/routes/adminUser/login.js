const express = require('express');
const { sqlConn } = require('../../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const phoneCode = require('../../utils/phoneCode')
require('dotenv').config();

// 登录路由
router.post('/login', async(req, res) => {
    const { username, password, phone } = req.body;
    const sql = 'SELECT * FROM admin_users WHERE username = ?';
    const params = [username];

    const secretKey = process.env.SECRET_KEY;

    try {
        // const test = await phoneCode(phone)

        // console.log(test.sms);

        const results = await sqlConn(sql, params);
        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                if (user.status === 2) {
                    user.birthday = new Date(user.birthday).toISOString().split('T')[0];
                    const userInfo = {
                        adminId: user.admin_id,
                        userName: user.username,
                        role: user.role,
                        userPhone: user.phone,
                        userEmail: user.email,
                        userGender: user.gender,
                        userBirthday: user.birthday
                    }; // 用户信息


                    const token = jwt.sign(userInfo, secretKey, { expiresIn: '3d' }); // 生成 JWT token，有效期为3天
                    res.json({
                        status: "success",
                        statusCode: 200,
                        data: {
                            token,
                            userInfo
                        }
                    });
                } else if (user.status === 1) {
                    res.json({
                        status: "success",
                        statusCode: 401,
                        message: '账号审核中'
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
                    statusCode: 401,
                    message: '密码错误'
                });
            }
        } else {
            res.json({
                status: "error",
                statusCode: 404,
                message: '用户不存在'
            });;
        }
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: '登录失败' + ': ' + error.message
        });;
    }
});

module.exports = router;