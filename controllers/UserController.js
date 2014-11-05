var User = require('../models/User');
var Util = require('../lib/util');

module.exports.controller = function (app) {

    app.get('/:username', function (req, res) {
        var username = req.param("username");

        User.getUserByUsername(username, function (err, user) {

            if (err) {
                Util.renderError(res, err);
            }

            if (!user) {
                return Util.renderError(res, 'user does not exist');
            }

            //user.getGravatarUrl(function (url) {
            //    user.gravatarURL = url;
            //    user.save();
            //});

            return res.render('user/index', {user: user});
        });
    });


};
