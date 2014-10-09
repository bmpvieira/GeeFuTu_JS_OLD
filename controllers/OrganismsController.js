var Organism = require('../models/Organism');
var User = require('../models/User');
module.exports.controller = function (app) {

    app.get('/:username/:organism', function (req, res) {

        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();

        var currentUser = req.user;

        User.getUserByUsername(username, function (err, user) {

            if (err) {
                return res.render('error', {message: err});
            }

            if (!user) {
                return res.render('error', {message: 'user does not exist'});
            }

            Organism.findByUserAndLocal(user, organism, function (err, org) {

                if (err) { //error
                    return res.send(err);
                }

                if (!org) { //no matches
                    return res.render('error', {message: 'cound not find project'});
                }
                if (org.hidden) { //hidden from public
                    if (!currentUser) {//no user signed in
                        return res.render('error', {message: 'This is private'});
                    } else { //    user is signed in
                        org.canView(user, function (bool) {
                            if (bool) {
                                return res.render('organisms/show', {organism: org});
                            } else {
                                return res.render('error', {message: 'This is private'});
                            }
                        });
                    }
                } else {
                    return res.render('organisms/show', {organism: org, username: username});
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

    app.get('/new', function (req, res) {
        return res.render('organisms/new');
    });

    app.post('/new', function (req, res) {

        if (req.isUnauthenticated()) {
            res.redirect('/signin');
        }

        var ownerID = req.user._id;
        var ownerUsername = req.user.username;

        //if (!owner) {
        //    res.send('cannot find owner');
        //}

        var localName = req.body.localname;

        Organism.checkIsExistsByLocalName(localName, function (err, exists) {

            if (err) {
                return res.render('error', {message: err});
            }
            if (exists) {
                return res.render('error', {message: 'You already have a Organism called ' + localName});
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
            org.save(function (err, organism) {
                if (err) {
                    return res.send(err);
                }
                return res.redirect('/' + ownerUsername + '/' + localName);
            });
        });
    });

    //app.get('/organisms/show', function (req, res) {
    //    return res.render('organisms/show');
    //});

};