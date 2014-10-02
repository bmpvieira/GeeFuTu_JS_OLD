var Genome = require('../models/Genome');
var Organism = require('../models/Organism');
var Reference = require('../models/Reference');
var Fasta = require('../lib/fasta');
var async = require('async');

/**
 *
 * @param app
 */
module.exports.controller = function (app) {

    app.get('/genomes', function (req, res) {
        Genome.findAll(function (err, genomes) {
            if (err) return res.send(err);

            var getOrganism = function (genome, callback) {
                Organism.findOne({_id: genome.organism}, function (err, org) {
                    if (err) {
                        return res.send(err);
                    } else {
                        genome.organism = org.localName;
                    }
                    callback();
                });
            };

            var returnResult = function () {
                if (err) {
                    return res.send(err);
                }
                res.render('genomes/index', {
                    genomes: genomes
                });
            };


            async.each(genomes, getOrganism, returnResult);
        });
    });

    app.get('/genomes/new', function (req, res) {
        Organism.findAll(function (err, orgs) {
            if (err) return res.send(err);
            return res.render('genomes/new', {
                organisms: orgs
            });
        });

    });

    app.post('/genomes/add', function (req, res) {

        //order: create genome, get its id, add all refs from file, link them to genome by id

        var organism = req.body.organism;
        var description = req.body.description;
        var buildVersion = req.body.buildVersion;
        var meta = req.body.meta;

        var file = req.files.file;

        if (organism && description && buildVersion && meta && file) {

            var genome = new Genome({
                organism: organism,
                description: description,
                buildVersion: buildVersion,
                meta: meta
            });

            genome.save(function (err, gen) {
                if (err) return res.send(err);

                Fasta.read(file.path, function (ref) {
                    var reference = new Reference({
                        name: ref.name, sequence: ref.seq, genome: gen._id
                    });
                    reference.save(function (err, r) {
                        if (err) {
                            return res.send(err);
                        }
                    });
                }, function () {
                    //TODO delete file
                    console.log('finished');
                });
                return res.redirect('/genomes');
            });
        } else {
            return res.send('err');
        }
    });

    app.get('/genomes/show', function (req, res) {
        return res.render('genomes/show')
    });

    app.get('/api/genome/:id', function (req, res) {

        var id = req.param("id");
        var chr = req.query.chr;
        var min = req.query.min;
        var max = req.query.max;

        Reference.find(
            {
                genome: id, name: chr
                //, start: {$gt: min}, end: {$lt: max }
            },
            function (err, genome) {
                if (err) {
                    return console.log('error', err);
                } else {
                    //console.log(genome);
                    console.log('FOUND:', genome.length);
                    console.log(genome);
                    if (genome && genome.length > 0) {
                        var g = genome[0];
                        var seq = g.sequence.substring(min, max);
                        console.log(seq);
                        return res.send(seq);
                    } else {
                        return res.send();
                    }
                }
            });


        console.log('get reference track');
        //res.send();
    });

};