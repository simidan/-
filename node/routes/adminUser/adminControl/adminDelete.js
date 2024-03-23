const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const limiter = require('../../../utils/limiter');

router.delete('/adminDelete/:id', verToken, limiter(60, 5), async(req, res) => {
    const adminId = req.params.id; // 获取要删除的管理员 ID

    try {
        if (req.body.adminRole !== "superAdmin") {
            return res.json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        // 在数据库中删除管理员信息
        const result = await sqlConn('DELETE FROM admin_users WHERE admin_id = ?', [adminId]);

        if (!result || result.affectedRows === 0) {
            res.json({
                status: "error",
                statusCode: 500,
                message: '管理员删除失败',
            });
        }

        // 返回删除成功的信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '管理员删除成功',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '管理员删除失败' + ': ' + error.message
        });
    }
});

module.exports = router;