var Experiment = require('../models/Experiment');
var Genome = require('../models/Genome');
// var GFF = require('../lib/Gff3');
// var Feature = require('../models/Feature');
var AuthController = require('./AuthController');
var Util = require('../lib/util');

module.exports.controller = function (app) {

    app.get('/:username/:organism/experiments', function (req, res) {

        //var username = req.param("username").toLowerCase();
        //var organism = req.param("organism").toLowerCase();

        res.send('TODO');
    });

    app.get('/:username/:organism/experiments/add', AuthController.isAuthenticated, function (req, res) {
        Genome.findAll(function (err, gens) {
            if (err) {
                return Util.renderError(res, err);
            }
            return res.render('experiments/new', {
                genomes: gens
            });
        });
    });

    app.post('/:username/:organism/experiments/add', AuthController.isAuthenticated, function (req, res) {


        var name = req.body.name;
        var description = req.body.description;
        var genome = req.body.genome;
        var meta = req.body.meta;
        var file = req.files.file;
        var findParents = req.body.findParents;
        var type = req.body.type;

        var experiment = new Experiment({
            name: name,
            description: description,
            file: file.path,
            genome: genome,
            meta: meta,
            findParents: findParents,
            type: type
        });

        experiment.save(function (err) {
            if (err) {
                return Util.renderError(res, err);
            } else {
                //console.log('saved experiment');
            }
        });

        //TODO where to put this?

        experiment.processFile(experiment, function (err) {
            if(err){
                return Util.renderError(res, err);
            }
            return res.redirect('/experiments');
        });

        //GFF.read(file.path, function (feature) {
        //    var feat = new Feature({
        //        seqid: feature.seqid,
        //        source: feature.source,
        //        type: feature.type,
        //        start: feature.start,
        //        end: feature.end,
        //        score: feature.score,
        //        strand: feature.strand,
        //        phase: feature.phase,
        //        attributes: feature.attributes,
        //        experiment: experiment._id
        //    });
        //
        //    feat.save(function (err) {
        //        if (err) {
        //            return Util.renderError(res, err);
        //        }
        //    });
        //});
        //return res.redirect('/experiments');
    });

    app.get('/:username/:organism/experiments/:id', function (req, res) {
        var id = req.param("id");
        //var genome = null;

        Experiment.findOne({_id: id}, function (err, experiment) {
            if (err) {
                return Util.renderError(res, err);
            } else {
                Genome.findOne({_id: experiment.genome}, function (err, genome) {
                    if (err) {
                        return Util.renderError(res, err);
                    } else {
                        return res.render('experiments/show', {experiment: experiment, genome: genome});
                    }
                });
            }
        });
    });

};
