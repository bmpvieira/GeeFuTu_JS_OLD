var Organism = require('../models/Organism');
var User = require('../models/User');
var Util = require('../lib/util');

this.index = function (req, res) {
    if (req.user && req.user.username && req.isAuthenticated()) {
        User.getUserByUsername(req.user.username, function (err, user) {
            if (err) {
                return Util.renderError(res, err);

            }
            Organism.findByUser(user, function (err, orgs) {
                if (err) {
                    return Util.renderError(res, err);
                }
                res.render('dash/index', {user: user, organisms: orgs});
            });
        });
    } else {
        res.render('index');
    }
};

this.us = function (req, res) {
    res.render('us');
};