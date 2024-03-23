const rateLimit = require("express-rate-limit");

function limiter(time, max) {
    return rateLimit({
        windowMs: time * 1000,
        max: max,
        message: "请求过于频繁，请稍后再试"
    });
}

module.exports = limiter