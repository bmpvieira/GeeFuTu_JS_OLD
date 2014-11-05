var Organism = require('../models/Organism');
var Genome = require('../models/Genome');
var User = require('../models/User');
var AuthController = require('./AuthController');
var Util = require('../lib/util');
var marked = require('marked');


this.add = function (req, res) {
    return res.render('organisms/new');

};
this.addPost = function (req, res) {

    var ownerUsername = req.user.username;

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
            owner: ownerUsername,
            hidden: hidden
        });
        org.save(function (err) {
            if (err) {
                return Util.renderError(res, err);
            }
            return res.redirect('/' + ownerUsername + '/' + localName);
        });
    });
};

this.edit = function (req, res) {

//app.route('/:username/:organism/edit')
//    .get([AuthController.isAuthenticated, AuthController.canEdit],
//    function (req, res) {
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
                return res.render('organisms/edit', {organism: org, username: username});
            }
        });
    });
};

this.editPost = function(req, res){
//post([AuthController.isAuthenticated, AuthController.canEdit], function (req, res) {
    var user = req.user;
    var organism = req.body.organism;
    var markdown = req.body.markdown;

    Organism.findByUserAndLocalName(user, organism, function (err, org) {

        if (err) {
            return Util.renderError(res, err);
        }

        //save new markdown
        org.readme = markdown;

        org.save(function (err) {
            if (err) {
                return Util.renderError(res, err);
            }
            return res.send('saved');
        });
    });
};

this.clone = function(req, res){
//app.get('/:username/:organism/clone', [AuthController.isAuthenticated, AuthController.canEdit], function (req, res) {

    //var username = req.param("username").toLowerCase();
    //var organism = req.param("organism").toLowerCase();
    //
    //User.getUserByUsername(username, function (err, user) {
    //
    //    if (err) {
    //        return Util.renderError(res, err);
    //    }
    //
    //    if (!user) {
    //        return Util.renderError(res, 'We could not find you!?');
    //    }
    //
    //    Organism.findByUserAndLocalName(user, organism, function (err, org) {
    //
    //        if (err) {
    //            return Util.renderError(res, err);
    //        }
    //    });
    //
    //});
    return Util.renderError(res, 'Cloning is not ready yet');
};

this.show = function(req, res){
//app.get('/:username/:organism', AuthController.canView, function (req, res) {

    var username = req.param("username").toLowerCase();
    var organism = req.param("organism").toLowerCase();

//        var currentUser = req.user;

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
                return Util.renderError(res, 'cound not find organism');
            }


            org.getGenomes(function (err, genomes) {

                if (err) { //error
                    return Util.renderError(res, err);
                }

                var md = decodeURIComponent(org.readme);
                var readme = marked(md);

                return res.render('organisms/show', {
                    organism: org,
                    username: username,
                    genomes: genomes,
                    readme: readme
                });

            });
        });
    });
};