var nodemailer = require('nodemailer');
var utils = require('../lib/util');

module.exports.controller = function (app) {

    var mailConfig = app.appConfig.mail;

    var fromAddress = mailConfig.fromAddress;

    var transporter = nodemailer.createTransport({
        service: mailConfig.service,
        auth: {
            user: mailConfig.auth.user,
            pass: mailConfig.auth.pass
        }
    });

    var createMail = function (to, subject, text, html) {
        var mailOptions = {
            from: fromAddress, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plaintext body
            html: html // html body
        };
        return mailOptions;
    };

    var sendMail = function (mailOptions) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    }

};