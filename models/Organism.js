var mongoose = require('mongoose')

var organismSchema = mongoose.Schema({
    localName: {type: String, required: true},
    description: {type: String, required: true},
    genus: {type: String, required: true},
    species: {type: String, required: true},
    strain: {type: String, required: true},
    pathovar: String,
    ncbi: String,
    createdAt: Date,
    updatedAt: Date
});

organismSchema.statics.findAll = function(cb) {
    //err, findings
    Organism.find({}).exec(cb);
};

organismSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date;
    } else {
        this.updatedAt = new Date;
    }
    next();
});

var Organism = mongoose.model('Organism', organismSchema);

module.exports = Organism;