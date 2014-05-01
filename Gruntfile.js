/*
 * grunt-cache-breaker
 * https://github.com/shakyshane/grunt-cache-breaker
 *
 * Copyright (c) 2013 Shane Osbourne
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        js_dir: 'public/js',
        js_dist: '<%= js_dir %>/dist/combined',
        js_dist_file: '<%= js_dist %>.min.js',
        css_dir: 'public/css',
        css_dist_file: '<%= css_dir %>/style.css',
        js_src: 'test/fixtures/js',
        js_src_error: 'test/fixtures/js_error',
        css_src: 'test/fixtures/css',
        js_dest: 'tmp/js',
        js_dest_error: 'tmp/js_error',
        css_dest: 'tmp/css',
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
                options: {
                    match: ['combined.min.js', 'app.js'],
                    replacement: function () {
                        return "123456";
                    }
                },
                files: {
                    '<%= js_dest %>': '<%= js_src %>'
                }
            },
            jsmd52: {
                options: {
                    match: ['dummy.*.js', 'combined.min.*.js'],
                    replacement: "md5",
                    position: "overwrite",
                    src: {
                        path: "./LICENSE-MIT"
                    }
                },
                files: {
                    'tmp/jsmd5': 'test/fixtures/jsmd5'
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
            methods: ['test/cache_breaker_methods_test.js']
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
        'cachebreaker:jsmd52',
        'nodeunit:tests'
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
