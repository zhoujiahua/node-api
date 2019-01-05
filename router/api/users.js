//@login & register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passort = require("passport");
const keys = require("../../config/keys");
const gravatar = require("gravatar");
const User = require("../../models/User");

//$router GET api/users/test
//@desc 返回请求的JONS数据
//@access
router.get("/test", (req, res) => {
    res.json({
        msg: "login works"
    })
})

//$router post api/users/register
//@desc 返回请求的JONS数据
//@access
router.post("/register", (req, res) => {
    // console.log(req.body);
    //查询数据库中邮箱是否存在
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (user) {
                return res.status(400).json({
                    email: "当前邮箱已被注册！"
                })
            } else {
                //gravater 参数配置
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })
                //密码加密
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .then(err => console.log(err))
                    });
                });
            }
        })

})

//$router post api/users/login
//@desc 返回token jwt passort
//@access public

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //查询数据库
    User.findOne({
            email
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    email: "用户不存在！"
                })
            } else {
                //密码匹配
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            // jwt.sign("规则","加密名字",{过期时间},"箭头函数")
                            const rule = {id: user.id,name: user.name,avatar:user.avatar};
                            jwt.sign(rule,keys.secretOrKey, {expiresIn:3600}, (err, token) => {
                                if(err) throw err;
                                res.json({
                                    succes: true,
                                    token: "Bearer " + token
                                })
                            })

                            // res.json({msg: "success"});
                        } else {
                            return res.status(400).json({
                                password: "密码错误！"
                            });
                        }
                    })

            }
        })
})

//$router get api/users/current  token 请求验证
//@desc return current user
//@access private
router.get("/current",passort.authenticate("jwt",{session:false}),(req,res) => {
    // res.json({msg:"success"});
    // res.json(req.user);
    //配置返回信息
    res.json({
        name:req.user.name,
        email:req.user.email,
        avatar:req.user.avatar
    })
})

module.exports = router;