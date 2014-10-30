var Organism = require('../models/Organism');
var User = require('../models/User');
module.exports.controller = function (app) {

    app.get('/', function (req, res) {

        //if user is signed in send them to DASH else send them to home
        if (req.user && req.user.username && req.isAuthenticated()) {
            //dash
            User.getUserByUsername(req.user.username, function (err, user) {
                if (err) {
                    return res.render('error', {message: err});
                }
                Organism.findByUser(user, function (err, orgs) {
                    if (err) {
                        return res.render('error', {message: err});
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
};
