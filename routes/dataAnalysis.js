var express = require('express');
var router = express.Router();
const fs = require('fs');
router.get('/readFile', function(req, res, next) {
    // 异步读取
    fs.readFile(global.rootPath + '/public/1E2A_A.pdb', function(err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.toString());
    });
});

router.get('/readFile2', function(req, res, next) {
    // 异步读取
    fs.readFile(global.rootPath + '/public/1B4B_A.pdb', function(err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.toString());
    });
});

module.exports = router;