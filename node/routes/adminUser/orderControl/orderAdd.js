const express = require('express');
const { sqlConn } = require('../../../database/index');
const router = express.Router();
const verToken = require('../../../utils/verifyToken');
const limiter = require('../../../utils/limiter');
const Joi = require('joi');

const orderSchema = Joi.object({
    user_id: Joi.number().required(),
    product_id: Joi.number().required(),
    quantity: Joi.number().min(1).required(), // 确保数量至少为1
    status: Joi.string().valid('pending', 'processing', 'completed').required(),
    payment_method: Joi.string().valid('credit_card', 'paypal', 'wechat_pay').required(),
    payment_status: Joi.string().valid('paid', 'unpaid').required(),
    shipping_address: Joi.string().required(),
    role: Joi.string(),
    adminRole: Joi.string().required(),
});

router.post('/orderAdd', verToken, limiter(60, 10), async(req, res) => {
    const newOrder = req.body; // 获取新订单信息对象

    try {
        await orderSchema.validateAsync(newOrder);

        if (newOrder.adminRole !== "superAdmin" && newOrder.adminRole !== "orderAdmin") {
            return res.status(404).json({
                status: "error",
                statusCode: 405,
                message: '你没有操作权限'
            });
        }

        // 从users表中获取用户名和电话
        const userResult = await sqlConn('SELECT username, phone FROM users WHERE user_id = ?', [newOrder.user_id]);
        if (userResult.length === 0) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: '用户未找到'
            });
        }
        const { username, phone } = userResult[0];

        // 从products表中获取business_id和价格
        const productResult = await sqlConn('SELECT business_id, price FROM products WHERE product_id = ?', [newOrder.product_id]);
        if (productResult.length === 0) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: '产品未找到'
            });
        }
        const { business_id, price } = productResult[0];

        // 计算总金额
        const totalAmount = price * newOrder.quantity;

        // 在数据库中插入新订单信息
        const result = await sqlConn(
            'INSERT INTO orders (user_id, business_id, product_id, quantity, total_amount, status, payment_method, payment_status, shipping_name, shipping_phone, shipping_address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())', [
                newOrder.user_id,
                business_id, // 使用查找到的business_id
                newOrder.product_id,
                newOrder.quantity, // 添加购买数量
                totalAmount, // 使用计算得到的总金额
                newOrder.status,
                newOrder.payment_method,
                newOrder.payment_status,
                username, // 使用查找到的username
                phone, // 使用查找到的phone
                newOrder.shipping_address
            ]
        );

        if (!result || result.affectedRows === 0) {
            return res.status(500).json({
                status: "error",
                statusCode: 500,
                message: '新订单添加失败'
            });
        }

        // 返回新建订单的信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '新订单添加成功',
            orderId: result.insertId // 返回新创建的订单ID
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '新订单添加失败' + ': ' + error.message
        });
    }
});

module.exports = router;