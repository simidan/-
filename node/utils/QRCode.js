const QRCode = require('qrcode');

// 函数用于生成二维码并以数据URL的形式返回
function generateQRCodeDataUrl(url) {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(url, { errorCorrectionLevel: 'H' }, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
}

module.exports = generateQRCodeDataUrl