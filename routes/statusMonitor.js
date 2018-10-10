var express = require('express');
var router = express.Router();
var log4js = require('log4js');
const config = require('../config/config.base');
const logger4j = log4js.getLogger('状态监控');
const CacheData = require('../object/cacheData');
const readLastLines = require('read-last-lines');
const systemBaseInfo = require('../services/systemBaseInfo');
const addWebsocketTask = require('../services/websocket');
addWebsocketTask('statusMonitor', ws => {
    systemBaseInfo.getDisk().then(data => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                command: 'init',
                data: {
                    cpu: data.cpu,
                    memory: systemBaseInfo.getMemory(),
                    disk: data.disk
                }
            }));
        }
    });
});
addWebsocketTask('statusMonitor', ws => {
    const currentProtein = CacheData.getCurrentRunProtein();
    if (ws.readyState === 1) {
        const sendData = {
            name: currentProtein.getName(),
            startTime: currentProtein.getStartDate(),
            predictFinishTime: currentProtein.getCompletedTime(),
            iterationNum: currentProtein.getIterationNum(),
            finishedPercent: currentProtein.getFinishedPercent(),
        };
        ws.send(JSON.stringify({
            command: 'currentTask',
            data: sendData
        }));
    }
});
addWebsocketTask('statusMonitor', ws => {
    if (ws.readyState === 1) {
        let proteinLog = null;
        let appLog = null;
        (async function() {
            try {
                proteinLog = await readLastLines.read(`${config.protein_base_path}/${CacheData.getCurrentRunProtein().getName()}/outputFolder/log`, 100);
            } catch (error) {
                logger4j.error(error.stack);
                console.error(`${config.protein_base_path}/${CacheData.getCurrentRunProtein().getName()}/outputFolder/log ${error}`);
            }
            try {
                appLog = await readLastLines.read(global.rootPath + '/log/app.log', 100);
            } catch (error) {
                logger4j.error(error.stack);
                console.error(`${global.rootPath}/log/app.log ${error}`);
            }
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({
                    command: 'readLogs',
                    data: {
                        protein: proteinLog ? proteinLog : null,
                        app: appLog ? appLog : null
                    }
                }));
            }
        })();

    }
});
router.get('/readLog', function(req, res, next) {
    const folderName = req.query.folderName ? req.query.folderName : CacheData.getCurrentRunProtein().getName();
    readLastLines.read(`${config.protein_base_path}/${folderName}/outputFolder/log`, req.query.lineNum)
        .then(lines => {
            res.send({
                code: 200,
                message: '',
                data: lines
            });
        }).catch(error => {
            logger4j.error(error.stack);
            console.error(error);
            res.send({
                code: 500,
                message: error.stack,
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
            logger4j.error(error.stack);
            console.error(error);
            res.send({
                code: 500,
                message: error.stack,
                data: ''
            });
        });
});

router.get('/proteinStatus', (req, res, next) => {
    const currentProtein = CacheData.getCurrentRunProtein();
    let sendData = {
        name: currentProtein.getName(),
        startTime: currentProtein.getStartDate(),
        predictFinishTime: currentProtein.getCompletedTime(),
        iterationNum: currentProtein.getIterationNum(),
        finishedPercent: currentProtein.getFinishedPercent(),
    };
    res.send(sendData);
});



module.exports = router;