'use strict';

var cacheBreaker = require( '../tasks/cache_breaker.js' );
var testMethods = require( './test_methods.js' );

exports.tests = {
  setUp : function(done){
    this.startString = '/js/combined.min.js';
    done();
  },
  removePrefixes : function(test){
    test.expect( 1 );

    /** remove Prefixes **/
    var input = 'public/js/combined.min.js';
    var actual   = cacheBreaker.removePrefixes(input, 'public');
    var expected = '/js/combined.min.js';
    test.equal( actual, expected );
    test.done();
  },
  makeNewUrl : function(test){
    test.expect(1);

    /** Make new URL **/
    var actual = cacheBreaker.makeNewUrl( this.startString );
    var newone = testMethods.testContainsRel( actual, null );

    test.notEqual( newone, null );
    test.done();
  }

};