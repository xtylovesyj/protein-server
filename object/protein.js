const fs = require('fs');
const config = require('../config/config.base');
class Protein {
    constructor(name, path, startDate) {
        this.name = name;
        this.path = path;
        this.startDate = startDate;
    }

    getPath() {
        return this.path;
    }

    getLineData() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${this.path}/${this.name}/outputFolder/${config.statistics.line}`, function(err, data) {
                if (err) {
                    reject({
                        code: 500,
                        message: err,
                        data: ''
                    });
                    console.error(err);
                } else {
                    resolve({
                        code: 200,
                        message: '',
                        data: data.toString()
                    });
                }
            });
        });
    }
    getScatterData() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${this.path}/${this.name}/outputFolder/${config.statistics.scatter}`, function(err, data) {
                if (err) {
                    reject({
                        code: 500,
                        message: err,
                        data: ''
                    });
                    console.error(err);
                } else {
                    resolve({
                        code: 200,
                        message: '',
                        data: data.toString()
                    });
                }
            });
        });
    }

    getFileSize() {

    }
    getStatisticsData() {

    }
    getPredictedData() {

    }
    getCompletedTime() {
        return new Date();
    }
    getName() {
        return this.name;
    }
    getStartDate() {
        return this.startDate;
    }
    getIterationNum() {
        return +(Math.random().toFixed(4)) * 10000;
    }

    getFinishedPercent() {
        /* const currentDate = new Date();
        let percent = (currentDate.getTime() - this.startDate.getTime()) / (this.getCompletedTime.getTime() - this.startDate.getTime()) * 100;
        return percent > 99 ? 99 : percent; */
        return +(Math.random().toFixed(2)) * 100;
    }
}
module.exports = Protein;