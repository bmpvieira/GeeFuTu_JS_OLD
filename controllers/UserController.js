module.exports.controller = function (app) {

    app.get('/:username', function (req, res) {
        var username = req.param("username");
        return res.render('user/index', {username: username});
    });

};