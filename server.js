const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

//引入users.js
const users = require("./router/api/users");

//DB config
const db = require("./config/keys").mongooseURI;

//使用bodyParser 解析post请求数据                                                                                                            
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//连接mongoose 数据库
mongoose.connect(db)
    .then(() => {
        console.log("数据库连接成功！")
    })
    .catch(err => {
        console.log(err)
    })

//passport 初始化
app.use(passport.initialize());

require("./config/passport")(passport);


//测试
app.get("/", (req, res) => {
    res.send("Hello Node");
})


//使用router
app.use("/api/users", users);

//端口
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`正在监听端口：${port}`);
})