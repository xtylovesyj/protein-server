const fs = require('fs');
const config = require('../config/config.base');
module.exports = {
    readStatusFile: function(folderName) {
        let status = fs.readFileSync(`${config.protein_base_path}/${folderName}/outputFolder/${config.status}`);
        status = status.toString().split('\n');
        let startTime = new Date(status[0]);
        let currentIterations = +status[1];
        let totalIterations = +status[2] ? +status[2] : 'unknow';
        let predictFinishTime = (new Date().getTime() - startTime.getTime()) * totalIterations / currentIterations + new Date().getTime();
        let sendData = {
            name: folderName,
            startTime: startTime,
            predictFinishTime: new Date(predictFinishTime),
            iterationNum: currentIterations,
            finishedPercent: currentIterations / totalIterations * 100,
        };
        return sendData;
    }
};