module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json') //
        , version: '<%= pkg.version %>' //
        , isPhoneGap: false //
        , dist: 'dist'  //
        , build: 'build'  //
        , modules: []  // to be filled in by build task
        , filename: '<%= pkg.name %>'  //
        , meta: {
            modules: 'angular.module("<%= pkg.shortName %>", ["app.main","ngMobile"]);',
            all: 'angular.module("<%= pkg.shortName %>", ["<%= pkg.shortName %>-tpls", "app.main","ngMobile"]);'
        }, endInit: {
            web: 'angular.bootstrap(window.document, ["<%= pkg.shortName %>"]);',
            phoneGap: 'document.addEventListener("deviceready", function () {<%= endInit.web %>});'
        }
// 本地服务器
// 长存进程
// 文档 https://github.com/gruntjs/grunt-contrib-connect
        , connect: {
            devServer: {
                options: {
                    port: 80,
                    hostname: '0.0.0.0',
                    base: './dist',
                    keepalive: true,
                    middleware: function (connect, options) {
                        return [
                            // Serve static files.
                            connect.static(options.base),
                            // Make empty directories browsable.
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        }

// 合并压缩 less 文件
// 文档 https://github.com/gruntjs/grunt-contrib-less
        , less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: false,
                    optimization: 0
                },
                files: {
                    "build/styles.css": "src/less/_index.less"
                }
//            },
//            production: {
//                options: {
//                    yuicompress: true
//                },
//                files: {
//                    "build/styles.css": "src/less/_index.less"
//                }
            }
        }

// 合并 js 文件
// 文档 https://github.com/gruntjs/grunt-contrib-concat
        , concat: {
            dist: {
                options: {
                    banner: '<%= meta.modules %>\n',
                    footer: '<%= isPhoneGap?endInit.phoneGap:endInit.web %>\n'
                },
                src: [], //src filled in by build task
                dest: '<%= build %>/<%= filename %>-<%= version %>.js'
            },
            dist_tpls: {
                options: {
                    banner: '<%= meta.all %>\n',
                    footer: '<%= isPhoneGap?endInit.phoneGap:endInit.web %>\n'
                },
                src: ["<%= build %>/tmp/tpls.js"], //src filled in by build task
                dest: '<%= build %>/<%= filename %>-tpls-<%= version %>.js'
            }
        }
// 压缩 js 文件
// 文档 https://github.com/gruntjs/grunt-contrib-uglify
        , uglify: {
            options: {
                mangle: true,   // 是否替换变量名
                report: 'gzip'
            },
            dist: {
                src: ['<%= build %>/<%= filename %>-<%= version %>.js'],
                dest: '<%= build %>/<%= filename %>-<%= version %>.min.js'
            },
            dist_tpls: {
                src: ['<%= build %>/<%= filename %>-tpls-<%= version %>.js'],
                dest: '<%= build %>/<%= filename %>-tpls-<%= version %>.min.js'
            }
        }

// 将 Angular 模版生成为 js
// https://github.com/ericclemmons/grunt-angular-templates
        , ngtemplates: {
            amu: {
                options: {
                    base: 'src/html/tpls', prepend: 'tpls/', module: {
                        name: '<%= pkg.shortName %>-tpls',
                        define: true
                    }
                }  //
                , src: 'src/html/tpls/**/**.html' //
                , dest: '<%= build %>/tmp/tpls.js'  //
            }
        }

        // copy 文档
        // 文档 https://github.com/gruntjs/grunt-contrib-copy
        ,
        copy: {
            font: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['misc/base-lib/font-awesome/font/**'],
                        dest: '<%= dist %>/font/',
                        filter: 'isFile'
                    }
                ]
            },
            css: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= build %>/styles.css'],
                        dest: 'dist/css/',
                        filter: 'isFile'
                    }
                ]
            },
            js: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            '<%= build %>/<%= filename %>-<%= version %>.js'
                            , 'misc/base-lib/angular/angular.js'
                            , 'misc/base-lib/angular/angular-mobile.js'
                        ],
                        dest: 'dist/js/',
                        filter: 'isFile'
                    }
                ]
            }
        }

// 监控文件变化并动态执行任务
// 如下设置是 js 文件夹的任一 js 文件有变化则执行合并
// less 文件夹下任一 less 文件有变化则执行 less 编译 watch 一般用于开发，所以这里设置了，即编译但不压缩
// 文档 https://github.com/gruntjs/grunt-contrib-watch
        , watch: {
            html: {
                files: ['src/html/tpls/**/**.html'],
                tasks: ['ngtemplates']
            },
            scripts: {
                files: ['src/js/**/**.js'],
                tasks: ['concat']
            },
            less: {
                files: ['src/less/**/**.less'],
                tasks: ['less:development']
            }
        }
    });

    // 设定 任务
    grunt.registerTask('default', ['connect']);

    require('../grunt/angular-module.js')(grunt);
    require('../grunt/base-lib.js')(grunt);

    return grunt
};


