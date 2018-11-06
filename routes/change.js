const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/', checkNotLogin, function (req, res, next) {
    res.render('change')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
    var password = req.fields.password1
    const repassword = req.fields.repassword1
    const email = req.fields.email
    // 校验参数

    try {
        if (!email) {
            throw new Error('请填写姓名')
        }
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
        req.flash('success', '注册成功')
        // 跳转到首页
        res.redirect('/posts')
    })
    .catch(function (e) {
        req.flash('error', 'e.message')
        next(e)
    })

    // 校验参数
})

module.exports = router
