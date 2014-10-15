var mongoose = require('mongoose');
var BinaryExperimentFile = require('../lib/BinaryExperimentFile');

var experimentSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    file: {type: String, required: true},
    genome: {type: String, required: true},
    meta: String,
    findParents: Boolean,
    createdAt: Date,
    updatedAt: Date
});

experimentSchema.types = Object.freeze({
    GFF3: 'GFF3',
    BAM: 'BAM',
    VCF: 'VCF',
    BigWig: 'BigWig',
    BED: 'BED',
    BigBed: 'BigBed'
});

experimentSchema.statics.findAll = function search(cb) {
    Experiment.find({}).exec(cb);
};

experimentSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date;
    } else {
        this.updatedAt = new Date;
    }
    next();
});

experimentSchema.methods.updateFilePath = function (newPath) {
    this.file = newPath;
    this.save(); //TODO callback!
}

experimentSchema.methods.processFile = function (experiment, cb) {

    switch (this.type) {
        case experimentSchema.types.GFF3:
            GFF.read(this.file, function (feature) {
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
                feat.save(function (err) {
                    if (err) {
                        cb(err);
                    }
                    cb();
                });
            });
            break;
        case experimentSchema.types.BAM:
            BinaryExperimentFile.moveToStorage(this.file, function (err) {
                if (err) {
                    cb(err);
                }
            });
            break;
        case experimentSchema.types.VCF:
            BinaryExperimentFile.moveToStorage(this.file, function (err) {
                if (err) {
                    cb(err);
                }
            });
            break;
        case experimentSchema.types.BigWig:
            BinaryExperimentFile.moveToStorage(this.file, function (err) {
                if (err) {
                    cb(err);
                }
            });
            break;
        case experimentSchema.types.BED:
            BinaryExperimentFile.moveToStorage(this.file, function (err) {
                if (err) {
                    cb(err);
                }
            });
            break;
        case experimentSchema.types.BigBed:
            BinaryExperimentFile.moveToStorage(this.file, function (err) {
                if (err) {
                    cb(err);
                }
            });
            break;
        default:
            cb(new Error('unable to process file, type unknown'));
    }

};

var Experiment = mongoose.model('Experiment', experimentSchema);


module.exports = Experiment;