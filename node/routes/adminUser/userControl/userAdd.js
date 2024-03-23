const express = require('express');
const bcrypt = require('bcrypt');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')

router.post('/userAdd', verToken, limiter(60, 10), async(req, res) => {
    const newUser = req.body; // 获取新用户信息对象

    try {
        if (newUser.adminRole !== "superAdmin" && newUser.adminRole !== "userAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        const existingUser = await sqlConn('SELECT * FROM users WHERE phone = ?', [newUser.phone]);

        if (existingUser.length > 0) {
            return res.status(409).json({
                status: "error",
                statusCode: 409,
                message: '手机号已存在'
            });
        }

        const password_hash = await bcrypt.hash(newUser.password, 10);
        // 在数据库中插入新用户信息
        const result = await sqlConn(
            'INSERT INTO users (username, password_hash, phone, email, full_name, gender, birthday,default_address, created_at, updated_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), ?)', [
                newUser.username,
                password_hash,
                newUser.phone,
                newUser.email,
                newUser.full_name,
                newUser.gender,
                newUser.birthday,
                newUser.defaultAddress,
                1
            ]
        );

        if (!result || result.affectedRows === 0) {
            return res.json({
                status: "error",
                statusCode: 500,
                message: '新用户添加失败'
            });
        }

        const sql = 'SELECT user_id FROM users WHERE phone = ?'
        const userId = await sqlConn(sql, [newUser.phone])

        // 返回新建用户的信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '新用户添加成功',
            data: userId
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '新用户添加失败' + ': ' + error.message
        });
    }
});

module.exports = router;