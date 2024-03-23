const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const dateO = require('../../../utils/dateOptimization')

router.get('/businessShow', verToken, async(req, res) => {
    try {
        const limit = parseInt(req.body.limit) || 10;
        let page = parseInt(req.body.page) || 1;

        // 获取总数据量
        const totalResults = await sqlConn('SELECT COUNT(*) AS total FROM business');
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
        // 从数据库中查询商家数据
        const business = await sqlConn('SELECT * FROM business LIMIT ?, ?', [offset, limit]);

        for (let element of business) {
            element.created_at = dateO(element.created_at);
            element.updated_at = dateO(element.updated_at);

            const avatarResult = await sqlConn('SELECT image FROM business WHERE business_id = ?', [element.business_id]);
            if (avatarResult && avatarResult.length > 0 && avatarResult[0].image) {
                // 修改路径以适用于静态资源
                let relativePath = avatarResult[0].image.replace(/\\/g, "/"); // 替换反斜杠为正斜杠
                element.image = `http://localhost:9000${relativePath}`; // 使用正确的路径
                console.log(element.image);
            } else {
                element.image = null;
            }
        }

        if (!business || business.affectedRows === 0) {
            res.json({
                status: "error",
                statusCode: 401,
                message: '查询失败'
            });
        }
        // 返回商家数据
        res.json({
            status: "success",
            statusCode: 200,
            message: "获取商家数据成功",
            data: business,
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
            message: "获取商家数据失败" + ": " + error.message
        });
    }
});

module.exports = router;