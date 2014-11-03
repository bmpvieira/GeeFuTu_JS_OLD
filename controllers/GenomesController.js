var Genome = require('../models/Genome');
var Organism = require('../models/Organism');
var User = require('../models/User');
var Reference = require('../models/Reference');
var Fasta = require('../lib/fasta');
var async = require('async');
var AuthController = require('./AuthController');
var OrganismsController = require('./OrganismsController');
var Util = require('../lib/util');

/**
 *
 * @param app
 */
module.exports.controller = function (app) {

    app.get('/:username/:organism/genomes', AuthController.canView, function (req, res) {

        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();

        User.getUserByUsername(username, function (err, user) {
            if (err) {
                return Util.renderError(res, err);
            }

            Organism.findByUserAndLocalName(user, organism, function (err, org) {
                if (err) {
                    return Util.renderError(res, err);
                }
                org.getGenomes(function (err, genomes) {
                    if (err) {
                        return Util.renderError(res, err);
                    }
                    res.render('genomes/index', {
                        organism: org,
                        genomes: genomes,
                        user: user
                    });
                });
            });
        });
    });

    app.get('/:username/:organism/:genome', AuthController.canView, function (req, res) {
        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();
        var genomeName = req.param("genome").toLowerCase();

        User.getUserByUsername(username, function (err, user) {
            if (err) {
                return Util.renderError(res, err);
            }

            if (!user) {
                return Util.renderError(res, 'user does not exist');
            }

            Organism.findByUserAndLocalName(user, organism, function (err, org) {
                if (err) {
                    return res.render('error', {message: err});
                }

                org.getGenomeByName(genomeName, function (err, genome) {
                    if (err) {
                        return Util.renderError(res, err);
                    }

                    genome.getExperiments(function (err, experiments) {
                        if (err) {
                            return Util.renderError(res, err);
                        }
                        console.log(genome);
                        res.render('genomes/show', {
                            organism: org,
                            genome: genome,
                            user: user,
                            experiments: experiments
                        });
                    });
                });
            });
        });
    });

    app.get('/:username/:organism/genomes/add', AuthController.isAuthenticated, function (req, res) {

        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();

        User.getUserByUsername(username, function (err, user) {
            if (err) {
                return Util.renderError(res, err);
            }

            if (!user) {
                return Util.renderError(res, 'user does not exist');
            }

            Organism.findByUserAndLocalName(user, organism, function (err, org) {
                if (err) {
                    return res.render('error', {message: err});
                }

                console.log(org);

                return res.render('genomes/new', {
                    organism: org,
                    user: user,
//                    organism: organism
                });
            });

        });

    });

    app.post('/:username/:organism/genomes/add', [AuthController.isAuthenticated, AuthController.canEdit], function (req, res) {

        //order: create genome, get its id, add all refs from file, link them to genome by id

        var description = req.body.description;
        var name = req.body.name;
        var meta = req.body.meta;

        var username = req.param("username").toLowerCase();
        var organism = req.param("organism").toLowerCase();


        User.getUserByUsername(username, function (err, user) {
            if (err) {
                return Util.renderError(res, err);
            }

            Organism.findByUserAndLocalName(user, organism, function (err, org) {
                if (err) {
                    return Util.renderError(res, err);
                }

                var file = req.files.file;

                if (org && description && name && meta && file) {
                    if (err) {
                        return Util.renderError(res, err);
                    }


                    var genome = new Genome({
                        organism: org._id,
                        description: description,
                        name: name,
                        meta: meta
                    });


                    genome.save(function (err, gen) {
                        if (err) {
                            return Util.renderError(res, err);
                        }

                        Fasta.read(file.path, function (ref) {
                            var reference = new Reference({
                                name: ref.name, sequence: ref.seq, genome: gen._id
                            });
                            reference.save(function (err) {
                                if (err) {
                                    return Util.renderError(res, err);
                                }
                            });
                        }, function () {
                            console.log('finished');
                        });
                        return res.redirect('/' + user.username + '/' + org.localName + '/genomes');
                    });
                } else {
                    return Util.renderError(res, new Error('could not find Organism'));
                }
            });
        });
    });

    app.get('/:username/:organism/genomes/show', function (req, res) {
        return res.render('genomes/show');
    });

//app.get('/api/genome/:id', function (req, res) {
//
//    var id = req.param("id");
//    var chr = req.query.chr;
//    var min = req.query.min;
//    var max = req.query.max;
//
//    Reference.find(
//        {
//            genome: id, name: chr
//            //, start: {$gt: min}, end: {$lt: max }
//        },
//        function (err, genome) {
//            if (err) {
//                return console.log('error', err);
//            } else {
//                //console.log(genome);
//                console.log('FOUND:', genome.length);
//                console.log(genome);
//                if (genome && genome.length > 0) {
//                    var g = genome[0];
//                    var seq = g.sequence.substring(min, max);
//                    console.log(seq);
//                    return res.send(seq);
//                } else {
//                    return res.send();
//                }
//            }
//        });
//
//
//    console.log('get reference track');
//    //res.send();
//});

}
;
