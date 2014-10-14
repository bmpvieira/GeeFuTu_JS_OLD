var expect = require('chai').expect;
var should = require('chai').should();
var superagent = require('superagent');

describe('ExperimentsController', function () {

    before(function () {
        //start the server first
        var app = require('../index');
    });


    describe('get /', function () {
        it('should not get an error', function (done) {
            superagent.get('http://localhost:8080/')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    done();
                });
        });
        it('have a 200 response', function (done) {
            superagent.get('http://localhost:8080/')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    res.status.should.eq(200);
                    done();
                });
        });
    });

    describe('get /us', function () {

        it('should not get an error', function (done) {
            superagent.get('http://localhost:8080/us')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    done();
                });
        });
        it('have a 200 response', function (done) {
            superagent.get('http://localhost:8080/us')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    res.status.should.eq(200);
                    done();
                });
        });

    });
});
