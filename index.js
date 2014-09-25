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

var pjson = require('./package.json');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({dest: './uploads/'}));
app.use(session({
    //session secret - CHANGE THIS TO SOMETHING ELSE!
    secret: 'changemenow',
    cookie: {
        //secure: true,
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

// pass username to all responses (views)
var appendLocalsToUseInViews = function (req, res, next) {

    // gets current version
    //res.locals.pjson = pjson;

    if (req.user != null && req.user.username != null) {
        res.locals.userName = req.user.username;

    }
    next(null, req, res);
};
app.use(appendLocalsToUseInViews);


app.get('/', function (req, res) {
    res.render('index');
});

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route.controller(app);
    }
});


mongoose.connect('mongodb://localhost/geefutu');
app.listen(8080);
console.log('8080');

