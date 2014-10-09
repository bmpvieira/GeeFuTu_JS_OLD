var User = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


module.exports.controller = function (app) {


    //this.isAuthenticated = function (req, res, next) {
    //
    //    if (req.isAuthenticated()) {
    //        return next();
    //    }
    //    res.redirect('/signin');
    //};


    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (!err) done(null, user);
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

        if (req.isAuthenticated()) {
            return res.redirect('/');
        }

        var username = '';
        var email = '';
        var password = '';

        return res.render('auth/signup', {username: username, email: email, password: password});
    });

    app.post('/signup', function (req, res) {

        if (req.isAuthenticated()) {
            return res.redirect('/');
        }

        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        return res.render('auth/signup', {username: username, email: email, password: password});
    });

    app.post('/join', function (req, res) {

        if (req.isAuthenticated()) {
            return res.redirect('/');
        }

        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var confirmpassword = req.body.confirmpassword;

        //exists and eq
        if (username && email && password && confirmpassword && password === confirmpassword) {

            User.canHaveUsername(username, function (err, canHaveUsername) {

                if (err) {
                    return res.render('error', {message: err});
                }

                if (canHaveUsername) {

                    User.emailAddressInUse(email, function (err, emailAddressInUse) {

                        if (err) {
                            return res.render('error', {message: err});
                        }

                        if (emailAddressInUse) {
                            return res.render('error', {message: 'email address is used by another user.'});
                        }

                        var user = new User({
                            username: username,
                            email: email,
                            password: password
                        });

                        user.save(function (err, r) {
                            if (err) {
                                return res.render('error', {message: err});
                            }
                            return res.redirect('/signin');
                        });
                    });
                } else {
                    return res.render('error', {message: 'username is already in use.'});
                }
            });
        } else {
            return res.render('error', {message: 'password + confirm password do not match'});
        }
    });

    app.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};