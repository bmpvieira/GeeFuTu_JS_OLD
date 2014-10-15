var User = require('../models/User');

module.exports.controller = function (app) {

    app.get('/:username', function (req, res) {
        var username = req.param("username");

        User.getUserByUsername(username, function (err, user) {

            if (err) {
                return res.render('error', {message: err});
            }

            if (!user) {
                return res.render('error', {message: 'user does not exist'});
            }

            user.getGravatar(function (url) {
                if (err) {
                    return res.render('error', {message: err});
                }
                return res.render('user/index', {user: user, gravatar: url});
            })
        });
    });


};
