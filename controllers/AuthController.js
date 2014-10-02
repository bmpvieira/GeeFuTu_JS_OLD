var User = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


module.exports.controller = function (app) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user){
            if(!err) done(null, user);
            else done(err, null)
        })
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({username: username}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                user.comparePassword(password, function (err, match) {
                    if (err) {
                        return done(null, false, {message: 'Incorrect username.'});
                    }
                    if (match) {
                        //ITS GOOD!
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'could not match.'});
                    }
                });
            });
        }
    ));


    app.get('/signin', function (req, res) {
        return res.render('auth/signin');
    });
    app.post('/signin',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true
        })
    );

    app.get('/signup', function (req, res) {
        return res.render('auth/signup');
    });
    app.post('/signup', function (req, res) {

        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var confirmpassword = req.body.confirmpassword;

        //exists and eq
        if (username && email && password && confirmpassword && password === confirmpassword) {
            var user = new User({
                username: username,
                email: email,
                password: password
            });

            user.save(function (err, r) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    req.session.userName = username;
                    return res.redirect('/');
                }
            });
        } else {
            res.send('password + confirmpassword do not match');
        }
    });

    app.get('/signout', function (req, res) {
        req.session.userName = null;
        res.redirect('/');
    });

};