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
    global.eventEmitter.on('errorTask', (data) => {
        if (ws.readyState === 1) {
            let errorDetails = fs.readFileSync(global.rootPath + `/log/${data}.log`);
            ws.send(JSON.stringify({
                command: 'errorTask',
                data: {
                    proteinName: data,
                    error: errorDetails.toString()
                }
            }));
        }
    });
}, false);

module.exports = router;