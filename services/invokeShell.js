var callfile = require('child_process');
var log4js = require('log4js');
const logger4j = log4js.getLogger('蛋白质工程');
module.exports = function(path, params) {
    params = params ? params : null;
    return new Promise((resolve, reject) => {
        callfile.execFile(path, params, null, function(err, stdout, stderr) {
            if (err) {
                logger4j.error(err);
                console.log(err);
                reject(err);
            } else if (stderr) {
                console.log(stderr);
                logger4j.error(stderr);
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}