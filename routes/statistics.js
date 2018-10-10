var express = require('express');
var router = express.Router();
const log4js = require('log4js');
const CacheData = require('../object/cacheData');
const fs = require('fs');
const logger4j = log4js.getLogger('数据统计');
const config = require('../config/config.base');
require('../services/websocket')('statistics', ws => {
    const protein = CacheData.getCurrentRunProtein();
    protein.getProteinProgressData().then(data => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                command: 'init',
                data: data
            }));
        }
    }).catch(error => {
        logger4j.error(error);
    });
});


router.get('/getData', function(req, res, next) {
    const folderName = req.query.folderName ? req.query.folderName : CacheData.getCurrentRunProtein().getName();
    fs.readFile(`${config.protein_base_path}/${folderName}/outputFolder/decoy_Rmsd_Energy`, function(err, data) {
        if (err) {
            res.send({
                code: 500,
                message: err,
                data: ''
            });
            console.error(err);
        } else {
            res.send({
                code: 200,
                message: '',
                data: data.toString()
            });
        }
    });

});

module.exports = router;