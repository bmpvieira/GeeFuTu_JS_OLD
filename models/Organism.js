var mongoose = require('mongoose');
var _ = require('lodash');
var Genome = require('./Genome');

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
    admins: [String],
    readme: {type: String, default: ''}
});

organismSchema.statics.findByUserAndLocalName = function (user, local, cb) {
    Organism.findOne({
        owner: user.username,
        localName: local
    }).exec(cb);
};

organismSchema.statics.checkIsExistsByLocalName = function (localName, cb) {
    Organism.findOne({localName: localName.toLowerCase()}, function (err, org) {
        if (err) {
            return cb(err);
        }
        if (org) {
            return cb(null, true);
        }
        return cb(null, false);
    });
};

organismSchema.statics.findByUser = function (user, cb) {
    Organism.find({
        $or: [
            {owner: user.username},
            {viewers: user.username},
            {editors: user.username},
            {admins: user.username}
        ]
    }).exec(cb);
};

organismSchema.methods.getGenomes = function (cb) {
    Genome.find({organism: this._id}).exec(cb);
};

organismSchema.methods.getGenomeByName = function (name, cb) {
//    console.log('looking for', name);
    Genome.findOne({organism: this._id, name: name}).exec(cb);

};


organismSchema.methods.canView = function (user, cb) {

    var username = user.username;
    cb(this.owner == username || _.contains(this.viewers, username) || _.contains(this.editors, username) || _.containes(this.admins, username)); //callback with result of checks
};

organismSchema.methods.canEdit = function (user, cb) {
    var username = user.username;
    cb(this.owner == username || _.contains(this.editors, username) || _.containes(this.admins, username)); //callback with result of checks
};

organismSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

var Organism = mongoose.model('Organism', organismSchema);

module.exports = Organism;
