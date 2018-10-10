var diskspace = require('diskspace');
const os = require('os');
var osu = require('os-utils');


const systemBaseInfo = {
    getCpu: async function() {
        let results = await new Promise((resolve, reject) => {
            osu.cpuUsage(function(v) {
                resolve(v);
            });
        });
        return results;
    },
    getMemory: function() {
        return {
            total: os.totalmem() / 1024 / 1024 / 1024,
            free: os.freemem() / 1024 / 1024 / 1024,
        }
    },
    getDisk: async function() {
        let results = await new Promise((resolve, reject) => {
            diskspace.check('/', function(err, result) {
                resolve({
                    total: result.total / 1024 / 1024 / 1024,
                    free: result.free / 1024 / 1024 / 1024
                });
            });
        });
        let cpuUsage = await this.getCpu();

        return {
            cpu: {
                usage: cpuUsage,
                cpuNumber: osu.cpuCount(),
                platformName: osu.platform()
            },
            disk: results
        };
    }
}

module.exports = systemBaseInfo;