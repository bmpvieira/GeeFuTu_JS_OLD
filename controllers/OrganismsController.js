var Organism = require('../models/Organism');
//var Auth = require('./AuthController');
var User = require('../models/User');
module.exports.controller = function (app) {

    app.get('/:username/:organism', function (req, res) {

        var username = req.param("username");
        var organism = req.param("organism");

        var currentUser = req.user;

        User.getUserByUsername(username, function (err, user) {

            if (err) {
                return res.render('error',{message: err});
            }

            if (!user) {
                return res.render('error',{message: 'user does not exist'});
            }

            Organism.findByUserAndLocal(user, organism, function (err, org) {

                if (err) { //error
                    return res.send(err);
                }

                if (!org) { //no matches
                    return res.render('error',{message: 'cound not find project'});
                }
                if (org.hidden) { //hidden from public
                    if (!currentUser) {//no user signed in
                        return res.render('error',{message: 'This is private'});
                    } else { //    user is signed in
                        org.canView(user, function (bool) {
                            if (bool) {
                                return res.render('organisms/show', {organism: org});
                            } else {
                                return res.render('error',{message: 'This is private'});
                            }
                        });
                    }
                } else {
                    return res.render('organisms/show', {organism: org});
                }
            });
        });
    });


    //app.get('/organisms', function (req, res) {
    //
    //    if (req.isAuthenticated()) {
    //        Organism.findByUser(req.user._id, function (err, orgs) {
    //            if (err) return res.send(err);
    //            return res.render('organisms/index', {
    //                organisms: orgs
    //            });
    //        });
    //    } else {
    //        res.render('organisms/index', {organisms: []});
    //    }
    //
    //
    //});

    //app.get('/organisms/add', Auth.isAuthenticated, function (req, res) {
    //    return res.render('organisms/new');
    //});

    //app.post('/organisms/add', Auth.isAuthenticated, function (req, res) {
    //
    //    var owner = req.user._id;
    //
    //    if (!owner) {
    //        res.send('cannot find owner');
    //    }
    //
    //    var localName = req.body.localname;
    //    var description = req.body.description;
    //    var genus = req.body.genus;
    //    var species = req.body.species;
    //    var strain = req.body.strain;
    //    var pathovar = req.body.pathovar;
    //    var ncbi = req.body.ncbi;
    //
    //    var org = new Organism({
    //        localName: localName,
    //        description: description,
    //        genus: genus,
    //        species: species,
    //        strain: strain,
    //        pathovar: pathovar,
    //        ncbi: ncbi,
    //        owner: owner
    //    });
    //    org.save(function (err, organism) {
    //        if (err) return res.send(err);
    //        return res.redirect('/organisms');
    //    });
    //});

    //app.get('/organisms/show', function (req, res) {
    //    return res.render('organisms/show');
    //});

};