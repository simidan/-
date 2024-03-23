const express = require('express');
const bcrypt = require('bcrypt');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const Joi = require('joi');

const adminSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    gender: Joi.number().required(),
    birthday: Joi.string().required(),
    adminRole: Joi.string().required(),
});

router.post('/adminAdd', verToken, limiter(60, 10), async(req, res) => {
    const newAdmin = req.body; // 获取新管理员信息对象

    try {
        await adminSchema.validateAsync(newAdmin);
        console.log(newAdmin.adminRole);

        if (newAdmin.adminRole !== "superAdmin") {
            return res.json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        const existingadmin = await sqlConn('SELECT * FROM admin_users WHERE username = ?', [newAdmin.username]);

        if (existingadmin.length > 0) {
            return res.status(409).json({
                status: "error",
                statusCode: 409,
                message: '账号已存在'
            });
        }

        const password_hash = await bcrypt.hash(newAdmin.password, 10);
        // 在数据库中插入新管理员信息
        const result = await sqlConn(
            'INSERT INTO admin_users (username, password, phone, email, role, gender, birthday, created_at, updated_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), ?)', [
                newAdmin.username,
                password_hash,
                newAdmin.phone,
                newAdmin.email,
                newAdmin.role,
                newAdmin.gender,
                newAdmin.birthday,
                2
            ]
        );

        if (!result || result.affectedRows === 0) {
            return res.status(500).json({
                status: "error",
                statusCode: 500,
                message: '新管理员添加失败'
            });
        }

        // 返回新建管理员的信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '新管理员添加成功',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '新管理员添加失败' + ': ' + error.message
        });
    }
});

module.exports = router;