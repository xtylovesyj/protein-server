const fs = require('fs');
const config = require('../config/config.base');
module.exports = {
    getDataByFile: function(folderName, fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(`${config.protein_base_path}/${folderName}/outputFolder/${fileName}`, function(err, data) {
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
};