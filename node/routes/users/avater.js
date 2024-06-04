const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sqlConn } = require('../../database/index');
const router = express.Router();
const verToken = require('../../utils/verifyToken')
const limiter = require('../../utils/limiter')

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 设置 Multer 存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // 使用之前确保的上传路径
    },
    filename: (req, file, cb) => {
        // 将保存文件名设置为 字段名 + 时间戳，比如 avatar-1478521468943
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 通过 storage 选项来对上传行为进行定制化
const upload = multer({ storage: storage });

router.post('/avatarUpdate/:id', (req, res, next) => {
    console.log("Received request for user ID:", req.params.id);
    next();
}, verToken, limiter(60, 5), upload.single('file'), async(req, res) => {
    const userId = req.params.id;
    const file = req.file;

    if (!file) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: '请上传头像文件'
        });
    }

    // 获取旧头像文件路径
    let oldAvatarPath;
    try {
        const userResult = await sqlConn('SELECT avatar FROM users WHERE user_id = ?', [userId]);
        if (userResult.length > 0) {
            oldAvatarPath = userResult[0].avatar;
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '获取旧头像失败: ' + error.message
        });
    }

    // 根据实际情况调整路径
    const newFilePath = path.join('/images', file.filename);

    try {
        // 在数据库中更新用户头像的文件路径
        const result = await sqlConn('UPDATE users SET avatar = ? WHERE user_id = ?', [newFilePath, userId]);

        if (!result || result.affectedRows === 0) {
            return res.json({
                status: "error",
                statusCode: 404,
                message: '用户不存在'
            });
        }

        // 删除旧头像文件，如果存在
        if (oldAvatarPath) {
            const oldFilePath = path.join(__dirname, '../../public/images', oldAvatarPath);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // 返回更新后的用户信息
        res.json({
            status: "success",
            statusCode: 200,
            message: '头像更新成功',
            filePath: newFilePath // 返回文件的实际访问URL或路径供前端使用
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: '头像更新失败: ' + error.message
        });
    }
});



module.exports = router;