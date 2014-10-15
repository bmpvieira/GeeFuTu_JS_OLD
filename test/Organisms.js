var expect = require('chai').expect;
var should = require('chai').should();
var superagent = require('superagent');

describe('OrganismsController', function () {

    var baseURL = 'http://localhost:8080';

    before(function () {
        var app = require('../index');
    });

    describe('get /bad-user/bad-organism', function () {
        describe('unauthenticated', function () {
            it('should return 200', function (done) {
                superagent
                    .get(baseURL+'/testuser/testorganism')
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });

    describe('get /testuser/testorganism/clone', function () {
        describe('unauthenticated', function () {
            it('should return 200', function (done) {
                superagent
                    .get(baseURL+'/testuser/testorganism/clone')
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });

    describe('get /new', function () {
        describe('unauthenticated', function () {
            it('should return 200', function (done) {
                superagent
                    .get(baseURL+'/new')
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });

    describe('post /new', function () {
        describe('unauthenticated', function () {
            it('should return 200', function (done) {
                superagent
                    .post(baseURL+'/new')
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });

});