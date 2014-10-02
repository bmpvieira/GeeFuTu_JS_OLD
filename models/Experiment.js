var mongoose = require('mongoose');

var experimentSchema = mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    file: { type: String, required: true},
    genome: { type: String, required: true},
    meta: String,
    findParents: Boolean,
    createdAt: Date,
    updatedAt: Date
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

var Experiment = mongoose.model('Experiment', experimentSchema);

module.exports = Experiment;