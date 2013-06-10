# grunt-cache-breaker

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cache-breaker --save-dev
```

Once the plugin has been installed, add this to your Gruntfile.js

```js
grunt.loadNpmTasks('grunt-cache-breaker');
```

## The "cache_breaker" task

Add this config to your Gruntfile.js

```js
cache_breaker : {
  js : {
    options : {
      filename : 'public/js/dist/combined.min.js'
    },
    files   : {
      'app/views/layouts/master.blade.php' : ['app/views/layouts/master.blade.php']
    }
  },
},
```

## Run

Run the task using this command

```shell
grunt cache_breaker:js
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
