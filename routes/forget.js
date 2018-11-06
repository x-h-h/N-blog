const express = require('express')
const router = express.Router()
const crypto = require('crypto')

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin


var _ = require('lodash');
var nodemailer = require("nodemailer");
var buf = crypto.randomBytes(8);

router.get('/', checkNotLogin, function (req, res, next) {
    res.render('forget')
})

// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport({
    host: "smtp.qq.com", // 主机
    //secureConnection: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
        user: "236718094@qq.com", // 账号
        pass: "yqlduohrdswecbae" // 密码
    }
});




// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
    const email = req.fields.email
    const verify = req.fields.verify
    const buffer = buf.toString('hex')

    // 校验参数
    try {
        if (!email.length) {
            throw new Error('请填写邮箱')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    UserModel.getUserByName(email)
        .then(function (user) {
            if (!user) {
                req.flash('error', '用户不存在')
                return res.redirect('back')
            }
            var defaultMail = {
                from: 'myblog <236718094@qq.com>',
                to: email,
                subject: '找回密码',
                text: buffer,
            };
            smtpTransport.sendMail(defaultMail,(error,info) =>{
                if(error){
                    console.log(error);
                }
            })
            try {
                if (verify != buffer) {
                    throw new Error('验证码错误')
                }
            } catch (e) {
                req.flash('error', e.message)
                return res.redirect('back')
            }
            // 跳转到主页
            req.flash('success', '验证码正确')
           // throw new Error('已发送，请返回首页')
            res.redirect('/change')
        })
        .catch(next)
    

})

module.exports = router


