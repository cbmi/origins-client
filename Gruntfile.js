/* global module, require, console */

module.exports = function(grunt) {
    var changeVersion = function(fname, version) {
        var contents = grunt.file.readJSON(fname),
            current = contents.version;

        contents.version = version;
        grunt.file.write(fname, JSON.stringify(contents, null, 2));
        grunt.log.ok(fname + ': ' + current + ' => ' + version);
    };

    var replaceVersion = function(fname, current, version) {
        var options = {encoding: 'utf8'},
            content = grunt.file.read(fname, options),
            regexp = new RegExp("version: '" + current + "'");

        if (!regexp.test(content)) {
            grunt.fatal('File contents does not match version');
        }

        content = content.replace(regexp, "version: '" + version + "'");
        grunt.file.write(fname, content, options);
        grunt.log.ok('' + fname + ': ' + current + ' => ' + version);
    };

    var run = function(cmd) {
        grunt.log.ok(cmd);
        shell.exec(cmd);
    };

	var shell = require('shelljs');

	var pkg = grunt.file.readJSON('package.json');

    var vendorModules = [
        'jquery',
        'backbone',
        'underscore',
        'backbone.marionette',
        'bootstrap',
        'loglevel',
        'react',
        'flux'
    ];

    grunt.initConfig({
        pkg: pkg,

        srcDir: 'src',
        specDir: 'spec',
        localDir: 'local',
        buildDir: 'build',
        distDir: 'dist',
        cdnDir: 'cdn',
        bowerDir: 'bower_components',

        serve: {
            local: {
                options: {
                    base: 'local/',
                    keepalive: true,
                    port: 8125
                }
            },
            dist: {
                options: {
                    base: 'dist/',
                    keepalive: true,
                    port: 8125
                }
            },
            jasmine: {
                options: {
                    port: 8126
                }
            }
        },

        watch: {
            grunt: {
                tasks: ['local'],
                files: ['Gruntfile.js']
            },
            local: {
                tasks: ['sync:local'],
                files: [
                    '<%= srcDir %>/**/*',
                    '<%= bowerDir %>/**/*'
                ]
            },
            tests: {
                tasks: ['jasmine:local:build'],
                files: ['<%= specDir %>/**/*']
            },
            sass: {
                tasks: ['sass:local'],
                files: ['<%= srcDir %>/scss/**/*']
            },
            react: {
                tasks: ['react:local'],
                files: ['<%= srcDir %>/js/**/*.jsx']
            }
        },

        sync: {
            local: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: '<%= bowerDir %>',
                    src: [
                        'bootstrap/dist/js/bootstrap.js',
                        'bootstrap3-typeahead/bootstrap3-typeahead.js',
                        'backbone/backbone.js',
                        'flux/dist/Flux.js',
                        'jquery/dist/jquery.js',
                        'loglevel/dist/loglevel.js',
                        'marionette/lib/backbone.marionette.js',
                        'marked/lib/marked.js',
                        'react/react.js',
                        'requirejs/require.js',
                        'requirejs-text/text.js',
                        'underscore/underscore.js',
                        'url-template/lib/url-template.js'
                    ],
                    dest: '<%= localDir %>/js'
                }, {
                    expand: true,
                    flatten: true,
                    cwd: '<%= bowerDir %>',
                    src: [
                        'fontawesome/css/font-awesome.css',
                        'bootstrap/dist/css/bootstrap.css'
                    ],
                    dest: '<%= localDir %>/css'
                }, {
                    expand: true,
                    flatten: true,
                    cwd: '<%= bowerDir %>',
                    src: [
                        'fontawesome/fonts/*'
                    ],
                    dest: '<%= localDir %>/fonts'
                }, {
                    expand: true,
                    cwd: '<%= srcDir %>/js',
                    src: '**/*.js',
                    dest: '<%= localDir %>/js'
                }, {
                    expand: true,
                    cwd: '<%= srcDir %>/html',
                    src: '**/*',
                    dest: '<%= localDir %>'
                }, {
                    expand: true,
                    cwd: '<%= srcDir %>/templates',
                    src: '**/*',
                    dest: '<%= localDir %>/js/templates'
                }]
            }
        },

        sass: {
            options: {
                sourcemap: true
            },
            local: {
                options: {
                    trace: true,
                    style: 'expanded'
                },
                files: {
                    '<%= localDir %>/css/origins.css': '<%= srcDir %>/scss/origins.scss'
                }
            },
            dist: {
                options: {
                    quiet: true,
                    style: 'compressed'
                },
                files: {
                    '<%= distDir %>/css/origins.css': '<%= srcDir %>/scss/origins.scss'
                }
            },
            cdn: {
                options: {
                    quiet: true,
                    sourcemap: false,
                    style: 'compressed'
                },
                files: {
                    '<%= cdnDir %>/css/origins.css': '<%= srcDir %>/scss/origins.scss'
                }
            }
        },

        copy: {
            local: {
                files: [{
                    expand: true,
                    src: ['bower.json', 'package.json'],
                    dest: '<%= localDir %>'
                }]
            },

            build: {
                files: [{
                    expand: true,
                    cwd: '<%= srcDir %>/templates',
                    src: ['**/*'],
                    dest: '<%= buildDir %>/js/templates'
                }, {
                    expand: true,
                    cwd: '<%= srcDir %>/js',
                    src: ['**/*'],
                    dest: '<%= buildDir %>/js'
                }, {
                    expand: true,
                    flatten: true,
                    cwd: '<%= bowerDir %>',
                    src: [
                        'bootstrap/dist/js/bootstrap.js',
                        'bootstrap3-typeahead/bootstrap3-typeahead.js',
                        'backbone/backbone.js',
                        'flux/dist/Flux.js',
                        'jquery/dist/jquery.js',
                        'loglevel/dist/loglevel.js',
                        'marionette/lib/backbone.marionette.js',
                        'marked/lib/marked.js',
                        'react/react.js',
                        'requirejs/require.js',
                        'requirejs-text/text.js',
                        'underscore/underscore.js',
                        'url-template/lib/url-template.js'
                    ],
                    dest: '<%= buildDir %>/js'
                }]
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= srcDir %>/html',
                    src: ['**/*'],
                    dest: '<%= distDir %>'
                }, {
                    expand: true,
                    src: ['bower.json', 'package.json'],
                    dest: '<%= distDir %>'
                }, {
                    expand: true,
                    flatten: true,
                    cwd: '<%= bowerDir %>',
                    src: [
                        'fontawesome/css/font-awesome.css',
                        'bootstrap/dist/css/bootstrap.css'
                    ],
                    dest: '<%= distDir %>/css'
                }, {
                    expand: true,
                    flatten: true,
                    cwd: '<%= bowerDir %>',
                    src: [
                        'fontawesome/fonts/*'
                    ],
                    dest: '<%= distDir %>/fonts'
                }]
            },

            cdn: {
                files: [{
                    expand: true,
                    cwd: '<%= srcDir %>/html',
                    src: ['**/*'],
                    dest: '<%= cdnDir %>'
                }]
            }
        },

        requirejs: {
            options: {
                mainConfigFile: '<%= srcDir %>/js/origins.js',
                baseUrl: '.',
                inlineText: true,
                preserveLicenseComments: false,
                wrap: false,
                logLevel: 1,
                throwWhen: {
                    optimize: true
                },
                modules: [{
                    name: pkg.name,
                    exclude: vendorModules
                }]
            },

            dist: {
                options: {
                    appDir: '<%= buildDir %>/js',
                    dir: '<%= distDir %>/js',
                    optimize: 'uglify2',
                    generateSourceMaps: true,
                    removeCombined: false
                }
            },

            cdn: {
                options: {
                    appDir: '<%= buildDir %>/js',
                    dir: '<%= cdnDir %>/js',
                    optimize: 'uglify2',
                    generateSourceMaps: false,
                    removeCombined: true
                }
            }
        },

        clean: {
            local: [
                '<%= localDir %>'
            ],

            build: [
                '<%= buildDir %>'
            ],

            dist: [
                '<%= distDir %>'
            ],

            cdn: [
                '<%= cdnDir %>'
            ],

            postdist: [
                '<%= distDir %>/js/templates'
            ],

            postcdn: [
                '<%= cdnDir %>/js/templates',
                '<%= cdnDir %>/js/require.js'
            ].concat(vendorModules.map(function(mod) {
                return '<%= cdnDir %>/js/' + mod + '.js';
            })),

            release: [
                '<%= localDir %>/js/build.txt',
                '<%= distDir %>/js/build.txt',
                '<%= cdnDir %>/js/build.txt'
            ]
        },

        jasmine: {
            options: {
                specs: '<%= specDir %>/**/**/**/*.js',
                host: 'http://127.0.0.1:8126',
                helpers: './specConfig.js',
                keepRunner: true,
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    version: '<%= bowerDir %>/requirejs/require.js'
                }
            },

            local: {
                options: {
                    templateOptions: {
                        requireConfigFile: '<%= localDir %>/js/origins.js',
                        requireConfig: {
                            baseUrl: '<%= localDir %>/js'
                        }
                    }
                }
            },

            dist: {
                options: {
                    templateOptions: {
                        requireConfigFile: '<%= distDir %>/js/origins.js',
                        requireConfig: {
                            baseUrl: '<%= distDir %>/js'
                        }
                    }
                }
            }
        },

        amdcheck: {
            local: {
                options: {
                    removeUnusedDependencies: false
                },
                files: [
                    {
                        expand: true,
                        src: ['<%= localDir %>/js/**/**/**/**/*.js']
                    }
                ]
            }
        },

        jshint: {
            options: {
                camelcase: true,
                immed: true,
                indent: 4,
                latedef: true,
                noarg: true,
                noempty: true,
                undef: true,
                unused: true,
                trailing: true,
                maxdepth: 3,
                browser: true,
                eqeqeq: true,
                globals: {
                    define: true,
                    require: true
                },
                reporter: require('jshint-stylish'),
                ignores: [
                    '<%= srcDir %>/js/backbone.js',
                    '<%= srcDir %>/js/url-template.js',
                    '<%= srcDir %>/js/bootstrap3-typeahead.js',
                    '<%= srcDir %>/js/marked.js',
                    '<%= srcDir %>/js/bootstrap.js',
                    '<%= srcDir %>/js/jquery.js',
                    '<%= srcDir %>/js/loglevel.js',
                    '<%= srcDir %>/js/backbone.marionette.js',
                    '<%= srcDir %>/js/require.js',
                    '<%= srcDir %>/js/text.js',
                    '<%= srcDir %>/js/tpl.js',
                    '<%= srcDir %>/js/underscore.js',
                    '<%= srcDir %>/js/react.js',
                    '<%= srcDir %>/js/flux.js'
                ]
            },
            src: ['<%= srcDir %>/js/**/*.js']
        },

        react: {
            local: {
                files: [{
                    expand: true,
                    cwd: '<%= srcDir %>/js/',
                    src: ['**/*.jsx'],
                    dest: '<%= localDir %>/js',
                    ext: '.js'
                }]
            },

            build: {
                files: [{
                    expand: true,
                    cwd: '<%= srcDir %>/js/',
                    src: ['**/*.jsx'],
                    dest: '<%= buildDir %>/js',
                    ext: '.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-amdcheck');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-react');

    grunt.registerMultiTask('serve', 'Run a Node server for testing', function() {
        var http = require('http'),
            path = require('path'),
            url = require('url'),
            fs = require('fs');

        var contentTypes = {
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.html': 'text/html'
        };

        var options = this.options({
            hostname: 'localhost',
            base: '.',
            port: 8125,
            keepalive: false
        });

        var serveResponse = function(filename, response) {
            var extname = path.extname(filename),
                contentType = contentTypes[extname] || 'text/plain',
                stream = fs.createReadStream(filename);

            response.writeHead(200, {
                'Content-Type': contentType
            });

            stream.pipe(response);
        };

        var serve404 = function(filename, response) {
            response.writeHead(404);
            response.end();
        };

        var serve500 = function(filename, response) {
            response.writeHead(500);
            response.end();
        };

        var server = http.createServer(function(request, response) {
            var pathname = url.parse(request.url).pathname, filename;

            // Append index.html to file for directory-based matches
            if (path.extname(pathname) === '') {
                filename = path.join(options.base, 'index.html');
            } else {
                filename = path.join(options.base, pathname);
            }

            fs.exists(filename, function(exists) {
                if (exists) {
                    fs.readFile(filename, function(error) {
                        if (error) {
                            serve500(filename, response);
                        } else {
                            serveResponse(filename, response);
                        }
                    });
                } else {
                    serve404(filename, response);
                }
            });
        });

        if (options.hostname === '*') options.hostname = null;
        if (options.port === '?') options.port = 0;

        var done = this.async();

        server.listen(options.port, options.hostname).on('listening', function() {
            var address, hostname;
            address = server.address();
            hostname = server.hostname || 'localhost';
            if (!options.keepalive) {
                done();
            } else {
                grunt.log.writeln('Listening on ' + hostname + ':' +
                                  address.port + '...');
            }
        }).on('error', function(error) {
            if (error.code === 'EADDRINUSE') {
                grunt.fatal('Port ' + options.port +
                                   ' is already in use by another process.');
            } else {
                grunt.fatal(error);
            }
        });
    });

    grunt.registerTask('local', 'Creates a build for local development and testing', [
        'sass:local',
        'react:local',
        'sync:local',
        'jasmine:local:build'
    ]);

    grunt.registerTask('dist', 'Creates a build for distribution', [
        'clean:build',
        'copy:build',
        'react:build',
        'clean:dist',
        'requirejs:dist',
        'sass:dist',
        'copy:dist',
        'clean:postdist'
    ]);

    grunt.registerTask('cdn', 'Creates a build for CDN distribution', [
        'clean:build',
        'copy:build',
        'clean:cdn',
        'requirejs:cdn',
        'sass:cdn',
        'copy:cdn',
        'clean:postcdn'
    ]);

    grunt.registerTask('work', 'Local build and starts a watch process', [
        'local',
        'sync',
        'watch'
    ]);

    grunt.registerTask('test', 'Runs the headless test suite', [
        'local',
        'serve:jasmine',
        'jasmine:local'
    ]);

    grunt.registerTask('bump-final', 'Updates the version to final', function() {
        var svutil = require('semver-utils');

        var current = pkg.version,
            version = svutil.parse(pkg.version);

        if (version.release !== 'beta') {
            grunt.fatal('Version ' + current + ' not beta. Is this ready for release?');
        }

        version.release = '';
        version.build = '';

        pkg.version = svutil.stringify(version);

        replaceVersion('src/js/origins/core.js', current, pkg.version);

        ['package.json', 'bower.json'].map(function(mod) {
            return changeVersion(mod, pkg.version);
        });
    });

    grunt.registerTask('bump-patch', 'Bumps version to next patch-release', function() {
        var svutil = require('semver-utils');

        var current = pkg.version,
            version = svutil.parse(pkg.version);

        console.log(version.release);

        if (version.release) {
            grunt.fatal('Version ' + current + ' not final. ' +
                        'Should this be bumped to a pre-release?');
        }

        version.patch = '' + (parseInt(version.patch, 10) + 1);
        version.release = 'beta';
        version.build = '';

        pkg.version = svutil.stringify(version);

        replaceVersion('src/js/origins/core.js', current, pkg.version);

        ['package.json', 'bower.json'].map(function(mod) {
            changeVersion(mod, pkg.version);
        });

        run('git add bower.json package.json src/js/origins/core.js');

        var versionString = [version.major, version.minor, version.patch].join('.');

        run('git commit -s -m "' + versionString + ' Beta"');
    });

    grunt.registerTask('tag-release', 'Create a release on master', function() {
        run('git add bower.json package.json src/js/origins/core.js');
        run('git commit -s -m "' + pkg.version + ' Release"');
        run('git tag ' + pkg.version);
    });

    grunt.registerTask('release-binaries', 'Create a release binary', function() {
        var releaseDirName = pkg.name + '-' + pkg.version;

        run('rm -rf ' + pkg.name);
        run('mkdir -p ' + pkg.name);
        run('cp -r dist/* ' + pkg.name);
        run('zip -r ' + releaseDirName + '.zip ' + pkg.name);
        run('tar -Hzcf ' + releaseDirName + '.tar.gz ' + pkg.name);
        run('rm -rf ' + pkg.name);
        run('mkdir -p ' + pkg.name);
        run('cp -r local/* ' + pkg.name);
        run('zip -r ' + releaseDirName + '-src.zip ' + pkg.name);
        run('tar -Hzcf ' + releaseDirName + '-src.tar.gz ' + pkg.name);
        run('rm -rf ' + pkg.name);
    });

    grunt.registerTask('release-help', 'Prints the post-release steps', function() {
        grunt.log.ok('Push the code and tags: git push && git push --tags');
        grunt.log.ok('Go to ' + pkg.homepage + '/releases to update the release ' +
                     'descriptions and upload the binaries');
        grunt.log.ok('The CDN-ready files have been updated');
    });

    grunt.registerTask('release', 'Builds the distribution files, creates the ' +
                                  'release binaries, and creates a Git tag', [
        'bump-final',
        'local',
        'dist',
        'cdn',
        'clean:release',
        'release-binaries',
        'tag-release',
        'release-help',
        'bump-patch'
    ]);
};
