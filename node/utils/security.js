const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');

module.exports = function(app) {
    // 设置安全的HTTP头
    app.use(helmet());

    // 清洗用户输入数据，防止XSS攻击
    app.use(xssClean());

    // 应用请求频率限制，防止DDoS/暴力破解攻击
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15分钟
        max: 100, // 在15分钟内每个IP最多100次请求
        standardHeaders: true, // 返回标准化的速率限制头信息
        legacyHeaders: false, // 禁用非标准化的速率限制头信息
    });
    app.use(limiter);

    // 防止HTTP参数污染
    app.use(hpp());

    // 启用跨域资源共享
    app.use(cors());

    // 启用响应内容压缩
    app.use(compression());

    // 统一错误处理
    // app.use((err, req, res, next) => {
    //     console.error(err.stack);
    //     // 根据需要自定义错误状态码和消息
    //     const statusCode = err.statusCode || 500;
    //     const message = err.message || 'Internal Server Error';
    //     res.status(statusCode).json({
    //         status: 'error',
    //         statusCode,
    //         message
    //     });
    // });

    // 自定义响应头中间件（示例）
    app.use((req, res, next) => {
        // 设置自定义头部，例如防止点击劫持
        res.setHeader('X-Frame-Options', 'DENY');
        next();
    });
};