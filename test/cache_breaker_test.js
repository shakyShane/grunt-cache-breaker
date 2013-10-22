'use strict';

var grunt = require('grunt');
var testMethods = require('./test_methods.js');

var log = function(msg) {
  console.log ('\n\n' + msg + '\n');
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
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  task: function(test) {

    var types = ['js', 'css', 'img', 'js_with_existing'];

    test.expect(types.length);

    types.forEach(function(item){

      var actual = grunt.file.read( 'tmp/' + item );
      test.notEqual( testMethods.testContainsRel( actual, '"' ), null );

    });

    test.done();
  },
  errors : function(test) {
    test.expect( 1 );

    // Error should be thrown
    // No file should be overwritten/written
    var fileExists = grunt.file.exists( 'tmp/js_error' );
    test.equal( fileExists, false );

    test.done();
  }
};
