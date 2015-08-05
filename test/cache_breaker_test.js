'use strict';

var grunt = require('grunt');

var log = function (msg) {
    console.log('\n\n' + msg + '\n');
};
/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.cache_breaker = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    task: function (test) {

        var types = ['query', 'md5'];

        test.expect(types.length);

        types.forEach(function (item) {

            var out      = 'test/fixtures/' + item + '.out.html';
            var actual   = grunt.file.read(out);
            var expected = grunt.file.read('test/fixtures/' + item + '.expected.html');

            grunt.file.delete(out);
            test.deepEqual(actual, expected);
        });

        test.done();
    }
};
