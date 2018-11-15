var express = require('express');
var router = express.Router();
const addWebsocketTask = require('../services/websocket');
const fs = require('fs');
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
global.eventEmitter = eventEmitter;

addWebsocketTask('home', ws => {
    global.eventEmitter.on('errorTask', (err) => {
        if (ws.readyState === 1) {
            let errorDetails = fs.readFileSync(global.rootPath + '/log/task-error.log');
            let errorDetailArray = errorDetails.toString().split('\n');
            let proteinName = errorDetailArray[0];
            ws.send(JSON.stringify({
                command: 'errorTask',
                data: {
                    proteinName: proteinName,
                    error: errorDetails.toString()
                }
            }));
        }
    });
}, false);

module.exports = router;