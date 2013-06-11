/*
 * cache-breaker
 * https://github.com/shanenew/breaker
 *
 * Copyright (c) 2013 Shane Osbourne
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Strip unwanted path info from the start of a string
 * @param {String} filename
 * @param {String} prefix
 * @returns {String}
 */
var removePrefixes = function( filename, prefix ) {
  return filename.replace( prefix, "" );
};

/**
 * Append a timestamp to a string
 * @param {String} filename
 * @returns {String}
 */
var makeNewUrl = function( filename ) {
  return (filename + '?rel=' + new Date().getTime());
};

/**
 * Make a regular expression that matched a string up until the closing ["]
 * @param {String} string
 * @returns {RegExp}
 */
var makeTagRegex = function( string ) {
  return new RegExp( string + '(.+)?(?=")' );
};

var msgs = {
  success : function(path){
    return 'Asset URL in "' + path + '" has been updated to break the cache.';
  },
  errors : {
    string       : 'Could not find the asset url to replace',
    file_write   : 'Could not write the file!',
    file_find    : 'Could not find the source file for this task!'
  }
};

module.exports = function(grunt) {

  /**
   *
   * @param {object} options
   * @param f
   * @returns {string}
   */
  var breakCache = function( options, f ) {

    var data = grunt.file.read( f.src );

    var cleanUrl   = removePrefixes( options.asset_url, options.remove ),
          regex    = makeTagRegex( cleanUrl ),
          url      = makeNewUrl( cleanUrl ),
          match    = data.match( regex ),
          newData, write;

      if ( match !== null ) {
        newData  = data.replace( regex, url );
        write    = grunt.file.write( f.dest, newData );
        if ( write ) {
          return grunt.log.success( msgs.success( f.dest ) );
        } else {
          return grunt.log.error( msgs.errors.file_write );
        }
      } else {
        return grunt.log.error( msgs.errors.string );
      }

  };

  grunt.registerMultiTask('cachebreaker', 'Add a timestamp to a url string', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        remove : 'app' // default
    });

    // Iterate over all specified file groups.
    this.files.forEach( function(f) {

      if( typeof f.src[0] !== 'undefined' ) {
        return breakCache( options, f );
      } else {
        return grunt.log.error( msgs.errors.file_find );
      }

    });

  });

};

module.exports.removePrefixes  = removePrefixes;
module.exports.makeNewUrl      = makeNewUrl;
module.exports.makeTagRegex    = makeTagRegex;