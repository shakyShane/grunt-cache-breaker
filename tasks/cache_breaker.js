"use strict";
var cloneDeep = require("lodash.clonedeep");

module.exports = function (grunt) {

    grunt.registerMultiTask("cachebreaker", "Rewrite links with timestamps or hashes", function () {

        var options = this.options();

        if (!options.match) {
            return grunt.fail.warn("You must provide the 'match' option");
        }

        var cb = require("cache-breaker");

        this.files.forEach(function (f) {

            if (!f.src.length) {
                return grunt.fail.warn("No source files were found.");
            }

            f.src.forEach(function (filepath) {

                var dest = filepath;

                if (f.dest && f.dest !== "src") {
                    dest = f.dest;
                }

                var input  = grunt.file.read(filepath);

                if (options.replacement === "md5") {
                    options.match.forEach(function (item) {
                        if (typeof item === "string") {
                            input = cb.breakCache(input, item, options);
                        } else {
                            var clone = cloneDeep(options);
                            Object.keys(item).forEach(function (key) {
                                clone.src = {
                                    path: item[key]
                                };
                                input = cb.breakCache(input, key, clone);
                            });
                        }
                    });
                } else {
                    input = cb.breakCache(input, options.match, options);
                }

                if (input.length) {
                    grunt.log.ok("Cache broken in: " + filepath.cyan);
                    grunt.file.write(dest, input);
                } else {
                    return grunt.fail.warn("No changes were made.");
                }
            });
        });
    });
};
