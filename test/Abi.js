var should = require('chai').should();
var expect = require('chai').expect;
var ABI = require('../lib/abi');
var _ = require('lodash');

var validFile = __dirname + '/assets/ABI01.abi';

describe('Abi', function () {

    var abi = null;

    describe('read', function () {

        var entryDir = {
            name: 'tdir',
            number: 1,
            elementType: 1023,
            elementSize: 28,
            numElements: 73,
            dataSize: 2240,
            dataOffset: 142395,
            dataHandle: 52273108
        };

        it('should create new ABI', function (done) {
            abi = new ABI(validFile);
            done();
        });

        it('should have valid header', function (done) {
            abi.checkHeader(done);
        });

        it('should have a version eq 101', function (done) {
            var cb = function (err, data) {
                expect(err).to.eq(null);
                data.should.eq(101);
                done();
            };
            abi.version(cb);
        });

        it('should have a valid entry directory', function (done) {

            var cb = function (err, data) {
                expect(err).to.eq(null);
                _.isEqual(data, entryDir).should.eq(true);
                done();
            };

            abi.entryDirectory(cb);
        });

        it('should return array of directories', function (done) {

            var cb = function (err, data) {
                expect(err).to.eq(null);
                data.should.have.length(entryDir.numElements);
                done();
            };
            abi.getDirectories(entryDir, cb);
        });
    });
});