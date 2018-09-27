var express = require('express');
var router = express.Router();
const fs = require('fs');
var log4js = require('log4js');
const config = require('../config/config.base');
const logger4j = log4js.getLogger('数据统计');
router.get('/rmsdEnergyData', function(req, res, next) {
    // 异步读取
    fs.readFile(`${config.protein_base_path}/${req.params.folderName}/outputFolder/decoy_Rmsd_Energy`, function(err, data) {
        if (err) {
            res.send({
                code: 500,
                message: err,
                data: ''
            });
            return console.error(err);
        }
        res.send({
            code: 200,
            message: '',
            data: data.toString()
        });
    });
});

module.exports = router;