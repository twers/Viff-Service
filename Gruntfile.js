module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
       separator:';' 
      },
      dist: {
        src:['public/**/*.js'],
        dest:''
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        sigleRun: true
      },
      e2e: {
        configFile: 'karmae2e.conf.js',
        singleRun: true
      }
    },
    watch: {
      scripts: {
        files: ['public/**/*.js'],
        tasks: ['karma:unit'],
        options: {
          spawn: false
        },
      },
      libs: {
        files: ['lib/**/*.js'],
        tasks: ['mochaTest'],
        options: {
          spawn: false
        }
      },
      less: {
        files: ['public/**/*.less'],
        tasks: ['less'],
        options: {
          spawn: false
        }
      }
    },
    less: {
      compile: {
        options: {
          paths: ['public/css']
        },
        files: {
          'main.css': ['../less/main.less']
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'should',
          ui: 'bdd',
          timeout: 2000
        },
        src: ['test/**/*.js']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint','concat','uglify','less','mochaTest']);
  grunt.registerTask('test', ['mochaTest','karma:unit']);

}