const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const Random = require('../models/random')
const checkNotLogin = require('../middlewares/check').checkNotLogin

global.userid;
router.param(function (param, option) {
    return function (req, res, next, val) {
        //global.userid = 'abc'
        if (val == req.session.ran.random) {
            next();
        }
        else {
            res.sendStatus(403);
        }
    }
});

router.param('id', global.userid);

router.get('/:id', checkNotLogin, function (req, res, next) {
    res.render('change')
})


router.post('/:id', checkNotLogin, function (req, res, next) {
    var password = req.fields.password1
    const repassword = req.fields.repassword1
    const email = req.session.ran.email
    // 校验参数

    try {
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符')
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }
    password = sha1(password)
    UserModel.update(email,password)
    .then(function (result) {
        // 写入 flash
        req.flash('success', '修改成功')
        // 跳转到首页
        res.redirect('/posts')
        Random.delRandom(email)
        req.session.ran = null
    })
    .catch(function (e) {
        req.flash('error', 'e.message')
        next(e)
    })

    //Random.delRandom(email)
})

module.exports = router
