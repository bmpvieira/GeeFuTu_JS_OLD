//var expect = require('chai').expect;
var should = require('chai').should();
var superagent = require('superagent');

var baseURL = 'http://localhost:8080';

var testUser = {
    username: 'test',
    password: 'testuserpass',
    confirmpassword: 'testuserpass',
    email: 'test@example.org'
};

describe('AuthController', function () {



    before(function () {
        var app = require('../app');

    });

    after(function () {
        var User = require('../models/User');
        User.findOne({username: testUser.username, email: testUser.email}, function (err, testUser) {
            if (err) {
                console.log(err);
            }
            testUser.remove();
        })
    })

    describe('get /signup', function () {
        it('should return 200', function (done) {
            superagent
                .get(baseURL + '/signup')
                .end(function (e, res) {
                    should.not.exist(e);
                    res.status.should.eq(200);
                    done();
                });
        });
    });

    describe('post /signup', function () {
        it('should return 200', function (done) {
            superagent
                .post(baseURL + '/signup')
                .send({
                    username: testUser.username,
                    password: testUser.password,
                    email: testUser.email
                })
                .end(function (e, res) {
                    should.not.exist(e);
                    res.status.should.eq(200);
                    done();
                });
        });
    });

    describe('post /join', function () {
        var User = require('../models/User');
        it('should create new user', function (done) {
            superagent
                .post(baseURL + '/join')
                .send({
                    username: testUser.username,
                    password: testUser.password,
                    confirmpassword: testUser.confirmpassword,
                    email: testUser.email
                })
                .end(function (e, res) {

                    should.not.exist(e);
                    res.status.should.eq(200);

                    //TODO check mongo for user
                    User.findOne({username: testUser.username, email: testUser.email}, function (err, user) {

                        if (err) {
                            should.not.exist(e);
                        }
                        should.exist(user);
                        done();
                    });
                });
        });
    });

    describe('post /signout', function () {
        //TODO
    });

    describe('get /signin', function () {
        it('should return 200', function (done) {
            superagent
                .get(baseURL + '/signin')
                .end(function (e, res) {
                    should.not.exist(e);
                    res.status.should.eq(200);
                    done();
                });
        });
    });

    describe('post /signin', function () {
        describe('bad cridentials', function () {
            it('should not signin', function (done) {
                var redirected = false;
                superagent
                    .post(baseURL + '/signin')
                    .send({
                        username: testUser.username,
                        password: testUser.password
                    })
                    .on('redirect', function (res) {
                        redirected = true;
                    })
                    .end(function (e, res) {
                        should.not.exist(e);
                        redirected.should.eq(true);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
        describe('good cridentials', function () {
            it('should signin', function (done) {
                var redirected = false;
                superagent
                    .post(baseURL + '/signin')
                    .send({
                        username: testUser.username,
                        password: testUser.password
                    })
                    .on('redirect', function (res) {
                        redirected = true;
                    })
                    .end(function (e, res) {
                        should.not.exist(e);
                        redirected.should.eq(true);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });


});
