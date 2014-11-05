var express = require('express');
var passport = require('passport');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var async = require('async');
var fs = require('fs');
var flash = require('connect-flash');
var app = express();
var dbURI = 'mongodb://localhost/geefutu';
var util = require('./lib/util');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var IndexController = require('./controllers/IndexController');
var AuthController = require('./controllers/AuthController');
var ExperimentsController = require('./controllers/ExperimentsController');
var FeaturesController = require('./controllers/FeaturesController');
var GenomesController = require('./controllers/GenomesController');
var OrganismsController = require('./controllers/OrganismsController');
var UserController = require('./controllers/UserController');

var PORT = process.env.PORT || 8080;

var inDevelopment = true;

/**
 * Checks for config file, if it does not exist the app exists
 * @param done
 */
var getConfig = function (done) {
    var configPath = './config.json';
    fs.exists(configPath, function (exists) {
        if (exists) {
            var config = require('./config.json');
            app.appConfig = config;
            inDevelopment = config.devMode;
            //    TODO set more from config
        } else {
            util.logError('could not read the config file');
            util.logError('please run `gulp config-file` or copy config-example.json to config.json');
            process.exit();
        }
    });
    done();
};

/**
 * Generates a new secret.
 * @returns {string}
 */
var genSecret = function () {
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
    return secret;
};

/**
 * Adds additional middleware. Express and custom.
 * @param done
 */
var setupMiddleware = function (done) {
    if (!inDevelopment) {
        app.use(morgan('dev'));
    }
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(multer({dest: './uploads/'}));


    app.use(session({
        secret: genSecret(),
        cookie: {
            expires: false
        },
        //avoid nagging (these are the new values of express-session)
        resave: false,
        saveUninitialized: false
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
        var success = req.flash('success');

        if (info.length > 0) {
            res.locals.info = info;
        }
        if (success.length > 0) {
            res.locals.success = success;
        }
        if (error.length > 0) {
            res.locals.error = error;
        }
        next(null, req, res);
    };
    app.use(flashes);
    done();
};

/**
 * Loads routes in custom order.
 * @param done
 */
var loadRoutes = function (done) {
    IndexController.controller(app);
    AuthController.controller(app);

    OrganismsController.controller(app);
    GenomesController.controller(app);
    ExperimentsController.controller(app);
    FeaturesController.controller(app);


    UserController.controller(app);
    done();
};

/**
 * Sets up MongoDB + Mongoose actions.
 * @param done
 */
var mongoConnection = function (done) {
    var db = mongoose.connection;

    db.on('connecting', function () {
        if (!inDevelopment) {
            util.logInfo('connecting to MongoDB...');
        }
    });

    db.on('error', function (error) {
        if (!inDevelopment) {
            util.logError('Error in MongoDb connection: ' + error);
        }
        mongoose.disconnect();
    });
    db.on('connected', function () {
        if (!inDevelopment) {
            util.logInfo('MongoDB connected!');
        }
    });
    db.once('open', function () {
        if (!inDevelopment) {
            util.logInfo('MongoDB connection opened!');
        }
    });
    db.on('reconnected', function () {
        if (!inDevelopment) {
            util.logInfo('MongoDB reconnected!');
        }
    });
    db.on('disconnected', function () {
        if (!inDevelopment) {
            util.logError('MongoDB disconnected!');
        }
        mongoose.connect(dbURI, {server: {auto_reconnect: true}});
    });
    mongoose.connect(dbURI, {server: {auto_reconnect: true}});
    done();
};

/**
 * Starts the Express App.
 * @param done
 */
var startApp = function (done) {
    app.listen(PORT);
    util.logInfo('app started on ' + PORT);
    done();
};

/**
 * Sets up Socket.io actions.
 * @param done
 */
var initSocketIO = function (done) {

    io.on('connection', function (socket) {
        console.log('a user connected');
    });
    done();

};

/**
 * Runs app init functions in order.
 */
async.series([
    function (callback) {
        getConfig(callback);
    },
    function (callback) {
        setupMiddleware(callback);
    },
    function (callback) {
        loadRoutes(callback);
    },
    function (callback) {
        mongoConnection(callback);
    },
    function (callback) {
        initSocketIO(callback);
    },
    function (callback) {
        startApp(callback);
    }
]);

module.exports = app;
