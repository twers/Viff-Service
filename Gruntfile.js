module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // both server && client
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['public/bower_components/**/*.js']
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'public/**/*.js']
    },
    watch: {
      scripts: {
        files: ['public/scripts/*.js'],
        tasks: ['jshint', 'karma:unit'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      styles: {
        files: ['public/**/*.less'],
        tasks: ['less'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      libs: {
        files: ['lib/**/*.js'],
        tasks: ['jshint', 'mochaTest'],
        options: {
          spawn: false
        }
      }
    },
    // client    
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
    jade: {
      dev: {
        options: {
          data: {
            debug: true,
            timestamp: "<%= new Date().getTime() %>"
          }
        }
      },
      prod: {
        options: {
          debug: false,

        }
      }
    },
    // server
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
    },
    express: {
      dev: {
        options: {
          script: 'lib/app.js',
          node_env: 'dev'
        }
      },
      prod: {
        options: 'lib/app.js',
        node_env: 'prod'
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint','concat','uglify','less','mochaTest']);
  grunt.registerTask('test', ['mochaTest','express:dev','karma:unit', 'karma:e2e']);
  grunt.registerTask('server', ['watch:dev']);
};
