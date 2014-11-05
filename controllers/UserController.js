var User = require('../models/User');
var Util = require('../lib/util');

this.user = function (req, res) {
    var username = req.param("username");

    User.getUserByUsername(username, function (err, user) {

        if (err) {
            Util.renderError(res, err);
        }

        if (!user) {
            return Util.renderError(res, 'user does not exist');
        }

        return res.render('user/index', {user: user});
    });
};
