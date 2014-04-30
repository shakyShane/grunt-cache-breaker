"use strict";

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

            f.src
                .forEach(function (filepath) {

                    var dest = filepath;

                    if (f.dest && f.dest !== "src") {
                        dest = f.dest;
                    }

                    var input = grunt.file.read(filepath);
                    var broken = cb.breakCache(input, options.match, options);

                    if (broken.length) {
                        grunt.log.ok("Cache broken in: " + filepath.cyan);
                        grunt.file.write(dest, broken);
                    } else {
                        return grunt.fail.warn("No changes were made.");
                    }
                });
        });
    });
};
