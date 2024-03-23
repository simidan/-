const express = require('express');
const bcrypt = require('bcrypt');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const Joi = require('joi');

const businessSchema = Joi.object({
    businessName: Joi.string().required(),
    password: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string(),
    adminRole: Joi.string().required(),
});

router.post('/businessAdd', verToken, limiter(60, 10), async(req, res) => {
    const newBusiness = req.body; // 获取新商家信息对象

    try {
        await businessSchema.validateAsync(newBusiness);

        if (newBusiness.adminRole !== "superAdmin" && newBusiness.adminRole !== "businessAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        const existingBusiness = await sqlConn('SELECT * FROM business WHERE business_name = ?', [newBusiness.businessName]);

        if (existingBusiness.length > 0) {
            return res.status(409).json({
                status: "error",
                statusCode: 409,
                message: '账号已存在'
            });
        }

        const password_hash = await bcrypt.hash(newBusiness.password, 10);
        // 在数据库中插入新商家信息
        const result = await sqlConn(
            'INSERT INTO business (business_name, password, address, phone, email, created_at, updated_at, status) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), ?)', [
                newBusiness.businessName,
                password_hash,
                newBusiness.address,
                newBusiness.phone,
                newBusiness.email,
                2
            ]
        );

        if (!result || result.affectedRows === 0) {
            return res.json({
                status: "error",
                statusCode: 409,
                message: '新商家添加失败'
            });
        }

        const sql = 'SELECT business_id FROM business WHERE business_name = ?'
        const businessId = await sqlConn(sql, [newBusiness.businessName])

        // 返回新建商家的信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '新商家添加成功',
            data: businessId
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '新商家添加失败' + ': ' + error.message
        });
    }
});

module.exports = router;