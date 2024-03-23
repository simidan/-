const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const dateO = require('../../../utils/dateOptimization');
const path = require('path');

router.get('/userShow', verToken, async(req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        const totalResults = await sqlConn('SELECT COUNT(*) AS total FROM users');
        const total = totalResults[0].total;
        const totalPages = Math.ceil(total / limit);

        if (page < 1 || page > totalPages) {
            return res.status(400).json({
                status: "error",
                message: `请求的页码超出范围。有效页码范围为 1 到 ${totalPages}。`,
            });
        }

        const offset = (page - 1) * limit;
        const users = await sqlConn('SELECT * FROM users LIMIT ?, ?', [offset, limit]);

        if (!users || users.length === 0) {
            return res.json({
                status: "success",
                statusCode: 401,
                message: '查询失败'
            });
        }

        for (let element of users) {
            element.birthday = dateO(element.birthday);
            if (element.address) {
                element.address = element.address.split(", ");
            }
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);

            const avatarResult = await sqlConn('SELECT avatar FROM users WHERE user_id = ?', [element.user_id]);
            if (avatarResult && avatarResult.length > 0 && avatarResult[0].avatar) {
                // 修改路径以适用于静态资源
                let relativePath = avatarResult[0].avatar.replace(/\\/g, "/"); // 替换反斜杠为正斜杠
                element.avatar = `http://localhost:9000${relativePath}`; // 使用正确的路径
            } else {
                element.avatar = null;
            }
        }

        res.json({
            status: "success",
            statusCode: 200,
            message: "获取用户数据成功",
            data: users,
            pagination: {
                total: total,
                page: page,
                limit: limit,
                totalPages: totalPages
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "获取用户数据失败: " + error.message
        });
    }
});

module.exports = router;