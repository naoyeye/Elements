var lrSnippet = require('connect-livereload')();

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // log task running time
    require('time-grunt')(grunt);

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var pathConfig = {
        app: 'app',
        dist: 'dist',
        tmp: '.tmp',
        test: 'test'
    };

    grunt.initConfig({
        paths: pathConfig,
        watch: {
            compass: {
                files: ['<%= paths.app %>/compass/**/*'],
                tasks: ['compass:server']
            },
            test: {
                files: ['<%= paths.app %>/javascripts/**/*.js'],
                tasks: ['newer:jshint:test', 'karma:server:run'],
                options: {
                    spawn: false
                }
            },
            livereload: {
                files: [
                    '<%= paths.app %>/**/*.html',
                    '<%= paths.app %>/javascripts/**/*.js',
                    '<%= paths.app %>/images/**/*',
                    '<%= paths.tmp %>/stylesheets/**/*.css',
                    '<%= paths.tmp %>/images/**/*'
                ],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        },
        connect: {
            options: {
                port: 9999,
                hostname: '0.0.0.0'
            },
            server: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, pathConfig.tmp),
                            mountFolder(connect, pathConfig.app)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://127.0.0.1:<%= connect.options.port %>',
                app: 'Google Chrome Canary'
            }
        },
        clean: {
            dist: ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server: '<%= paths.tmp %>'
        },
        useminPrepare: {
            html: ['<%= paths.app %>/**/*.html'],
            options: {
                dest: '<%= paths.dist %>'
            }
        },
        usemin: {
            html: ['<%= paths.dist %>/**/*.html'],
            css: ['<%= paths.dist %>/stylesheets/**/*.css'],
            options: {
                dirs: ['<%= paths.dist %>'],
                assetsDirs: ['<%= paths.dist %>']
            }
        },
        htmlmin: {
            options: {
                collapseWhitespace: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>',
                    src: ['**/*.html'],
                    dest: '<%= paths.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.app %>',
                    dest: '<%= paths.dist %>',
                    src: [
                        '**/*.html',
                        '!components/**/*.html',
                        '!compass/**/*.html',
                        'images/**/*.{webp,gif,png,jpg,jpeg,ttf,otf,svg}'
                    ]
                }]
            },
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.tmp %>',
                    dest: '<%= paths.dist %>',
                    src: [
                        '**/*.html'
                    ]
                }]
            },
            compass: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.tmp %>',
                    dest: '<%= paths.dist %>',
                    src: [
                        'images/**/*.{webp,gif,png,jpg,jpeg,ttf,otf,svg}'
                    ]
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= paths.app %>/compass/sass',
                imagesDir: '<%= paths.app %>/compass/images',
                fontsDir: '<%= paths.app %>/images/fonts',
                relativeAssets: true
            },
            dist: {
                options: {
                    cssDir: '<%= paths.dist %>/stylesheets',
                    generatedImagesDir: '<%= paths.tmp %>/images',
                    httpGeneratedImagesPath: '/images/',
                    outputStyle: 'compressed',
                    environment: 'production',
                    relativeAssets: false
                }
            },
            server: {
                options: {
                    cssDir: '<%= paths.tmp %>/stylesheets',
                    generatedImagesDir: '<%= paths.tmp %>/images',
                    debugInfo: true,
                    environment: 'development'
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= paths.dist %>/javascripts/**/*.js',
                        '<%= paths.dist %>/stylesheets/**/*.css',
                        '<%= paths.dist %>/images/**/*.{webp,gif,png,jpg,jpeg,ttf,otf}'
                    ]
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    progressive: true,
                    interlace: true,
                    cwd: '<%= paths.dist %>/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%= paths.dist %>/images'
                }]
            }
        },
        requirejs: {
            dist: {
                options: {
                    optimize: 'uglify',
                    uglify: {
                        toplevel: true,
                        ascii_only: false,
                        beautify: false
                    },
                    preserveLicenseComments: true,
                    useStrict: false,
                    wrap: true
                }
            }
        },
        concurrent: {
            server: {
                tasks: ['clean:server', 'compass:server'],
                options: {
                    logConcurrentOutput: true
                }
            },
            dist: {
                tasks: ['copy:dist', 'compass:dist'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            test: ['<%= paths.app %>/javascripts/**/*.js']
        },
        karma: {
            options: {
                configFile: '<%= paths.test %>/karma.conf.js',
                browsers: ['Chrome_without_security']
            },
            server: {
                reporters: ['progress'],
                background: true
            },
            test: {
                reporters: ['progress', 'junit', 'coverage'],
                preprocessors: {
                    '<%= paths.app %>/javascripts/**/*.js' : 'coverage'
                },
                junitReporter: {
                    outputFile: '<%= paths.test %>/output/test-results.xml'
                },
                coverageReporter: {
                    type: 'html',
                    dir: '<%= paths.test %>/output/coverage/'
                },
                singleRun: true
            },
            travis: {
                browsers: ['PhantomJS'],
                reporters: ['progress'],
                singleRun: true
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false
            }
        },
        cdn: {
            options: {
                flatten: true
            },
            dist: {
                options: {
                    cdn: 'http://static.wdjimg.com/xxx',
                },
                src: ['<%= paths.dist %>/**/*.html', '<%= paths.dist %>/**/*.css']
            },
            staging: {
                options: {
                    cdn: 'https://s3.cn-north-1.amazonaws.com.cn/web-statics-staging/xxx',
                },
                src: ['<%= paths.dist %>/**/*.html', '<%= paths.dist %>/**/*.css']
            }
        },
        'aws_s3': {
            options: {
                accessKeyId: '',
                secretAccessKey: '',
                region: 'cn-north-1',
                uploadConcurrency: 5,
                signatureVersion: 'v4'
            },
            staging: {
                options: {
                    bucket: 'web-statics-staging',
                    differential: true,
                    params: {
                        CacheControl: '31536000'
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>',
                    src: ['**', '!**/*.css', '!**/*.js'],
                    dest: 'xxx/'

                }, {
                    expand: true,
                    cwd: 'gzip',
                    src: ['**'],
                    dest: 'xxx/',
                    params: {
                        ContentEncoding: 'gzip'
                    }
                }]
            },
            production: {
                options: {
                    bucket: 'web-statics-production',
                    differential: true,
                    params: {
                        CacheControl: '31536000'
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>',
                    src: ['**', '!**/*.css', '!**/*.js'],
                    dest: 'xxx/'
                }, {
                    expand: true,
                    cwd: 'gzip',
                    src: ['**'],
                    dest: 'xxx/',
                    params: {
                        ContentEncoding: 'gzip'
                    }
                }]
            }
        },
        compress: {
            gzip: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: '<%= paths.dist %>/',
                src: ['**/*.js', '**/*.css'],
                dest: 'gzip/'
            }
        }
    });

    grunt.registerTask('serve', [
        'concurrent:server',
        'connect:server',
        'karma:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('test', [
        'jshint:test',
        'karma:test'
    ]);

    grunt.registerTask('test:travis', [
        'jshint:test',
        'karma:travis'
    ]);

    grunt.registerTask('build:staging', [
        'clean:dist',
        'concurrent:dist',
        'useminPrepare',
        'concat',
        'uglify',
        // 'cssmin', // Uncomment this line if using none-sass style
        // 'requirejs:dist', // Uncomment this line if using RequireJS in your project
        'rev',
        'copy:compass',
        'imagemin',
        'usemin',
        'htmlmin',
        'cdn:staging',
        'compress:gzip',
        'aws_s3:staging'
    ]);

    grunt.registerTask('build:production', [
        'clean:dist',
        'concurrent:dist',
        'useminPrepare',
        'concat',
        'uglify',
        // 'cssmin', // Uncomment this line if using none-sass style
        // 'requirejs:dist', // Uncomment this line if using RequireJS in your project
        'rev',
        'copy:compass',
        'imagemin',
        'usemin',
        'htmlmin',
        'cdn:dist',
        'compress:gzip',
        'aws_s3:production'
    ]);

    grunt.registerTask(['update'], [
        'bump-only:patch',
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask(['update:minor'], [
        'bump-only:minor',
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask(['update:major'], [
        'bump-only:major',
        'changelog',
        'bump-commit'
    ]);
};
