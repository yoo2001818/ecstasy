module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      files: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    browserify: {
      files: {
        src: 'index.js',
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: (function() {  
            var path = require('path');
            var srcDir = path.join(__dirname, 'src');

            return require('blanket')({
              // Only files that match the pattern will be instrumented
              pattern: srcDir
            });
          })()
        },
        src: ['test/**/*.js']
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage/coverage.html'
        },
        src: ['test/**/*.js']
      },
      'lcov': {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'coverage/lcov.info'
        },
        src: ['test/**/*.js']
      }
    },
    coveralls: {
      src: 'coverage/lcov.info',
      options: {
        force: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-coveralls');

  grunt.registerTask('default', ['browserify', 'uglify']);
  grunt.registerTask('test', ['mochaTest', 'coveralls']);
};
