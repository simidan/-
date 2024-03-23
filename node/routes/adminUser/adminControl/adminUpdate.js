const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const bcrypt = require('bcrypt');

router.put('/adminUpdate/:id', verToken, limiter(60, 5), async(req, res) => {
    const adminId = req.params.id;
    const updatedAdmin = req.body; // 获取管理员信息对象

    try {
        if (updatedAdmin.adminRole !== "superAdmin") {
            return res.json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        if (updatedAdmin.password.length < 6 || updatedAdmin.password.length > 15) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: '请输入长度在6到15位之间的密码'
            });
        }

        const hashedPassword = await bcrypt.hash(updatedAdmin.password, 10);
        // 在数据库中查找并更新管理员信息
        const result = await sqlConn(
            'UPDATE admin_users SET username = ?, password = ?, phone = ?, email = ?, role = ?, gender = ?, birthday = ?, updated_at = CURRENT_TIMESTAMP() WHERE admin_id = ?', [
                updatedAdmin.username,
                hashedPassword,
                updatedAdmin.phone,
                updatedAdmin.email,
                updatedAdmin.role,
                updatedAdmin.gender,
                updatedAdmin.birthday,
                adminId
            ]
        );

        if (!result || result.affectedRows === 0) {
            return res.json({
                status: "error",
                statusCode: 404,
                message: '管理员不存在'
            });
        }

        // 返回更新后的管理员信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '管理员信息修改成功'
        });
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: '管理员消息修改失败' + ': ' + error.message
        });
    }
});

module.exports = router;