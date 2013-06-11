# grunt-cache-breaker

```js
    // Turn these : 
    <script src="/js/dist/combined.min.js"></script>
    <link href="/css/style.css"></link>

    // Into these :
    <script src="/js/dist/combined.min.js?rel=123456"></script>
    <link href="/css/style.css?rel=123456"></link>
```

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cache-breaker --save-dev
```
Once the plugin has been installed, add this to your Gruntfile.js

    grunt.loadNpmTasks('grunt-cache-breaker');

And then add this to your list of tasks

```js
cachebreaker : {
  js: {
    options: {
      asset_url : '/js/path/to/my/file.js'
    },
    files: {
      'app/destination.html' : 'app/source.html'
    }
  },
}
```
## The "cache_breaker" task
In it's simplest form (seen above), you can use the cache-breaker to replace a fixed url. This will look at the file `app/source.html`, find your `asset_url` within it, & then re-write the entire file to `app/destination.html`

**Alternatively**

If you just want to overwrite the same file (that's how I use it), simply pass the same filepath
```js
cachebreaker : {
  js: {
    options: {
      asset_url : '/js/path/to/my/file.js'
    },
    files: {
      'app/source.html' : 'app/source.html'
    }
  },
}
```

**Options Explained**

`options.asset_url` - this should be EXACTLY as your asset url appears in your html, it's what get replaced!

`files` - destination & source - these are the paths to the html files that hold your asset urls. **Note:** These should be relative to your Gruntfile.js, (not a url like the asset_url)

## A More Realistic Example.
Grunt is all about automating things, so I'd be more inclined to use this as a final step to a build process. The build would generate the filename dynamically and then the timestamp would be tacked on the end. You can imagine a nice setup like this.

```js
js_dir            : 'public/js',
js_deps           : '<%= js_dir %>/dist/deps',
js_all            : '<%= js_dir %>/dist/combined',
js_dist_file      : '<%= js_all %>.clean.min.js', /** build steps would generate this file **/

cachebreaker : {
  js: {
    options: {
      asset_url : '<%= js_dist_file %>', 
      remove    : 'public' 
    },
    files: {
      'app/source.html' : 'app/source.html'
    }
  },
}
```

With this type of setup, you could do something along the lines of this (with the correct config for concat & uglify, of course)

```shell
grunt.registerTask( 'js-build', ['concat:js', 'uglify:js', cachebreaker:js'] );
```

**Note**
Notice how we passed `remove : 'public'` as an option. This is becuase the *public* part of the string was needed for the build step, but it's something that we don't want in the final URL.

## Run
Now you're set up, run the task using this command, or add it to the end of a build task as mentioned above.

    grunt cachebreaker:js

## Works with any URL
I've given JS examples above, but you can easily use it for busting the cache on your css, image files, or anything else.

```js
php_template  : 'app/views/layouts/master.blade.php',
css_dir       : 'public/css',
css_dist_file : '<%= css_dir %>/style.css', /** build steps would generate this file **/

cachebreaker : {
  css: {
    options: {
      asset_url : '<%= css_dist_file %>', 
      remove    : 'public' 
    },
    files: {
      '<%= php_template %>' : '<%= php_template %>'
    }
  },
}
```

```shell
grunt cachebreaker:js
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

