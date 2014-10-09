var mongoose = require('mongoose')
var bcrypt = require('bcrypt');
var gravatar = require('gravatar');
var SALT_WORK_FACTOR = 10;
var _ = require('lodash');

var RESERVED_NAMED = ['us', 'about', 'signup', 'signin', 'join', 'wookoouk', 'help'];

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
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
            return cb(null, true)
        }
        return cb(null, false);
    })
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
            return cb(null, false)
        }
        return cb(null, true);

    });
};

userSchema.methods.getGravatar = function (cb) {
    var url = gravatar.url(this.email, {s: '200', r: 'pg', d: '404'});
    console.log(this.email);
    console.log(url);
    cb(url);
};

// Password verification
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = User;