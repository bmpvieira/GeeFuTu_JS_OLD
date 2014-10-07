var mongoose = require('mongoose');
var _ = require('lodash');

var organismSchema = mongoose.Schema({
    localName: {type: String, required: true},
    description: {type: String, required: true},
    genus: {type: String, required: true},
    species: {type: String, required: true},
    strain: {type: String, required: true},
    pathovar: String,
    ncbi: String,
    createdAt: Date,
    updatedAt: Date,
    owner: {type: String, required: true},
    hidden: Boolean,
    viewers: [String],
    editors: [String],
    admins: [String]
});

organismSchema.statics.findByUserAndLocal = function (user, local, cb) {

    console.log(user);

    Organism.findOne({
        owner: user._id,
        localName: local
    }).exec(cb);

};

organismSchema.statics.findByUser = function (user, cb) {
    Organism.find({
        $or: [
            {owner: user},
            {viewers: user},
            {editors: user},
            {admins: user}
        ]
    }).exec(cb);
};

organismSchema.methods.canView = function (user, cb) {

    var userID = user._id;

    console.log('user id',userID);

    cb(this.owner == userID || _.contains(this.viewers, userID) || _.contains(this.editors, userID) || _.containes(this.admins, userID)); //callback with result of checks
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