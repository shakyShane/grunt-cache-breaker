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
                    match: ['script.js', 'app.js'],
                    replacement: function () {
                        return "123456";
                    }
                },
                files: {
                    'test/fixtures/query.out.html': ["test/fixtures/query.html"]
                }
            },
            md5: {
                options: {
                    replacement: "md5",
                    match: [
                        {
                            'script.js': 'test/fixtures/js/script.js',
                            'app.js':    'test/fixtures/js/app.js'
                        }
                    ]
                },
                files: {
                    'test/fixtures/md5.out.html': ["test/fixtures/query.html"]
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
        'cachebreaker',
        'nodeunit:tests'
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
