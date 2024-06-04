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
const security = require('./utils/security');
const statusHelper = require('./utils/statusHelper');

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
app.use(cors());

app.use(statusHelper);

// 设置路由
app.use('/GAPshop', router);

app.use(function(req, res, next) {
    next(createError(404));
});

// 错误处理程序
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = app;