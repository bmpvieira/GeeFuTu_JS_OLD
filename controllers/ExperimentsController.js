var Experiment = require('../models/Experiment');
var Genome = require('../models/Genome');
var GFF = require('../lib/gff3');
var Feature = require('../models/Feature');
var async = require('async');

module.exports.controller = function (app) {

    app.get('/experiments', function (req, res) {
        Experiment.findAll(function (err, experiments) {
            if (err) return res.send(err);

            var getGenome = function (experiment, callback) {
                Genome.findOne({_id: experiment.genome}, function (err, gen) {
                    if (err) {
                        console.log(err);
                    } else {
                        experiment.genome = gen.buildVersion;
                    }
                    callback();
                });
            };
            var returnResult = function () {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                res.render('experiments/index', {
                    experiments: experiments
                });
            };
            async.each(experiments, getGenome, returnResult);
        });
    });

    app.get('/experiments/new', function (req, res) {
        Genome.findAll(function (err, gens) {
            if (err) return res.send(err);
            return res.render('experiments/new', {
                genomes: gens
            });
        });
    });

    app.post('/experiments/add', function (req, res) {

        var name = req.body.name;
        var description = req.body.description;
        var genome = req.body.genome;
        var meta = req.body.meta;
        var file = req.files.file;
        var findParents = req.body.findParents;

        var experiment = new Experiment({
            name: name,
            description: description,
            file: file.path,
            genome: genome,
            meta: meta,
            findParents: findParents
        });

        experiment.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                console.log('saved experiment');
            }
        });

        GFF.read(file.path, function (feature) {
            var feat = new Feature({
                seqid: feature.seqid,
                source: feature.source,
                type: feature.type,
                start: feature.start,
                end: feature.end,
                score: feature.score,
                strand: feature.strand,
                phase: feature.phase,
                attributes: feature.attributes,
                experiment: experiment._id
            });

            feat.save(function (err, r) {
                if (err) {
                    return res.send(err);
                }
            });
        });
        return res.redirect('/experiments');
    });

    app.get('/experiments/:id', function (req, res) {
        var id = req.param("id");
        var genome = null;

        Experiment.findOne({_id: id}, function (err, experiment) {
            if (err) {
                res.send(err);
            } else {
                Genome.findOne({_id: experiment.genome}, function (err, genome) {
                    if (err) {
                        return res.send(err);
                    } else {
                        return res.render('experiments/show', {experiment: experiment, genome: genome});
                    }
                });
            }
        });
    });

    app.get('/api/experiments', function (req, res) {
        Experiment.findAll(function (err, experiments) {
            if (err) {
                res.send('error');
            }
            res.send(experiments);
        });
    });


    app.get('/api/experiments/:id', function (req, res) {
        var id = req.param("id");
        var chr = req.query.chr;
        var min = req.query.min;
        var max = req.query.max;
        Feature.find(
            {experiment: id, seqid: chr, start: {$gt: min}, end: {$lt: max}},
            function (err, features) {
                if (err) {
                    console.log('error', err);
                } else {
                    return res.send(features);
                }
            });
    });

};
