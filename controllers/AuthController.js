var User = require('../models/User');
var Organism = require('../models/Organism');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Util = require('../lib/util');


module.exports.controller = function (app) {

    this.canView = function (req, res, next) {
        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();
        if (!username || !organism) {
            return res.redirect('/signin');
        }
        User.getUserByUsername(username, function (err, user) {
            if (err) {
                return Util.renderError(res, err);
            }
            if (!user) {
                return Util.renderError(res, 'user does not exist');
            }
            Organism.findByUserAndLocalName(user, organism, function (err, org) {
                if (err) {
                    return Util.renderError(res, err);
                }
                if (org.hidden) {
                    org.canView(user, function (canView) {
                        if (canView) {
                            return next();
                        } else {
                            return res.redirect('/signin');
                        }
                    })
                } else {
                    return next();
                }
            });
        });
    };

    this.canEdit = function (req, res, next) {
        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();
        if (!username || !organism) {
            return res.redirect('/signin');
        }
        User.getUserByUsername(username, function (err, user) {
            if (err) {
                return Util.renderError(res, err);
            }
            if (!user) {
                return Util.renderError(res, 'user does not exist');
            }
            Organism.findByUserAndLocalName(user, organism, function (err, org) {
                if (err) {
                    return Util.renderError(res, err);
                }
                org.canEdit(user, function (canEdit) {
                    if (canEdit) {
                        return next();
                    } else {
                        return res.redirect('/signin');
                    }
                });

            });
        });
    };

    this.isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    };


    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (!err) {
                done(null, user);
            }
            else {
                done(err, null);
            }
        });
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

    app.get('/join', function (req, res) {
        res.redirect('/signup');
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
                    return Util.renderError(res, err);
                }

                if (canHaveUsername) {

                    User.emailAddressInUse(email, function (err, emailAddressInUse) {

                        if (err) {
                            return Util.renderError(res, err);
                        }

                        if (emailAddressInUse) {
                            return Util.renderError(res, 'email address is used by another user.');
                        }

                        var user = new User({
                            username: username,
                            email: email,
                            password: password
                        });

                        user.save(function (err, r) {
                            if (err) {
                                return Util.renderError(res, err);
                            }
//                            USER CREATED OK
                            Util.flashSuccess(req, 'User has been created, please sign in');
                            return res.redirect('/signin');
                        });
                    });
                } else {
                    return Util.renderError(res, 'username is already in use.');
                }
            });
        } else {
            return Util.renderError(res, 'password + confirm password do not match');
        }
    });

    app.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};
