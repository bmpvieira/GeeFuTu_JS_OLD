var assert = require('chai').assert;
var foo = 'bar';
var beverages = {tea: ['chai', 'matcha', 'oolong']};


describe('Fake Test', function () {
    describe('#FirstTest()', function () {
        assert.typeOf(foo, 'string', 'foo is a string');
        assert.equal(foo, 'bar', 'foo equal `bar`');
        assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
        assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
    })
});