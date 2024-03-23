const express = require('express');
const bcrypt = require('bcrypt');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken')
const limiter = require('../../../utils/limiter')
const Joi = require('joi');

const productSchema = Joi.object({
    sub_category_id: Joi.number().required(),
    business_id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    unit: Joi.string().required(),
    stock_quantity: Joi.number().required(),
    description: Joi.string().required(),
    origin: Joi.string().required(),
    harvest_date: Joi.string().required(),
    shelf_life: Joi.number().required(),
    certification: Joi.string().required(),
    season: Joi.string().required(),
    safety_standards: Joi.string().required(),
    storage_conditions: Joi.string().required(),
    grade: Joi.string().required(),
    role: Joi.string(),
    adminRole: Joi.string().required(),
});

router.post('/productAdd', verToken, limiter(60, 10), async(req, res) => {
    const newProduct = req.body; // 获取新商品信息对象

    try {
        await productSchema.validateAsync(newProduct);

        if (newProduct.adminRole !== "superAdmin" && newProduct.adminRole !== "productAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        // 在数据库中插入新商品信息，并将 product 表中的信息写入商品表中对应字段
        const result = await sqlConn(
            'INSERT INTO products (sub_category_id, business_id, name, price, unit, stock_quantity, description, origin, harvest_date, shelf_life, certification, season, safety_standards, storage_conditions, grade, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())', [
                newProduct.sub_category_id,
                newProduct.business_id,
                newProduct.name,
                newProduct.price,
                newProduct.unit,
                newProduct.stock_quantity,
                newProduct.description,
                newProduct.origin,
                newProduct.harvest_date,
                newProduct.shelf_life,
                newProduct.certification,
                newProduct.season,
                newProduct.safety_standards,
                newProduct.storage_conditions,
                newProduct.grade,
                1
            ]
        );

        if (!result || result.affectedRows === 0) {
            return res.status(500).json({
                status: "error",
                statusCode: 500,
                message: '新商品添加失败'
            });
        }

        // 返回新建商品的信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '新商品添加成功',
            data: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '新商品添加失败' + ': ' + error.message
        });
    }
});

module.exports = router;