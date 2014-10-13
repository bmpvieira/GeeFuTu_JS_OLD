var assert = require('chai').assert;

var Experiments = require('../models/ExperimentsController');

describe('ExperimentsController', function() {
    describe('/', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so indexOf returns -1
        })
    })
    describe('/:username/:organism/experiments', function(){

    });
});

describe('Experiment', function(){

});
