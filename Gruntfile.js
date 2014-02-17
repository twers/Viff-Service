module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // both server && client
    clean: ['public/scripts/app.js', 'public/scripts/app-lib.js', 'public/scripts/templates.js', 'public/templates', 'public/css', '.tmp'],
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['public/bower_components/**/*.js', 'public/scripts/app.js', 'public/scripts/app-lib.js', 'public/dist/**/*.js']
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'public/**/*.js']
    },
    watch: {
      config: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:all']
      },
      scripts: {
        files: ['public/scripts/**/*.js', '!public/scripts/app.js', '!public/scripts/templates.js'],
        tasks: ['jshint:all', 'browserify'],
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
        tasks: ['jshint:all'],
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
          args: ['livereload'],
          watchedExtensions: ['js'],
          watchedFolders: ['lib'],
          nodeArgs: ['--debug'],
          delayTime: 1,
          env: {
            NODE_ENV: 'development'            
          }
        }
      },
      noload: {
        options: {
          file: 'lib/app.js',
          watchedExtensions: ['js'],
          watchedFolders: ['lib'],
          nodeArgs: ['--debug'],
          delayTime: 1,
          env: {
            NODE_ENV: 'development'            
          }
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'watch']
      },
      noload: {
        tasks: ['nodemon:noload', 'watch']
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
        src: ['public/templates/**/*.html'],
        dest: 'public/scripts/templates.js',
        module: 'viffservice/templates'
      }
    },
    browserify: {
      options: {
      },
      vendor: {
        files: {
          'public/scripts/app-lib.js': ['public/scripts/main-lib.js']
        },
        options: {
          alias: [
            'public/bower_components/angular/angular.js:angular',
            'public/bower_components/angular-route/angular-route.js:angular-route',
            'public/bower_components/angular-resource/angular-resource.js:angular-resource',
            'shoe:',
            'ansi2html:',
            'event-stream:',
            'lodash:',
            'util',
            'events'
          ]
        }
      },
      dev: {
        files: {
          'public/scripts/app.js': ['public/scripts/main.js']
        },
        options: {
          debug: true,
          external: ['angular', 'angular-route', 'angular-resource', 'event-stream', 'ansi2html', 'shoe', 'lodash', 'util', 'events']
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
          paths: ['public/styles'],
          dumpLineNumbers: "comments"
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
          pretty: true,
          data: { front_end_build: true }
        },
        files: {
          'public/templates/user_scripts.html': 'lib/views/user_scripts.jade',
          'public/templates/header_styles.html': 'lib/views/header_styles.jade'
        }
      }
    },
    useminPrepare: {
      js: {
        src: 'public/templates/user_scripts.html',
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
      options: {
        require: ['should'],
        ui: 'bdd',
        timeout: 2000
      },
      test: {
        options: {
          reporter: 'travis-cov'
        },
        src: ['test/**/*.js', '!test/assets/**/*.js']
      },
      htmlcov: {
        options: {
          reporter: 'html-cov'
        },
        src: ['test/**/*.js', '!test/assets/**/*.js']
      }
    },
    express: {
      dev: {
        options: {
          script: 'lib/app.js',
          NODE_ENV: 'development'
        }
      },
      test: {
        options: {
          script: 'lib/app.js',
          NODE_ENV: 'test'
        }
      },
      prod: {
        options: {
          script: 'lib/app.js',
          NODE_ENV: 'production'
        }
      }
    },
    env: {
      development: {
        NODE_ENV: 'development'
      },
      test: {
        NODE_ENV: 'test'
      },
      production: {
        NODE_ENV: 'production'
      }
    }
    
  });
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./db/tasks');

  grunt.registerTask('basic', [
    'jade:compile',
    'html2js',
    'browserify',
    'less'
  ]);

  grunt.registerTask('compile', [
    'jshint',
    'jade:compile',
    'html2js',
    'browserify',
    'less'
  ]);

  grunt.registerTask('test', [
    'env:test',
    'mochaTest:test',
    'compile',
    'db:clean',
    'db:seed',
    'express:test',
    'karma:unit',
    'karma:e2e',
    'express:test:stop',
    'clean',
    'db:clean'
  ]);

  grunt.registerTask('mocha', [
    'env:test',
    'mochaTest:test'
  ]);
  
  grunt.registerTask('dev', [
    'compile',
    'concurrent:dev'
  ]);

  grunt.registerTask('dev:noload', [
    'compile',
    'concurrent:noload'
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
