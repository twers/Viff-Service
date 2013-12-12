module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // both server && client
    clean: ['public/scripts/app.js', 'public/scripts/templates.js', 'public/templates', 'public/css', '.tmp'],
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['public/bower_components/**/*.js', 'public/scripts/app.js', 'public/dist/**/*.js']
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'public/**/*.js']
    },
    watch: {
      config: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:all']
      },
      scripts: {
        files: ['public/scripts/*.js', '!public/scripts/app.js', '!public/scripts/templates.js'],
        tasks: ['jshint:all', 'browserify', 'karma:unit'],
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
        tasks: ['jade:compile', 'html2js', 'browserify'],
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
    html2js: {
      options: {
        base: './public',
        rename: function (moduleName) {
          return '/' + moduleName;
        }
      },
      dist: {
        src: ['public/**/*.html'],
        dest: 'public/scripts/templates.js',
        module: 'viffservice/templates'
      }
    },
    browserify: {
      options: {
        alias: [
          'public/bower_components/angular/angular.min.js:angular',
          'public/bower_components/angular-route/angular-route.js:angular-route'
        ]
      },
      dev: {
        src: 'public/scripts/main.js',
        dest: 'public/scripts/app.js',
        options: {
          debug: true
        }
      }
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
        files: {
          'public/templates/footer_scripts.html': 'lib/views/footer_scripts.jade',
          'public/templates/header_styles.html': 'lib/views/header_styles.jade'
        }
      }
    },
    useminPrepare: {
      js: {
        src: 'public/templates/footer_scripts.html',
        options: {
          dest: './public',
          root: './public'
        }
      },
      css: {
        src: 'public/templates/header_styles.html',
        options: {
          dest: './public',
          root: './public'
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'public/',
          dest: 'public/dist',
          src: [
            '*.{ico,png,txt}',
            'image/**/*.{jpg,png,gif,svg}',
            'fonts/*.{eot,svg,ttf,woff}'
          ]
        }]
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
  

  grunt.registerTask('basic', [
    'jade:compile',
    'html2js',
    'browserify:dev',
    'less'
  ]);

  grunt.registerTask('compile', [
    'jshint',
    'jade:compile',
    'html2js',
    'browserify:dev',
    'less'
  ]);


  grunt.registerTask('test', [
    'compile',
    'express:dev',
    'karma:unit',
    'karma:e2e',
    'express:dev:stop',
    'mochaTest',
    'clean'
  ]);
  
  grunt.registerTask('dev', [
    'compile',
    'concurrent:dev'
  ]);

  grunt.registerTask('build', [
    'test',
    'compile',
    'jade:build',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'clean',
    'copy:dist'
  ]);




};

