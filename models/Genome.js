var mongoose = require('mongoose');
var Experiment = require('./Experiment');

var genomeSchema = mongoose.Schema({
    organism: {type: String, required: true},
    description: {type: String, required: true},
    name: {type: String, required: true},
    meta: {type: String, required: true},
    createdAt: Date,
    updatedAt: Date
});

genomeSchema.statics.findAll = function search(cb) {
    Genome.find({}).exec(cb);
};


genomeSchema.methods.getExperiments = function (cb) {
    Experiment.find({genome: this._id}).exec(cb);
};

genomeSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

var Genome = mongoose.model('Genome', genomeSchema);

module.exports = Genome;
