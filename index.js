var express = require('express');
var passport = require('passport');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var flash = require('connect-flash');
var app = express();
var dbURI = 'mongodb://localhost/geefutu';


var setupMiddleware = function () {
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(multer({dest: './uploads/'}));
    app.use(session({
        //session secret - TODO: CHANGE THIS TO SOMETHING ELSE!
        secret: 'changemenow',
        cookie: {
            path: '/',
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    }));

    app.use(express.static(__dirname + '/public'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    var appendLocalsToUseInViews = function (req, res, next) {
        if (req.user != null && req.user.username != null) {
            res.locals.userName = req.user.username;

        }
        next(null, req, res);
    };
    app.use(appendLocalsToUseInViews);
};

var loadRoutes = function () {
    fs.readdirSync('./controllers').forEach(function (file) {
        if (file.substr(-3) == '.js') {
            route = require('./controllers/' + file);
            route.controller(app);
        }
    });
    app.get('/', function (req, res) {
        res.render('index');
    });
};

var mongoConnection = function () {
    var db = mongoose.connection;

    db.on('connecting', function () {
        console.log('connecting to MongoDB...');
    });

    db.on('error', function (error) {
        console.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('connected', function () {
        console.log('MongoDB connected!');
    });
    db.once('open', function () {
        console.log('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
        console.log('MongoDB reconnected!');
    });
    db.on('disconnected', function () {
        console.log('MongoDB disconnected!');
        mongoose.connect(dbURI, {server: {auto_reconnect: true}});
    });
    mongoose.connect(dbURI, {server: {auto_reconnect: true}});
};

var startApp = function () {
    app.listen(8080);
    console.log('app started on 8080');
};


setupMiddleware();
loadRoutes();
mongoConnection();
startApp();
