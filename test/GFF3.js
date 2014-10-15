var expect = require('chai').expect;
var should = require('chai').should();


describe('GFF3', function () {
    var GFF = require('../lib/Gff3');
    var Feature = require('../models/Feature');

    describe('import', function (done) {
        var pathToTestFile = __dirname + '/assets/sample.gff3';
        var featureArray = [];
        var experimentID = 0;
        it('should create array of features', function (done) {

            GFF.read(pathToTestFile, function (feature) {
                var feat = new Feature({
                    seqid: feature.seqid,
                    source: feature.source,
                    type: feature.type,
                    start: feature.start,
                    end: feature.end,
                    score: feature.score,
                    strand: feature.strand,
                    phase: feature.phase,
                    attributes: feature.attributes,
                    experiment: experimentID
                });
                featureArray.push(feat);

            }, function () {
                featureArray.should.be.length(16);
                done();
            });
        });
    });
});