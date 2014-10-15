var AuthController = require('./AuthController');

/**
 *
 * @param app - express app
 */
module.exports.controller = function (app) {

    app.get('/:username/:organism/features', function (req, res) {
        return res.render('features/index')
    });

    app.get('/:username/:organism/features/new', AuthController.isAuthenticated, function (req, res) {
        //if (req.isUnauthenticated()) {
        //    return res.redirect('/signin');
        //}
        return res.render('features/new')
    });

    app.get('/:username/:organism/features/show', function (req, res) {
        return res.render('features/show')
    });

};