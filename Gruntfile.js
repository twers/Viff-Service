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
      config: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:all']
      },
      scripts: {
        files: ['public/scripts/*.js'],
        tasks: ['jshint:all', 'karma:unit'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      styles: {
        files: ['public/**/*.less'],
        tasks: ['less'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      templates: {
        files: ['public/**/*.jade'],
        tasks: ['jade'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      lib: {
        files: ['lib/**/*.js'],
        tasks: ['jshint:all', 'mochaTest'],
        options: {
          spawn: false
        }
      },
      libTemplate: {
        files: ['lib/**/*.jade'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'lib/app.js',
          watchedExtensions: ['js'],
          watchedFolders: ['lib'],
          nodeArgs: ['--debug=5858'],
          delayTime: 1,
          env: {
            NODE_ENV: 'dev'            
          }
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': '127.0.0.1',
          'debug-port': 5858,
          'save-live-edit': true,
          'stack-trace-limit': 4
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'node-inspector', 'watch']
      },
      options: {
        logConcurrentOutput: true
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
          paths: ['public/styles', 'public/styles/bootstrap']
        },
        files: {
          'public/css/main.css': 'public/styles/main.less'
        }
      }
    },
    jade: {
      compile: {
        options: {
          client: false,
          pretty: true
        },
        files: [ {
          cwd: 'public/jade',
          src: './**/*.jade',
          dest: 'public/templates',
          expand: true,
          ext: '.html'
        } ]
      },
      build: {
        options: {
          client: false,
          pretty: true
        },
        files: [ {
          cwd: 'lib/views',
          src: 'user_scripts.jade',
          dest: 'public/templates',
          expand: true,
          ext: '.html'
        } ]
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
    },
    // build
    
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.registerTask('test', ['mochaTest','express:dev','karma:unit', 'karma:e2e']);
  grunt.registerTask('dev', ['concurrent:dev']);
  grunt.registerTask('build', [
    'test',
  ]);




};

