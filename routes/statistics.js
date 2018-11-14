var express = require('express');
var router = express.Router();
const log4js = require('log4js');
const logger4j = log4js.getLogger('数据统计');
const Protein = require('../object/protein');
require('../services/websocket')('statistics', ws => {
    const folderName = ws['_params_']['folderName'];
    const protein = new Protein(folderName);
    protein.getLineData().then(lineData => {
        protein.getScatterData().then(scatterData => {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({
                    command: 'init',
                    data: {
                        lineData: { code: 200, message: '', data: lineData },
                        scatterData: { data: scatterData, code: 200, message: '' }
                    }
                }));
            }
        });
    }).catch(err => {
        logger4j.error(err);
    });
});

router.get('/getLineData', function(req, res, next) {
    const folderName = req.query.folderName;
    const protein = new Protein(folderName);
    protein.getLineData().then(data => {
        res.send({
            code: 200,
            data: data,
            message: ''
        });
    }).catch(err => {
        res.send({
            code: 500,
            message: err.stack,
            data: ''
        });
    });
});
router.get('/getScatterData', function(req, res, next) {
    const folderName = req.query.folderName;
    new Protein(folderName).getScatterData().then(data => {
        res.send({
            code: 200,
            data: data,
            message: ''
        });
    }).catch(err => {
        res.send({
            code: 500,
            data: '',
            message: err.stack
        });
    });
});

module.exports = router;