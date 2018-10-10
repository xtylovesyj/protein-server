const WebSocket = require('ws');
var log4js = require('log4js');
const logger4j = log4js.getLogger('websocket');
const wss = new WebSocket.Server({ port: 9090 });
const intervalMap = new Map();
const subjects = new Map();
const subjectNames = new Map();
logger4j.info('init websocket');
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        const command = message['command'];
        if (command && !subjectNames.has(ws)) {
            subjectNames.set(ws, command);
        }
        subjects.forEach((callbacks, key) => {
            if (key === subjectNames.get(ws)) {
                callbacks.forEach(callback => {
                    callback(ws, wss);
                });
            }
        });
        logger4j.info(`websocket has connected`);
    });
    let interval = setInterval(() => {
        if (ws.readyState === 3) {
            clearInterval(intervalMap.get(ws));
            intervalMap.delete(ws);
            subjectNames.delete(ws);
        } else if (ws.readyState === 1) {
            subjects.forEach((callbacks, key) => {
                if (key === subjectNames.get(ws)) {
                    callbacks.forEach(callback => {
                        callback(ws, wss);
                    });
                }
            });
        }
    }, 5000);
    intervalMap.set(ws, interval);
});

wss.on('close', function close() {
    console.log('disconnected');
});

module.exports = function(name, callback) {
    if (subjects.has(name)) {
        const callbacks = subjects.get(name);
        callbacks.add(callback);
    } else {
        subjects.set(name, new Set().add(callback));
    }
};