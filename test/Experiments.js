var assert = require('chai').assert;

var Experiments = require('../controllers/ExperimentsController');

describe('Experiments', function() {
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so indexOf returns -1
        })
    })
});