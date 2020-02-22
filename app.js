var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var log4js = require('log4js');
require('dotenv').config();

var maskSensitiveData = function(msg) {
    if (msg){
        return  msg.replace( /([Pp][Ii][Nn]\d*[=]"?)[0-9A-Fa-f%]*(.?)/g, "$1****$2" ).
        replace( /([Pp][Ii][Nn]\d*)[>][^<]*[<]/g, "$1****$2" ).
        replace( /([0-9A-Fa-f]{6})[0-9A-Fa-f]*([0-9A-Fa-f]{4})/g, "$1****$2" ).
        replace( /([Cc][Vv][Vv]\d*)[=]\d*/g, "$1=****" ).
        replace( /([Cc][Vv][Vv]\d*)[>]\d*[<]/g, "$1>****<" );
    }
    return msg;
}

log4js.configure({
    appenders: {
        app: { type: 'file', filename: process.env.LOGS|| 'application.log', maxLogSize: 10485760, backups: 3, compress: true,
            layout: {
                type    : "pattern",
                pattern : process.env.LOGPATTERN || '%d{yyyy-MM-dd hh:mm:ss} %x{body}',
                tokens: {
                    body : function() {
                        var msg = ''
                        arguments[0].data.forEach((el)=>{
                            try{
                                msg += el
                            }catch (e) {}
                        })
                        return maskSensitiveData(msg);
                    }
                }
            }
        }
    },
    categories: {
        default: { appenders: [ 'app' ], level: process.env.LOGLEVEL || 'trace'}
    }
});
var logger = log4js.getLogger();

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
