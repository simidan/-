const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY; // 与生成token时的密钥保持一致

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // 在这里将解码后的userId提取出来
        if (decoded.userId) {
            req.body.userId = decoded.userId;
        }

        if (decoded.role) {
            req.body.adminRole = String(decoded.role)
        }

        next();
    });
}

module.exports = verifyToken;