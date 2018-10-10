var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: '459828686@qq.com',
        pass: 'obbbbmmmpdvxbibd' //授权码,通过QQ获取

    }
});
const sendEmail = {
    send(fromUser, toUser, content) {
        var mailOptions = {
            from: fromUser,
            to: toUser,
            subject: '警告！！！',
            html: `<h2>${content}</h2><h3>
                  <a href="http://35.201.142.215/">
                      Monitor</a></h3>`
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve('send successfully');
            });
        });
    }
}
module.exports = sendEmail;