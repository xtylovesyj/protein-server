var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var log4js = require('log4js');
const fs = require('fs');
var indexRouter = require('./routes/index');
var taskManageRouter = require('./routes/taskManage');
var taskManageChildFolderRouter = require('./routes/taskManageChildFolder');
var dataAnalysisRouter = require('./routes/dataAnalysis');
var protein3DRouter = require('./routes/protein3D');
var statusMonitorRouter = require('./routes/statusMonitor');
var loginRouter = require('./routes/login');
var statisticsRouter = require('./routes/statistics');
let homeRouter = require('./routes/home');
var session = require('express-session');
require('./services/websocket');
const CacheData = require('./object/cacheData');
const config = require('./config/config.base');
const Protein = require('./object/protein');


var app = express();

global.rootPath = __dirname;

app.use(express.static('public'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp',
    cookie: { maxAge: 80000000, secure: false },
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

//config accross origin
var allowCrossDomain = function(req, res, next) {
    const origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
};

//config log4js
log4js.configure({
    appenders: { app: { type: 'file', filename: path.join(__dirname, 'log/app.log') } },
    categories: { default: { appenders: ['app'], level: 'trace' } }
});

const logger4j = log4js.getLogger('app');

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'http-log/http.log'), { flags: 'a' });
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));


app.use(allowCrossDomain);
app.use((req, res, next) => {
    if (req.url === '/login' || req.url.includes('/taskManage/uploadInputfiles/') || req.session.user) {
        next();
    } else {
        res.send({
            code: 401,
            message: '未授权',
            data: ''
        });
    }
});
app.use('/', indexRouter);
app.use('/taskManage', taskManageRouter);
app.use('/taskManageChildFolder', taskManageChildFolderRouter);
app.use('/dataAnalysis', dataAnalysisRouter);
app.use('/protein3D', protein3DRouter);
app.use('/statusMonitor', statusMonitorRouter);
app.use('/login', loginRouter);
app.use('/statistics', statisticsRouter);
app.use('/home', homeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

CacheData.setCurrentRunProtein(new Protein('1B4BA_1537110442879', config.protein_base_path, new Date()));


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

require('./services/timer');
logger4j.info('app start');
logger4j.info('root path', global.rootPath);

module.exports = app;