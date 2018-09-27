var express = require('express');
var router = express.Router();
const fs = require('fs');
var log4js = require('log4js');
const config = require('../config/config.base');
const logger4j = log4js.getLogger('状态监控');
const readLastLines = require('read-last-lines');
router.get('/readLog/:folderName', function(req, res, next) {
    readLastLines.read(`${config.protein_base_path}/${req.params.folderName}/outputFolder/log`, req.query.lineNum)
        .then(lines => {
            res.send({
                code: 200,
                message: '',
                data: lines.split('\n').reserve()
            });
        }).catch(error => {
            logger4j.error(error);
            console.error(error);
            res.send({
                code: 500,
                message: error,
                data: ''
            });
        });
});

router.get('/readAppLog', function(req, res, next) {
    readLastLines.read(global.rootPath + '/log/app.log', req.query.lineNum)
        .then(lines => {
            res.send({
                code: 200,
                message: '',
                data: lines
            });
        }).catch(error => {
            logger4j.error(error);
            console.error(error);
            res.send({
                code: 500,
                message: error,
                data: ''
            });
        });
});

router.get('/proteinStatus', (req, res, next) => {
    const runningProteinStatus = {
        name: 'yaojun',
        runningTime: '12:23:45',
        elapseTime: '15:02:23',
        iterationNum: 12,
        finishedPercent: 45
    };
    res.send(runningProteinStatus);
});



module.exports = router;