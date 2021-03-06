var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
const fs = require('fs');
var fsExtra = require('node-fs-extra')
var fileManageService = require('../services/fileManageServie');
const config = require('../config/config.base');
var log4js = require('log4js');
let invokeShell = require('../services/invokeShell');
const Protein = require('../object/protein');
const CacheData = require('../object/cacheData');
const logger4j = log4js.getLogger('任务管理');
const addWebsocketTask = require('../services/websocket');

addWebsocketTask('taskManage', ws => {
    let fileArray = [];
    fs.readdir(config.protein_base_path, function(err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach(file => {
            var stat = fs.lstatSync(`${config.protein_base_path}/${file}`);
            const object = {
                name: file,
                isDirectory: stat.isDirectory(),
                status: 0,
                hasStatistics: false,
                hasProtein: false,
            };
            if (object.isDirectory) {
                let files = null;
                try {
                    files = fs.readdirSync(`${config.protein_base_path}/${file}/outputFolder`);
                    object.status = new Protein(file).getCurrentStatus();
                } catch (error) {
                    // console.error(error.stack);
                    object.status = 2;
                }
                if (files) {
                    let proteinNum = 0;
                    files.forEach(name => {
                        const protein = new Protein(name);
                        if (name === protein.lineFileName || name === protein.scatterFileName) {
                            object.hasStatistics = true;
                        }
                        if (protein.pds.includes(name)) {
                            proteinNum++;
                        }
                    });
                    if (proteinNum > 0) {
                        object.hasProtein = true;
                    }
                }
            }
            fileArray.push(object);
        });
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                command: 'init',
                data: fileArray
            }));
        }
    });
});

router.post('/uploadInputfiles/:folderName(*)', multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, `${config.protein_base_path}/${req.params.folderName}/inputFolder`)
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname)
        }
    })
}).any(), function(req, res, next) {
    res.send('上传成功');
});

router.get('/readFolder', function(req, res, next) {
    let fileArray = [];
    fs.readdir(config.protein_base_path, function(err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach(file => {
            var stat = fs.lstatSync(`${config.protein_base_path}/${file}`);
            const object = {
                name: file,
                isDirectory: stat.isDirectory(),
                status: 0,
                hasStatistics: false,
                hasProtein: false,
            };
            if (object.isDirectory) {
                let files = null;
                try {
                    files = fs.readdirSync(`${config.protein_base_path}/${file}/outputFolder`);
                    object.status = new Protein(file).getCurrentStatus();
                } catch (error) {
                    // console.error(error.stack);
                    object.status = 2;
                }
                if (files) {
                    let proteinNum = 0;
                    files.forEach(name => {
                        const protein = new Protein(name);
                        if (name === protein.lineFileName || name === protein.scatterFileName) {
                            object.hasStatistics = true;
                        }
                        if (protein.pds.includes(name)) {
                            proteinNum++;
                        }
                    });
                    if (proteinNum > 0) {
                        object.hasProtein = true;
                    }
                }
            }
            fileArray.push(object);
        });
        res.send(fileArray);
    });
});


router.post('/compressFiles', function(req, res, next) {
    fileManageService.compressFile(req.body.fileName).then(data => {
        let file = data['temporyName'] + '.zip';
        res.send(file);
    });
});

router.post('/compressChildFiles', function(req, res, next) {
    fileManageService.compressChildFile(req.body.parentFolder, req.body.folderItems).then(data => {
        let file = data['temporyName'] + '.zip';
        res.send(file);
    });
});

router.get('/uploads/:file(*)', function(req, res, next) {
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

router.post('/delete', function(req, res, next) {
    let deletedFiles = [];
    let deleteNum = 0;
    const files = req.body.fileName;
    files.forEach(value => {
        const path = `${config.protein_base_path}/${value}`;
        fsExtra.remove(path, function(err) {
            if (err) {
                deleteNum++;
                return console.error(err);
            }
            deleteNum++;
            deletedFiles.push(value);
            if (deleteNum === files.length) {
                res.send(deletedFiles);
            }
        });
    });
});

router.post("/createProtein", function(req, res, next) {
    const proteinFullName = `${ req.body.proteinName }_${ new Date().getTime()}`;
    fs.mkdir(`${config.protein_base_path}/${proteinFullName}`, error => {
        if (error) {
            logger4j.error(error);
            return console.error(error);
        }
        fs.mkdirSync(`${config.protein_base_path}/${proteinFullName}/inputFolder`);
        fs.mkdirSync(`${config.protein_base_path}/${proteinFullName}/outputFolder`);
        fs.mkdirSync(`${config.protein_base_path}/${proteinFullName}/outputFolder/contact_dis`);
        logger4j.info(`成功创建${proteinFullName}`);
        res.send(proteinFullName);
    });
});

router.post("/childFolder", function(req, res, next) {
    const fileName = req.body.fileName;
    let fileArray = {
        inputFiles: [],
        outputFiles: []
    };
    fileArray.inputFiles = fs.readdirSync(`${config.protein_base_path}/${fileName}/inputFolder`);
    fileArray.outputFiles = fs.readdirSync(`${config.protein_base_path}/${fileName}/outputFolder`);
    res.send(fileArray);
});

router.get('/getExcuteErrorLog', (req, res, next) => {
    const fileName = req.query.folderName;
    fs.readFile(global.rootPath + `/log/${fileName}.log`, (err, data) => {
        if (err) {
            res.send({
                code: 500,
                message: err.stack,
                data: ''
            });
            return;
        }
        res.send({
            code: 200,
            message: '',
            data: {
                name: fileName,
                detail: data.toString()
            }
        });
    });
});

router.post("/excuteTasks", function(req, res, next) {
    const proteins = req.body.proteins;
    let successProteins = [];
    (async function() {
        for (let i = 0; i < proteins.length; i++) {
            let exp = new RegExp("End", "gi");
            let protein = new Protein(proteins[i], `${config.protein_base_path}`, new Date());
            CacheData.setCurrentRunProtein(protein);
            let result = '';
            try {
                result = await invokeShell(`${global.rootPath}/protein.sh`, ['-P', proteins[i], '-N', config.protein_base_path]);
            } catch (error) {
                fs.writeFile(global.rootPath + `/log/${proteins[i]}.log`, error, err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    global.eventEmitter.emit('errorTask', proteins[i]);
                });
                console.error(error);
                logger4j.error(error);
            }
            logger4j.info(result);
            if (exp.test(result)) {
                successProteins.push(proteins[i]);
                CacheData.clearProtein(protein);
            }
        }
    })();
    res.send('任务已成功发送，正在执行中！！！');
});



module.exports = router;