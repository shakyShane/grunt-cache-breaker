/*
 * cache-breaker
 * https://github.com/shanenew/breaker
 *
 * Copyright (c) 2013 Shane Osbourne
 * Licensed under the MIT license.
 */

'use strict';

/**

Usage :

  cachebreaker : {
    css : {
      asset_url : '/asset/url.min.js',
      files : {
        src : ['path/1.php', 'path/1.html']
      }
    },
  }
  cachebreaker : {
    css : {
      asset_url : '/asset/url.min.js',
      files : {
        src : 'path/to/single/file.html'
      }
    },
  }
  cachebreaker : {
    css : {
      asset_url : '/asset/url.min.js',
      file : 'path/to/single/file.html'
    },
  }

 */


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
    string       : function(path) {
      return 'Found the file: "' + path + '", but I couldn\'t find the Asset Url to replace in it. Please check your config.' ;
    },
    file_write   : 'Could not write the file!',
    file_find    : 'Could not find the source file for this task! ( Tip : the path to this file should be RELATIVE to Grunt.js )',
    config : function(prop) {
     return  'Sorry, your config is invalid. Please ensure you provide the `'+prop+'` property';
    },
    generic : 'Sorry, there was an unknown problem. Check all your config properties.'
  }
};

module.exports = function(grunt) {

  /**
   * Console.log an error - nicer than exceptions in command line
   * @param {string} msg
   * @returns {*}
   */
  var e = function( msg ) {
    return grunt.log.error( 'Error : '.red + msg.yellow );
  };

  /**
   * Console.log an error
   * @param { string } msg
   * @returns {*}
   */
  var s = function( msg ) {
    return grunt.log.success( 'Success : '.green + msg.cyan );
  };

  /**
   * @param {string} src
   * @param {string} dest
   * @param {object} options
   * @returns {*}
   */
  var processFile = function( src, dest, options ) {

    if( grunt.file.exists( src ) ) {
      return ( breakCache( options, { src : src, dest : dest } ) );
    } else {
      return e( msgs.errors.file_find );
    }

  };

  /**
   * @param {object} options
   * @param {grunt.file} f
   * @returns {string}
   */
  var breakCache = function( options, f ) {

    var data = grunt.file.read( f.src );
    var cleanUrl   = removePrefixes( options.asset_url, options.remove ),
          regex    = makeTagRegex( cleanUrl ),
          url      = makeNewUrl( cleanUrl ),
          match    = data.match( regex ),
          newData;

      if ( match !== null ) {
        newData  = data.replace( regex, url );
        if ( grunt.file.write( f.dest, newData ) ) {
          return s( msgs.success( f.src ) );
        } else {
          return e( msgs.errors.file_write );
        }
      } else {
        return e( msgs.errors.string( f.src ) );
      }

  };

  grunt.registerMultiTask('cachebreaker', 'Add a timestamp to a url string', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        remove : 'app' // default
    });

    if( !this.data.asset_url ) {
      return e( msgs.errors.config('asset_url') );
    }

    if( !this.data.file && this.files.length < 1) {
      return e( msgs.errors.config('file or files') );
    }

    // Make asset_url always availble to options.
    options.asset_url = this.data.asset_url;

    // An array passed to [file]
    if ( Array.isArray(this.data.file) ) {
      return this.data.file.forEach( function( path ) {
        return processFile( path, path, options );
      });
    }

    // A String passed to [file]
    if ( typeof this.data.file === 'string' ) {
      return processFile( this.data.file, this.data.file, options);
    }

//    If an array of files specified
//    Note : Not using this.files to allow an easier syntax in the config.
//    Pull request submitted to Grunt to allow source-only file arrays
    if ( this.files ) {
      return this.files.forEach(function(f) {
        if( f.src instanceof Array ) {
          return f.src.forEach(function(fv) {
            return processFile( fv, f.dest,  options );
          });
        }
        return processFile( f.src[0], f.dest,  options );
      });
    }

    // Error if this point is reached.
    return e( msgs.errors.generic );

  });
};

module.exports.removePrefixes  = removePrefixes;
module.exports.makeNewUrl      = makeNewUrl;
module.exports.makeTagRegex    = makeTagRegex;