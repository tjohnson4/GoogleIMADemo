var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');

var app = express();

//var logStream = fs.createWriteStream(__dirname + "/logs/access.log", {flags: 'a'});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set("env", process.env.NODE_ENV || "development");
app.set('port', process.env.PORT || 3000);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });

    https.createServer({
        key: fs.readFileSync('test/ssl_key/ssl.key'),
        cert: fs.readFileSync('test/ssl_key/ssl.crt')
    }, app).listen(app.get("port"), function () {
        console.log("HTTPS server listening on port " + app.get('port'));
    });
} else if (app.get("env") === "production") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    });

    app.listen(app.get("port"), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
}
