var Organism = require('../models/Organism');
var User = require('../models/User');
var AuthController = require('./AuthController');
var Util = require('../lib/util');
// var marked = require('marked');

module.exports.controller = function (app) {

    app.get('/:username/:organism', function (req, res) {

        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();

        var currentUser = req.user;

        User.getUserByUsername(username, function (err, user) {

            if (err) {
                return Util.renderError(res, err);
            }

            if (!user) {
                return Util.renderError(res, 'user does not exist');
            }

            Organism.findByUserAndLocalName(user, organism, function (err, org) {

                if (err) { //error
                    return Util.renderError(res, err);
                }

                if (!org) { //no matches
                    return Util.renderError(res, 'cound not find project');
                }
                //var marked = ('I am using __markdown__.');

                if (org.hidden) { //hidden from public
                    if (!currentUser) {//no user signed in
                        return Util.renderError(res, 'This is private');
                    } else { //    user is signed in
                        org.canView(user, function (bool) {
                            if (bool) {
                                return Util.renderError(res, err);
                            } else {
                                return Util.renderError(res, 'This is private');
                            }
                        });
                    }
                } else {
                    return res.render('organisms/show', {organism: org, username: username});
                }
            });
        });
    });

    app.get('/:username/:organism/clone', AuthController.isAuthenticated, function (req, res) {

        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();

        User.getUserByUsername(username, function (err, user) {

            if (err) {
                return Util.checkError(res, err);
            }

            if (!user) {
                return Util.checkError(res, 'We could not find you!?');
            }

            Organism.findByUserAndLocalName(user, organism, function (err, org) {

                if (err) {
                    return Util.checkError(res, err);
                }
            });

        });
    });

    app.get('/new', AuthController.isAuthenticated, function (req, res) {
        return res.render('organisms/new');
    });

    app.post('/new', AuthController.isAuthenticated, function (req, res) {

        //if (req.isUnauthenticated()) {
        //    res.redirect('/signin');
        //}

        var ownerID = req.user._id;
        var ownerUsername = req.user.username;

        //if (!owner) {
        //    res.send('cannot find owner');
        //}

        var localName = req.body.localname;

        Organism.checkIsExistsByLocalName(localName, function (err, exists) {

            if (err) {
                return Util.renderError(res, err);
            }
            if (exists) {
                return Util.renderError(res, 'You already have a Organism called ' + localName);
            }


            var description = req.body.description;
            var genus = req.body.genus;
            var species = req.body.species;
            var strain = req.body.strain;
            var pathovar = req.body.pathovar;
            var ncbi = req.body.ncbi;
            var hidden = req.body.private;

            var org = new Organism({
                localName: localName.toLowerCase(),
                description: description,
                genus: genus,
                species: species,
                strain: strain,
                pathovar: pathovar,
                ncbi: ncbi,
                owner: ownerID,
                hidden: hidden
            });
            org.save(function (err) {
                if (err) {
                    return Util.renderError(res, err);
                }
                return res.redirect('/' + ownerUsername + '/' + localName);
            });
        });
    });
};
