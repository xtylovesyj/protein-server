let invoke = require('../services/invokeShell');

invoke('../protein.sh', ['-P', 'fdsfds']).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});

// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/yaojun';
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     console.log('数据库已创建');
//     var dbase = db.db("yaojun");
//     dbase.createCollection('protein', function(err, res) {
//         if (err) throw err;
//         console.log("创建集合!");
//         db.close();
//     });
// });