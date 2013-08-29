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

    // move js, css, js_error from fixtures into tmp/
    // as it's not done for us, i guess the dest:src is broken
    // in the task config.files
    var files = ['js', 'css', 'js_version' ];
    grunt.file.mkdir('tmp');
    files.forEach(function(f) {
      grunt.file.copy('test/fixtures/'+f, 'tmp/'+f);
    });

    done();
  },
  task: function(test) {

    var types = ['js', 'css', 'js_version' ];

    test.expect(types.length);

    types.forEach(function(item){

      var actual = grunt.file.read( 'tmp/' + item );
      var expected = grunt.file.read( 'test/expected/' + item );

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
