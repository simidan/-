// 引入必要的库和中间件
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
require('dotenv').config();

// 自定义的中间件和工具
const security = require('./utils/security'); // 假设这是你的安全设置，例如HTTP头设置等
const statusHelper = require('./utils/statusHelper'); // 假设这是一些状态或响应相关的工具函数

// 路由模块
const router = require('./routes/index');

// 初始化Express应用
var app = express();

// 安全相关设置
security(app);

// 设置视图引擎和视图文件路径
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 使用中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // 允许所有域名访问
// app.set('trust proxy', true); // 如果应用在代理后面，请正确配置此项

// 设置session
app.use(session({
    store: new FileStore({ path: './sessions' }), // 使用文件存储session
    secret: process.env.SECRET_KEY, // 使用环境变量中的密钥
    resave: false,
    saveUninitialized: true
}));

// 应用自定义中间件
app.use(statusHelper);

// 设置路由
app.use('/GAPshop', router);

// 捕获404错误并转发到错误处理程序
app.use(function(req, res, next) {
    next(createError(404));
});

// 错误处理程序
app.use(function(err, req, res, next) {
    // 设置本地变量，只提供开发环境中的错误
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // 渲染错误页面
    res.status(err.status || 500);
    res.render('error');
});

// 导出Express应用实例，以便其他文件可以使用
module.exports = app;