module.exports.controller = function (app) {

    var AuthController = require('./controllers/AuthController');
    var EmailController = require('./controllers/EmailController');
    var ExperimentsController = require('./controllers/ExperimentsController');
    var FeaturesController = require('./controllers/FeaturesController');
    var GenomesController = require('./controllers/GenomesController');
    var IndexController = require('./controllers/IndexController');
    var OrganismsController = require('./controllers/OrganismsController');
    var UserController = require('./controllers/UserController');

    app.route('/')
        .get(IndexController.index);
    app.route('/us')
        .get(IndexController.us);

    app.route('/signin')
        .get(AuthController.signin)
        .post(AuthController.signinPost);
    app.route('/signup')
        .get(AuthController.signup)
        .post(AuthController.signupPost);
    app.route('/join')
        .get(AuthController.join)
        .post(AuthController.joinPost);
    app.route('/signout')
        .get(AuthController.signout)

    app.route('/:username')
        .get(UserController.user);

    app.route('/:username/add')
        .get(OrganismsController.add)
        .post(OrganismsController.addPost);
    app.route('/:username/:organism/edit')
        .get(OrganismsController.edit)
        .post(OrganismsController.editPost);
    app.route('/:username/:organism/clone')
        .get(OrganismsController.clone);
    app.route('/:username/:organism')
        .get(OrganismsController.show);

    app.route('/:username/:organism/add')
        .get(GenomesController.add)
        .post(GenomesController.addPost);
    app.route('/:username/:organism/:genome')
        .get(GenomesController.show);

    app.route('/:username/:organism/:genome/add')
        .get(ExperimentsController.add)
        .post(ExperimentsController.addPost);
    app.route('/:username/:organism/:experiment')
        .get(ExperimentsController.show);



};