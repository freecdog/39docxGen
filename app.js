var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');
var fs = require('fs');

var apiRouter = require('./routes/api.js');
var docxTempRouter = require('./routes/docxTemp.js');

var app = express();

var noop = function(){};
function readJSONFile(filepath, callback){
    callback = callback || noop;
    fs.readFile(filepath, {encoding: "utf8"}, function(err, filedata){
        if (err) {
            console.log("read error:", err);
            callback(err, null);
        } else {
            // some hack with first symbol =/
            filedata = filedata.replace(/^\uFEFF/, '');
            // parsing file to JSON object
            var jsondata = JSON.parse(filedata);

            callback(null, jsondata);
        }
    });
}
function writeJSONFile(filepath, jsondata, callback){
    callback = callback || noop;
    fs.writeFile(filepath, JSON.stringify(jsondata), {encoding: "utf8"}, function (err) {
        if (err) {
            console.log("write error:", err);
            callback(err, null);
        } else {
            console.log('File has been successfully written');
            callback();
        }
    });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', docxTempRouter);
app.use('/api', apiRouter);

// variables
var TODOs = [];

function readTODOs(callback){
    callback = callback || noop;
    readJSONFile(path.join(__dirname, 'usertodos.txt'), function(err, jsondata){
        if (jsondata){
            // extend, because I want to save link for original TODOs object which used in writeTODOs
            _.extend(TODOs, jsondata);
            //console.log("read TODOs:", TODOs);
            callback(err, TODOs);
        } else {
            console.log('No json data in file');
            callback(err);
        }
    });
}
// just read TODOs from usertodos.txt
readTODOs();

function writeTODO(newTODO){
    var filepath = path.join(__dirname, 'usertodos.txt');
    TODOs.push(newTODO);
    console.log("updated TODOs before writing:", TODOs);
    writeJSONFile(filepath, TODOs, function(){
        console.log("newTODO was successfully added");
    });
}

// export
app.TODOs = TODOs;
app.readTODOs = readTODOs;
app.writeTODO = writeTODO;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
