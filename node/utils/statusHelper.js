function statusHelper(res, type, code, message, data = null) {
    const status = type === 's' ? 'success' : 'error';

    if (data) {
        res.json({
            status: status,
            statusCode: code,
            message: message,
            data
        });
    } else {
        res.json({
            status: status,
            statusCode: code,
            message
        });
    }
}

module.exports = statusHelper;