const fs = require('fs');
var archiver = require('archiver');
const config = require('../config/config.base');
const fileManage = {
    compressFile(fileNames) {
        const temporyName = new Date().getTime();
        var output = fs.createWriteStream(`${global.rootPath}/public/tempory/${temporyName}.zip`);
        var archive = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });
        archive.pipe(output);
        fileNames.forEach(name => {
            const path = `${config.protein_base_path}/${name}`;
            var stat = fs.lstatSync(path);
            if (stat.isDirectory()) {
                archive.directory(`${path}/`, name);
            } else {
                archive.file(path, { name: name });
            }
        });
        const promise = new Promise((resolve, reject) => {
            output.on('close', function() {
                resolve({ fileName: fileNames, temporyName: temporyName });
            });
            archive.on('error', function(err) {
                reject(err);
                throw err;
            });
        });
        archive.finalize();
        return promise;
    },
    compressChildFile(parentFolder, folderNames) {
        if (folderNames.length === 1) {
            const item = folderNames[0];
            const name = item.value;
            let path = '';
            let folderType = '';
            if (item.folder === 'input') {
                folderType = 'inputFolder';
                path = `${config.protein_base_path}/${parentFolder}/inputFolder/${name}`;
            } else {
                folderType = 'outputFolder';
                path = `${config.protein_base_path}/${parentFolder}/outputFolder/${name}`;
            }
            var stat = fs.lstatSync(path);
            if (!stat.isDirectory()) {
                return new Promise(resolve => {
                    resolve({ folderType: folderType, fileName: name, parentFolder: parentFolder });
                });
            }
        }
        const temporyName = new Date().getTime();
        var output = fs.createWriteStream(`${global.rootPath}/public/tempory/${temporyName}.zip`);
        var archive = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });
        archive.pipe(output);
        folderNames.forEach(item => {
            const name = item.value;
            let path = '';
            if (item.folder === 'input') {
                path = `${config.protein_base_path}/${parentFolder}/inputFolder/${name}`;
            } else {
                path = `${config.protein_base_path}/${parentFolder}/outputFolder/${name}`;
            }
            var stat = fs.lstatSync(path);
            if (stat.isDirectory()) {
                archive.directory(`${path}/`, name);
            } else {
                archive.file(path, { name: name });
            }
        });
        const promise = new Promise((resolve, reject) => {
            output.on('close', function() {
                resolve({ fileName: folderNames, temporyName: temporyName });
            });
            archive.on('error', function(err) {
                reject(err);
                throw err;
            });
        });
        archive.finalize();
        return promise;
    }
}

module.exports = fileManage;