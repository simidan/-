const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const dateO = require('../../../utils/dateOptimization')

router.get('/adminShow', verToken, async(req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        // 获取总数据量
        const totalResults = await sqlConn('SELECT COUNT(*) AS total FROM admin_users');
        const total = totalResults[0].total;
        const totalPages = Math.ceil(total / limit);

        // 如果请求的页码小于1或超出了总页数
        if (page < 1 || page > totalPages) {
            return res.status(400).json({
                status: "error",
                message: `请求的页码超出范围。有效页码范围为 1 到 ${totalPages}。`,
            });
        }

        const offset = (page - 1) * limit;
        // 从数据库中查询管理员数据
        const admin = await sqlConn('SELECT * FROM admin_users LIMIT ? OFFSET ?', [limit, offset]);

        admin.forEach(element => {
            element.birthday = dateO(element.birthday)
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);
        });

        // 返回管理员数据
        res.json({
            status: "success",
            statusCode: 200,
            message: "获取管理员数据成功",
            data: admin,
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
            message: "获取管理员数据失败" + ": " + error.message
        });
    }
});

module.exports = router;