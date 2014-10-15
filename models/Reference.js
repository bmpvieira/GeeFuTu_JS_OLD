var mongoose = require('mongoose');

var referenceSchema = mongoose.Schema({
    name: {type: String, required: true},
    sequence: {type: String, required: true},
    genome: {type: String, required: true},
    createdAt: Date,
    updatedAt: Date
});

referenceSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

var Reference = mongoose.model('Reference', referenceSchema);

module.exports = Reference;
