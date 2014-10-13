var express = require('express');
var passport = require('passport');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var chalk = require('chalk');
var util = require('./lib/Utils')
var fs = require('fs');
var flash = require('connect-flash');
var app = express();
var dbURI = 'mongodb://localhost/geefutu';

var User = require('./models/User');
var Organism = require('./models/Organism');

var PORT = 8080

var getConfig = function () {
    var configPath = './config.json';
    fs.exists(configPath, function (exists) {
        if (exists) {
            var config = require('./config.json');
            util.logInfo('config loaded');
        } else {
          util.logError('could not read the config file');
          util.logError('please copy config-example.json to config.json and modify it as needed');
            process.exit();
        }
    });
};

var setupMiddleware = function () {
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(multer({dest: './uploads/'}));

    var secret = "", rand;
    for (var i = 0; i < 36; i++) {
        rand = Math.floor(Math.random() * 15);
        if (rand < 10) {
            // for 0-9
            secret += String.fromCharCode(48 + rand);
        } else {
            // for a-f
            secret += String.fromCharCode(97 + (rand - 10));
        }
    }

    app.use(session({
        secret: secret,
        cookie: {
            expires: false
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

    var flashes = function (req, res, next) {
        var info = req.flash('info');
        var error = req.flash('error');

        if (info.length > 0) {
            res.locals.info = info;
        }
        if (error.length > 0) {
            res.locals.error = error;
        }
        next(null, req, res);
    };
    app.use(flashes);
};

var loadRoutes = function () {

    app.get('/', function (req, res) {

        //if user is signed in send them to DASH else send them to home
        if (req.user && req.user.username && req.isAuthenticated()) {
            //dash
            User.getUserByUsername(req.user.username, function (err, user) {
                if (err) {
                    return res.render('error', {message: error});
                }
                Organism.findByUser(user._id, function (err, orgs) {
                    if (err) {
                        return res.render('error', {message: error});
                    }
                    res.render('dash/index', {user: user, organisms: orgs});
                });
            });
        } else {
            //public index
            res.render('index');
        }
    });

    app.get('/us', function (req, res) {
        res.render('us');
    });

    var AuthController = require('./controllers/AuthController');
    AuthController.controller(app);

    var ExperimentsController = require('./controllers/ExperimentsController');
    ExperimentsController.controller(app);

    var FeaturesController = require('./controllers/FeaturesController');
    FeaturesController.controller(app);

    var GenomesController = require('./controllers/GenomesController');
    GenomesController.controller(app);


    var OrganismsController = require('./controllers/OrganismsController');
    OrganismsController.controller(app);

    var UserController = require('./controllers/UserController');
    UserController.controller(app);
};

var mongoConnection = function () {
    var db = mongoose.connection;

    db.on('connecting', function () {
        util.logInfo('connecting to MongoDB...');
    });

    db.on('error', function (error) {
        util.logError('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('connected', function () {
        util.logInfo('MongoDB connected!');
    });
    db.once('open', function () {
        util.logInfo('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
        util.logInfo('MongoDB reconnected!');
    });
    db.on('disconnected', function () {
        util.logError('MongoDB disconnected!');
        mongoose.connect(dbURI, {server: {auto_reconnect: true}});
    });
    mongoose.connect(dbURI, {server: {auto_reconnect: true}});
};

var startApp = function () {
    app.listen(PORT);
    util.logInfo('app started on '+PORT);
};

getConfig();
setupMiddleware();
loadRoutes();
mongoConnection();
startApp();
