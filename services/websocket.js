const config = require('../config/config.base');
const WebSocket = require('ws');
var log4js = require('log4js');
const logger4j = log4js.getLogger('websocket');
const wss = new WebSocket.Server({ port: config.websocket_port });
const intervalMap = new Map();
const subjects = new Map();
const subjectNames = new Map();
const recycles = new Map();
logger4j.info('init websocket');
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        if (message['user']) {
            ws['user'] = message['user'];
        }
        if (message['params']) {
            ws['_params_'] = message['params'];
        } else if (ws['_params_']) {
            ws['_params_'] = Object.assign(ws['_params_'], message);
        } else {
            ws['_params_'] = message;
        }
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
    });
    let interval = setInterval(() => {
        if (ws.readyState === 3) {
            clearInterval(intervalMap.get(ws));
            intervalMap.delete(ws);
            subjectNames.delete(ws);
        } else if (ws.readyState === 1) {
            subjects.forEach((callbacks, key) => {
                if (recycles.get(key) && key === subjectNames.get(ws)) {
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

module.exports = function(name, callback, isRecycle) {
    if (subjects.has(name)) {
        const callbacks = subjects.get(name);
        callbacks.add(callback);
    } else {
        subjects.set(name, new Set().add(callback));
        if (isRecycle === undefined) {
            isRecycle = true;
        }
        recycles.set(name, isRecycle);
    }
};