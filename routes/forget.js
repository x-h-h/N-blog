const express = require('express')
const router = express.Router()
const crypto = require('crypto')

const UserModel = require('../models/users')
const Random = require('../models/random')
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
    //const verify = req.fields.verify
    const buffer = buf.toString('hex')
    if (Random.getRandom(email)) {
        Random.delRandom(email)
    }
    // 校验参数
    try {
        if (!email.length) {
            throw new Error('请填写邮箱')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }
    var link = 'http://localhost:3000/change/'+buffer
    let ran = {
        email: email,
        random: buffer
    }
    req.session.ran = ran

    
    UserModel.getUserByName(email)
        .then(function (user) {
            if (!user) {
                req.flash('error', '用户不存在')
                return res.redirect('back')
            }
            if(Random.getRandom(email)){
                req.flash('success', '已发送验证邮件')
            }
            //req.flash('success', '已发送验证码')
            let ran = {
                email: email,
                random: buffer
            }
            req.session.ran = ran
            Random.createRandom(ran)
            var defaultMail = {
                from: 'myblog <236718094@qq.com>',
                to: email,
                subject: '找回密码',
                html: '请点击 <a href="' + link + '">此处</a> 修改密码。'
                //text: '验证码'+buffer
            };
            smtpTransport.sendMail(defaultMail,(error,info) =>{
                if(error){
                    console.log(error);
                } 
            })
            res.redirect('/posts')
        })
        .catch(next)
    

})

module.exports = router


