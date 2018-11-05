// ///home/just/Desktop/mail.js

var _ = require('lodash'); 
var nodemailer = require("nodemailer");


// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport( {
  host: "smtp.qq.com", // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: "236718094@qq.com", // 账号
    pass: "xdufwwnbacorcaca" // 密码
  }
});

var defaultMail = {
    from: 'TMY Blog <236718094@qq.com>',
    text: 'test text',
};

module.exports = function(mail){
    // 应用默认配置
    mail = _.merge({}, defaultMail, mail);


// 发送邮件
smtpTransport.sendMail(mail, function(error, info){
  if(error){
    console.log(error);
  }else{
    console.log("Message sent: ", info.response);
  }
  smtpTransport.close(); // 如果没用，关闭连接池
});}


