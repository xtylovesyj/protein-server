const systemBaseInfo = require('./systemBaseInfo');
const email = require('./sendEmail');
var log4js = require('log4js');
const THRESHOLD_CPU_VALUE = 5;
const THRESHOLD_DISK_VALUE = 95;
const THRESHOLD_MEMORY_VALUE = 95;
const DELAY_TIME = 300;
let times = 0;

const logger4j = log4js.getLogger('app');
(function sendEmail() {
    setTimeout(() => {
        systemBaseInfo.getDisk().then(data => {
            const memoryObject = systemBaseInfo.getMemory();
            const cpu = +(data.cpu.usage * 100).toFixed();
            const disk = +((1 - data.disk.free / data.disk.total) * 100).toFixed();
            const memory = +((1 - memoryObject.free / memoryObject.total) * 100).toFixed();
            if (cpu < THRESHOLD_CPU_VALUE) {
                times++;
                if (times > DELAY_TIME) {
                    logger4j.info('before send email from cpu');
                    email.send('459828686@qq.com', 'xtylovesyj@gmail.com', '程序已结束或已崩溃!!!').then(data => {
                        times = 0;
                        logger4j.info('successfully to send email from cpu');
                    });
                }
            } else {
                times = 0;
            }
            // if (disk > THRESHOLD_DISK_VALUE) {
            //     logger4j.info('before send email from disk');
            //     email.send('459828686@qq.com', 'xtylovesyj@gmail.com', '磁盘已满!!!').then(data => {
            //         logger4j.info('successfully to send email from disk');
            //     });
            // }
            // if (memory > THRESHOLD_MEMORY_VALUE) {
            //     logger4j.info('before send email from memory');
            //     email.send('459828686@qq.com', 'xtylovesyj@gmail.com', '内存不足!!!').then(data => {
            //         logger4j.info('successfully to send email from memory');
            //     });
            // }
            arguments.callee();
        });
    }, 1000);
})();
logger4j.info('start to monitor sending email');