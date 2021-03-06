var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
var fsExtra = require('node-fs-extra');
var fileManageService = require('../services/fileManageServie');
const config = require('../config/config.base');
var log4js = require('log4js');
const logger4j = log4js.getLogger('任务管理子页面');


router.post('/compressChildFiles', function(req, res, next) {
    fileManageService.compressChildFile(req.body.parentFolder, req.body.folderItems).then(data => {
        let file = '';
        if (data['temporyName']) {
            file = data['temporyName'] + '.zip';
        } else {
            file = data;
        }
        res.send(file);
    });
});

router.post('/delete', function(req, res, next) {
    let deletedFiles = [];
    const parentFolder = req.body.parentFolder;
    const folderItems = req.body.folderItems;
    let num = 0;
    folderItems.forEach(value => {
        let path = '';
        if (value.folder === 'input') {
            path = `${config.protein_base_path}/${parentFolder}/inputFolder/${value.value}`;
        } else {
            path = `${config.protein_base_path}/${parentFolder}/outputFolder/${value.value}`;
        }
        fsExtra.remove(path, function(err) {
            if (err) {
                console.error(err);
                logger4j.info(err);
            } else {
                deletedFiles.push(value);
            }
            num++;
            if (num === folderItems.length) {
                res.send(deletedFiles);
            }
        });
    });
});

router.post("/childFolder", function(req, res, next) {
    const fileName = req.body.fileName;
    let fileArray = {
        inputFiles: [],
        outputFiles: []
    };
    try {
        fileArray.inputFiles = fs.readdirSync(`${config.protein_base_path}/${fileName}/inputFolder`);
        fileArray.outputFiles = fs.readdirSync(`${config.protein_base_path}/${fileName}/outputFolder`);
        res.send(fileArray);
    } catch (error) {
        console.error(error);
        res.send(fileArray);
    }

});

router.get('/downloads/:file(*)', function(req, res, next) {
    var file = req.params.file;
    var fileLocation = path.join(global.rootPath + '/public/tempory', file);
    res.download(fileLocation, file);
    setTimeout(() => {
        fs.unlink(fileLocation, function(err) {
            if (err) {
                return console.error(err);
            }
        });
    }, 300000);
});
router.get('/download/:parentFolder/:folderType/:file(*)', function(req, res, next) {
    let parentFolder = req.params.parentFolder;
    let folderType = req.params.folderType;
    let fileName = req.params.file;
    let fileLocation = `${config.protein_base_path}/${parentFolder}/${folderType}/${fileName}`;
    res.download(fileLocation, fileName);
});

module.exports = router;