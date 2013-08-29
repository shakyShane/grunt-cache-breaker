# grunt-cache-breaker


    // Turn these :
    <script src="/js/dist/combined.min.js"></script>
    <link href="/css/style.css"></link>

    // Into these :
    <script src="/js/dist/combined.min.js?rel=123456"></script>
    <link href="/css/style.css?rel=123456"></link>

    // Or these :
    <script src="/js/dist/combined.min_v1.2.3_.js"></script>
    <link href="/css/style_v1.2.3_.css"></link>

    // Or these :
    <script src="/js/dist/combined.min.js?rel=v1.2.3"></script>
    <link href="/css/style.css?rel=1.2.3"></link>


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cache-breaker --save-dev
```
Once the plugin has been installed, add this to your Gruntfile.js

    grunt.loadNpmTasks('grunt-cache-breaker');

And then add one of the following to your list of tasks

```js
// Single file
cachebreaker : {
    js: {
      asset_url : '/js/dist/combined.min.js',
      files: {
        src : 'app/views/layout/master.html'
      },
    },
}
```
```js
// Array of single files
cachebreaker : {
    js: {
      asset_url : '/js/dist/combined.min.js',
      files: {
        src : ['app/views/layout/master.html', 'app/views/account.php']
      },
    },
}
```
```js
// Multiple files (glob)
cachebreaker : {
    js: {
      asset_url : '/js/dist/combined.min.js',
      files: {
        src : ['app/views/*.html']
      }
    }
}
```
## The "cachebreaker" task
In it's simplest form (seen above), you can use the cache-breaker to replace a fixed url. This will look at the file `app/source.html`, find your `asset_url` within it & then append a timestamp. It will also overwrite an existing timestamp if one exists.


**Options Explained**

`asset_url` - this should be EXACTLY as your asset url appears in your html, it's what get replaced!

`files.src` - just provide the path to your *html,php,erb* file here (the file that contains the asset url above). You can also provide an array here if you would like to replace the url in more than 1 file.

`tag` - optional, a version tag to add to replaced asset urls

`ext` - optional, file extension of the replaced asset url - required to insert `tag` into a filename, rather than append it as a query string.

## A More Realistic Example.
Grunt is all about automating things, so I'd be more inclined to use this as a final step to a build process. The build would generate the filename dynamically and then the timestamp would be tacked on the end. You can imagine a nice setup like this.

```js
js_dir            : 'public/js',
js_deps           : '<%= js_dir %>/dist/deps',
js_all            : '<%= js_dir %>/dist/combined',
js_dist_file      : '<%= js_all %>.clean.min.js', /** build steps would generate this file **/

cachebreaker : {
    js: {
        asset_url : '<%= js_dist_file %>',
        files: {
            src : 'app/views/layout/master.html'
        },
        options : {
            remove : 'public', // remove any unwanted path fragments
        },
    },
}
```

With this type of setup, you could do something along the lines of this (with the correct config for concat & uglify, of course)

```shell
grunt.registerTask( 'js-build', ['concat:js', 'uglify:js', 'cachebreaker:js'] );
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
    asset_url : '<%= css_dist_file %>',
    files: {
      src : '<%= php_template %>',
    },
    options: {
      remove    : 'public'
    },
  },
}
```

```shell
grunt cachebreaker:css
```

##Optional
Most of the time you will just be updating a single file with each task, so I've enabled a `file` property to save a few lines in your Gruntfile.js
```js
cachebreaker : {
    js: {
      asset_url : '/js/dist/combined.min.js',
      file: 'app/views/layout/master.html',
    },
}
```

## Cachebusting file name
You can insert a version tag into a file name by including the `tag` and `ext` options.  This is useful if you're using a backend which is very rigid with url parameters (like the one I'm using...).
```js
cachebreaker: {
  options: {
    tag: '_v<%= pkg.name %>_'
  },
  js: {
    ext: 'js',
    asset_url: '/assets/js/jsfile.min.js',
    file: 'app/views/layout/master.html'
  }
}
```
Which makes `jsfile.min.js` become `jsfile.min_v1.0.0_.js` in `master.html`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
