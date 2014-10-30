//var expect = require('chai').expect;
var should = require('chai').should();
var superagent = require('superagent');

var baseURL = 'http://localhost:8080';

describe('IndexController', function () {

    before(function () {
        var app = require('../index');
    });


    describe('get /', function () {
        describe('unauthenticated', function () {
            it('should return 200', function (done) {
                superagent
                    .get(baseURL + '/')
                    .end(function (e, res) {
                        should.not.exist(e);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });

    describe('get /us', function () {
        describe('unauthenticated', function () {
            it('should return 200', function (done) {
                superagent
                    .get(baseURL + '/us')
                    .end(function (e, res) {
                        should.not.exist(e);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });
});
