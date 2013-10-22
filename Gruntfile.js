/*
 * grunt-cache-breaker
 * https://github.com/shakyshane/grunt-cache-breaker
 *
 * Copyright (c) 2013 Shane Osbourne
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    js_dir        : 'public/js',
    js_dist       : '<%= js_dir %>/dist/combined',
    js_dist_file  : '<%= js_dist %>.min.js',
    css_dir       : 'public/css',
    css_dist_file : '<%= css_dir %>/style.css',
    js_src        : 'test/fixtures/js',
    js_src_error  : 'test/fixtures/js_error',
    js_src_version  : 'test/fixtures/js_version',
    css_src       : 'test/fixtures/css',
    js_dest       : 'tmp/js',
    js_dest_error : 'tmp/js_error',
    css_dest      : 'tmp/css',
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // The task
    cachebreaker: {

      js: {
        asset_url : '<%= js_dist_file %>',
        files: {
          '<%= js_dest %>' : '<%= js_src %>'
        },
        options: {
          remove   : 'public'
        }
      },
      js_src_error : {
        asset_url : '<%= js_dist_file %>',
        files : {
          '<%= js_dest_error %>' : 'test/fixtures/js_file_error' /** source file error **/
        },
        options : {
          remove   : 'public'
        }
      },
      js_asset_error : {
        asset_url : '/asset/url/incorrect', /** asset url is incorrect **/
        files   : {
          '<%= js_dest_error %>' : 'test/fixtures/js_error'
        },
        options : {
          remove   : 'public'
        }
      },
      css : {
        asset_url : '<%= css_dist_file %>',
        files   : {
          '<%= css_dest %>' : '<%= css_src %>'
        },
        options : {
          remove   : 'public'
        }
      },
      js_version: {
        options: {
          remove: 'public',
          tag: '_v1.0.0_',
          ext: 'js'
        },
        asset_url: '<%= js_dist_file %>',
        files: {
          src: '<%= js_src_version %>'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
      methods : ['test/cache_breaker_methods_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'cachebreaker:js',
    'cachebreaker:css',
    'cachebreaker:js_asset_error',
    'cachebreaker:js_version',
    'nodeunit:tests'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
