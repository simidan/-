// phoneCode.js
function phoneCode(phoneNumbers) {
    const SMSClient = require('@alicloud/sms-sdk');

    let accessKeyId = "LTAI5tMASwzLHehNQMd9ow3A";
    let secretAccessKey = "WYPJrTP4obYCKimD4azU5ViQnNldym";
    let signName = "阿里云短信测试";
    let templateCode = "SMS_154950909";

    const smsClient = new SMSClient({ accessKeyId, secretAccessKey });
    let smsCode = Math.random().toString().slice(-6);
    console.log("smsCode:", smsCode);

    // 返回Promise
    return smsClient.sendSMS({
        PhoneNumbers: phoneNumbers,
        SignName: signName,
        TemplateCode: templateCode,
        TemplateParam: `{"code":'${smsCode}'}`,
    }).then(result => {
        let { Code } = result;
        if (Code == 'OK') {
            // 成功发送短信
            return {
                code: 0,
                msg: 'success',
                sms: smsCode
            };
        } else {
            // 短信服务返回非OK状态
            return Promise.reject(new Error('SMS service error'));
        }
    }).catch(err => {
        console.log("报错：", err);
        return {
            code: 1,
            msg: 'fail: ' + err.data.Message
        };
    });
}

module.exports = phoneCode;