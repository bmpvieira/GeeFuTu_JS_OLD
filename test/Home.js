var expect = require('chai').expect;
var should = require('chai').should();
var superagent = require('superagent');

describe('ExperimentsController', function () {

    before(function () {
        var app = require('../index');
    });


    describe('get /', function () {
        describe('unauthenticated', function () {
            it('should return 200', function (done) {
                superagent
                    .get('http://localhost:8080/')
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        res.status.should.eq(200);
                        done();
                    });
            });
        });
    });

    describe('get /us', function () {
        it('should return 200', function (done) {
            superagent
                .get('http://localhost:8080/us')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    res.status.should.eq(200);
                    done();
                });
        });
    });
})
;
