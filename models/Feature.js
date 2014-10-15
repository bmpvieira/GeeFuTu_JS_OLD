var mongoose = require('mongoose');

var featureSchema = mongoose.Schema({
    seqid: {type: String, required: true},
    source: {type: String, required: true},
    type: {type: String, required: true},
    start: {type: String, required: true},
    end: {type: String, required: true},
    score: {type: String, required: true},
    strand: {type: String, required: true},
    phase: {type: String, required: true},
    attributes: {type: String, required: true},
    experiment: {type: String, required: true},
    createdAt: Date,
    updatedAt: Date
});
//
//featureSchema.statics.findAll = function search(cb) {
//    Organism.find({}).exec(cb);
//};
//
//featureSchema.virtual('processedUsers').get(function(){
//
//}).set(function(progessedUsers){
//    this.set('processedUsers', processedUsers)
//});
//
//featureSchema.methods.getUsers = function (cb) {
//    var User = require('./user');
////    console.log('looking for: ' + this.users);
//    User.find({'_id': {
//        $in: this.users
//    }}).exec(cb);
//};
//
featureSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

var Feature = mongoose.model('Feature', featureSchema);

module.exports = Feature;
