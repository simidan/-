const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const dateO = require('../../../utils/dateOptimization')

router.get('/adminAudit', verToken, limiter(60, 5), async(req, res) => {
    try {
        console.log(req.body.adminRole);
        if (req.body.adminRole !== "superAdmin") {
            return res.json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        const totalResultsBody = `SELECT COUNT(*) AS total FROM admin_users WHERE status = 1`;
        const totalResults = await sqlConn(totalResultsBody);
        const total = totalResults[0].total;

        const limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        if (total === 0) {
            return res.json({
                status: "success",
                statusCode: 200,
                message: '没有找到匹配的管理员',
                data: []
            });
        }

        const totalPages = Math.ceil(total / limit);

        if (page < 1 || page > totalPages) {
            return res.status(400).json({
                status: "error",
                message: `请求的页码超出范围。有效页码范围为 1 到 ${totalPages}。`,
            });
        }

        const offset = (page - 1) * limit;

        // 在数据库中查询待审核管理员信息
        const result = await sqlConn('SELECT * FROM admin_users WHERE status = 1 LIMIT ? OFFSET ?', [limit, offset]);

        result.forEach(element => {
            element.birthday = dateO(element.birthday)
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);
        });

        if (!result || result.affectedRows === 0) {
            res.json({
                status: "error",
                statusCode: 401,
                message: '查询失败'
            });
        }

        // 返回查询结果
        res.json({
            status: "success",
            statusCode: 200,
            message: '管理员查询成功',
            data: result,
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
            message: '管理员查询失败' + ': ' + error.message
        });
    }
});

module.exports = router;