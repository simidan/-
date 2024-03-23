const express = require('express');
const { sqlConn } = require('../../database/index');
const router = express.Router();
const phoneCode = require('../../utils/phoneCode')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

// 登录路由
router.post('/checkToken', async(req, res) => {
    const token = req.body.token
    try {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: '无效token' });
            }

            res.json({
                status: "success",
                statusCode: 200,
                message: 'token检查无误',
                data: {
                    decoded
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            statusCode: 500,
            message: '登录失败' + ': ' + error.message
        });;
    }
});

module.exports = router;