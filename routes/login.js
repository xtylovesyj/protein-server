var express = require('express');
var router = express.Router();
const config = require('../config/config.base');
const users = new Map();
config.users.forEach((value) => {
    users.set(value['name'], value['pass']);
});
router.post('/', (req, res, next) => {
    const body = req.body;
    if (users.has(body.username) && body.password === users.get(body.username)) {
        req.session.user = body.username;
        res.send({
            code: 200,
            message: '',
            data: body.username
        });
    } else {
        res.send({
            code: 401,
            message: '用户名或密码错误',
            data: ''
        });
    }
});
module.exports = router;