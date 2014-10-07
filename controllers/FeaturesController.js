var Auth = require('./AuthController');

module.exports.controller = function (app) {

    app.get('/:username/:organism/features', function (req, res) {
       return  res.render('features/index')
    });

    app.get('/:username/:organism/features/new',Auth.isAuthenticated, function (req, res) {
       return  res.render('features/new')
    });

    app.get('/:username/:organism/features/show', function (req, res) {
        return res.render('features/show')
    });

};