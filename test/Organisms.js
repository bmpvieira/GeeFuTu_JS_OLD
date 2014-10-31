//var expect = require('chai').expect;
var should = require('chai').should();
var superagent = require('superagent');

var baseURL = 'http://localhost:8080';

describe('OrganismsController', function () {

    before(function () {
        var app = require('../app');
    });

    describe('get /bad-user/bad-organism', function () {
        describe('unauthenticated', function () {
            it('should return 404', function (done) {
                superagent
                    .get(baseURL + '/testuser/testorganism')
                    .end(function (e, res) {
                        should.not.exist(e);
                        res.status.should.eq(404);
                        done();
                    });
            });
        });
    });

    describe('get /bad-user/bad-organism/clone', function () {
        describe('unauthenticated', function () {
            it('should redirect', function (done) {
                var redirected = false;
                superagent
                    .get(baseURL + '/testuser/testorganism/clone')
                    .on('redirect', function (res) {
                        redirected = true;
                    })
                    .end(function (e, res) {
                        should.not.exist(e);
                        res.status.should.eq(200);
                        redirected.should.eq(true);
                        done();
                    });
            });
        });
    });

    describe('get /new', function () {
        describe('unauthenticated', function () {
            it('should redirect', function (done) {
                var redirected = false;
                superagent
                    .get(baseURL + '/new')
                    .on('redirect', function (res) {
                        redirected = true;
                    })
                    .end(function (e, res) {
                        should.not.exist(e);
                        res.status.should.eq(200);
                        redirected.should.eq(true);
                        done();
                    });
            });
        });
    });

    describe('post /new', function () {

        var newOrg = {
            description: 'test',
            genus: 'test',
            species: 'test',
            strain: 'test',
            pathovar: 'test',
            ncbi: 'test',
            hidden: 'test'
        };

        describe('unauthenticated', function () {
            it('should return 200', function (done) {
                //TODO test for redirect to /signin
                superagent
                    .post(baseURL + '/new')
                    .send(newOrg)
                    .end(function (e, res) {
                        should.not.exist(e);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });

});
