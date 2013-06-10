/*
 * cache-breaker
 * https://github.com/shanenew/breaker
 *
 * Copyright (c) 2013 Shane Osbourne
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('cache_breaker', 'Your task description goes here.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    var removePrefixes = function( filename ) {
      return filename.replace( "public", "" );
    };

    var makeNewUrl = function( filename ) {
      return removePrefixes( filename ) + '?rel=' + new Date().getTime();
    };

    var makeRegex = function( url ) {
      return new RegExp( removePrefixes(url) + '(.+)?(?=")' );
    };

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var data    = grunt.file.read( f.src );
      var url     = makeNewUrl( options.filename );
      var regex   = makeRegex( options.filename );
      var newData = data.replace( regex, url );
      var write   = grunt.file.write( f.dest, newData);

      // Print a success message.
      grunt.log.writeln('Asset URL in "' + f.dest + '" has been updated to break the cache.');
    });

  });

};
