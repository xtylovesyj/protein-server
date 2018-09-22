const WebSocket = require('ws');
const systemBaseInfo = require('./systemBaseInfo');
var log4js = require('log4js');
const logger4j = log4js.getLogger('websocket');
const wss = new WebSocket.Server({ port: 9090 });
const intervalMap = new Map();
const subjects = new Map();
logger4j.info('init websocket');
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        logger4j.info(`websocket has connected`);
    });
    sendSystemInfo();
    let interval = setInterval(() => {
        if (ws.readyState === 3) {
            clearInterval(intervalMap.get(ws));
            intervalMap.delete(ws);
        } else if (ws.readyState === 1) {
            sendSystemInfo();
        }
    }, 1000);
    intervalMap.set(ws, interval);

    function sendSystemInfo() {
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
    }
});

wss.on('close', function close() {
    console.log('disconnected');
});
module.exports = function(name, callback) {
    subjects.set(name, callback);
}