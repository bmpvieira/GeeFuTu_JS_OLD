var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var gravatar = require('gravatar');
var SALT_WORK_FACTOR = 10;
var _ = require('lodash');

var RESERVED_NAMED = ['us', 'about', 'signup', 'signin', 'join', 'help'];

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    gravatarURL: {type: String, default: ''},
    createdAt: Date,
    updatedAt: Date
});

var getGravatarURL = function (cb) {
    var url = gravatar.url(this.email, {s: '200'});
    cb(url);
};


userSchema.pre('save', function (next) {

    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }

    var user = this;

    getGravatarURL(function (url) {
        user.gravatarURL = url;

        if (!user.isModified('password')) {
            return next()
        }
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    });
});


userSchema.statics.getUserByUsername = function (username, cb) {
    User.findOne({username: username.toLowerCase()}).exec(cb);
};

userSchema.statics.emailAddressInUse = function (email, cb) {

    User.findOne({email: email}, function (err, user) {

        if (err) {
            return cb(err);
        }
        if (user) {
            return cb(null, true);
        }
        return cb(null, false);
    });
};

userSchema.statics.canHaveUsername = function (username, cb) {


    if (_.contains(RESERVED_NAMED, username.toLowerCase())) {
        var err = new Error(username + ' is reserved. Sorry.');
        return cb(err);
    }
    User.getUserByUsername(username, function (err, user) {

        if (err) {
            return cb(err);
        }
        if (user) {
            return cb(null, false);
        }
        return cb(null, true);

    });
};

userSchema.methods.getGravatarUrl = getGravatarURL;

// Password verification
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
