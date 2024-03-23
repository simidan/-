const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const dateO = require('../../../utils/dateOptimization')

router.get('/businessSearch', verToken, limiter(60, 5), async(req, res) => {
    const searchKey = req.query.searchKey; // 获取商家输入的关键字
    try {
        if (req.body.adminRole !== "superAdmin" && req.body.adminRole !== "businessAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }
        if (!searchKey) {
            return res.json({
                status: "success",
                statusCode: 400,
                message: '关键词不能为空'
            });
        }

        const totalResults = await sqlConn('SELECT COUNT(*) AS total FROM business WHERE business_name = ?', [searchKey]);
        const total = totalResults[0].total;

        const limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        if (total === 0) {
            return res.json({
                status: "success",
                statusCode: 200,
                message: '没有找到匹配的商家',
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
        // 在数据库中查询商家信息
        const result = await sqlConn('SELECT * FROM business WHERE business_name = ? LIMIT ?, ?', [searchKey, offset, limit]);

        // const result = await sqlConn('SELECT * FROM business WHERE business_name LIKE ? OR business_id LIKE ? OR phone LIKE ? OR email LIKE ?', [`%${searchKey}%`, `%${searchKey}%`, `%${searchKey}%`, `%${searchKey}%`]);


        result.forEach(element => {
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);
        });

        if (!result || result.length === 0) {
            return res.json({
                status: "success",
                statusCode: 401,
                message: '查询失败'
            });
        }

        // 返回查询结果
        res.json({
            status: "success",
            statusCode: 200,
            message: '商家查询成功',
            data: result,
            pagination: {
                total: total,
                page: page,
                limit: limit,
                totalPages: totalPages
            }
        });
    } catch (error) {
        res.json({
            status: "error",
            statusCode: 500,
            message: '商家查询失败' + ': ' + error.message
        });
    }
});

module.exports = router;