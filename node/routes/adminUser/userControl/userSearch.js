const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const dateO = require('../../../utils/dateOptimization')

router.get('/userSearch', verToken, limiter(60, 5), async(req, res) => {
    const searchKey = req.query.searchKey; // 获取用户输入的关键字
    try {

        if (!searchKey) {
            res.json({
                status: "success",
                statusCode: 400,
                message: '关键词不能为空'
            });
        }
        // 在数据库中查询用户信息
        const totalResultsBody = await sqlConn('SELECT COUNT(*) AS total FROM users WHERE username = ?', [searchKey]);
        const total = totalResultsBody[0].total;

        const limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        if (total === 0) {
            return res.json({
                status: "success",
                statusCode: 200,
                message: '没有找到匹配的用户',
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
        const result = await sqlConn('SELECT * FROM users WHERE username = ? LiMIT ? OFFSET ?', [searchKey, limit, offset]);

        result.forEach(element => {
            element.birthday = dateO(element.birthday)
            if (element.adress) {
                element.adress = element.adress.split(", ")
            }
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);
        });

        // 返回查询结果
        res.json({
            status: "success",
            statusCode: 200,
            message: '用户查询成功',
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
            message: '用户查询失败' + ': ' + error.message
        });
    }
});

module.exports = router;