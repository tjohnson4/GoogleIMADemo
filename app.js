var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');

var app = express();

var logStream = fs.createWriteStream(__dirname + "/logs/access.log", {flags: 'a'})

// routes
var router = express.Router();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('combined', {stream: logStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

router.post("/log", function(req, res, next) {
    console.log(req.query.msg);
    fs.appendFile(__dirname + '/logs/client.log', new Date().toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '') + " " + req.query.msg+ "\n", function (err) {
        res.end();
    });
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
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

app.use('/', router);

if (process.env.NODE_ENV === 'production') {
    /* express */
    app.listen(app.get("port"), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
} else {
    https.createServer({
        key: fs.readFileSync('test/ssl_key/ssl.key'),
        cert: fs.readFileSync('test/ssl_key/ssl.crt')
    }, app).listen(app.get("port"), function () {
        console.log("HTTPS server listening on port " + app.get('port'));
    });
}

