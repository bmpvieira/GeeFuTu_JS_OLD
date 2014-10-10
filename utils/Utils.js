module.exports.controller = function (app) {
    this.checkError = function (res, err) {
        if (err) {
            return res.render('error', {message: err});
        }
    };
};