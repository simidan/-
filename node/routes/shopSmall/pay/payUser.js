const express = require('express');
const router = express.Router();
const { sqlConn } = require('../../../database/index')
const verToken = require('../../../utils/verifyToken');
const qrcode = require('../../../utils/QRCode');
const statusHelper = require('../../../utils/statusHelper');
const limit = require('../../../utils/limiter')

// 根据商品信息、用户信息和支付方式生成支付二维码接口
router.post('/payUser', verToken, limit(60, 5), async(req, res) => {
    const url = req.body.url

    if (!url) {
        return statusHelper(res, 'e', 400, "缺少必要参数")
    }

    try {
        const qrCodeURL = await qrcode(url)

        return statusHelper(res, 's', 200, "支付二维码生成成功", qrCodeURL)
    } catch (error) {
        return statusHelper(res, 'e', 500, "处理请求时出错: " + error.message)
    }
});

module.exports = router;