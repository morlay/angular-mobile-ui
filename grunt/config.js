module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json') //
        , version: '<%= pkg.version %>' //
        , isPhoneGap: false //
        , bower: 'bower_components' // base lib
        , src: 'src'  //
        , dist: 'dist'  //
        , misc: 'misc'  //
        , build: 'build'  //
        , appModule: 'app.main' //
        , modules: []  // to be filled in by build task
        , appDependencies: [
            '"ngRoute"',
            '"ngTouch"'
        ] //
        , filename: '<%= pkg.name %>'  //
        , meta: {
            modules: 'angular.module("<%= pkg.shortName %>", ["<%= appModule %>"]);',
            all: 'angular.module("<%= pkg.shortName %>", [<%= appDependencies %>,"<%= pkg.shortName %>-tpls","<%= appModule %>"]);'
        }, endInit: {
            web: 'angular.bootstrap(window.document, ["<%= pkg.shortName %>"]);',
            phoneGap: 'document.addEventListener("deviceready", function () {<%= endInit.web %>});',
            phoneGapSrc: '<script src="cordova.js"></script>'
        }
    });

    grunt.loadTasks('./grunt/server');
    grunt.registerTask('default', ['connect']);

    grunt.loadTasks("./grunt/prepare");
    grunt.registerTask('prepare', ['copy-base-lib', 'copy-font', 'wraper-hammer']);

    grunt.loadTasks('./grunt/dev');

    grunt.registerTask('dev-build', ['angular-convert-tpls', 'angular-concat-modules', 'build-less']);
    grunt.registerTask('dev-to-dist', ['build-html-index', 'copy-html', 'copy-script', 'copy-css', 'copy-res']);

    grunt.registerTask('dev', ['dev-build', 'dev-to-dist']);

    grunt.config('watch', {
        tpls: {
            files: ['<%= src %>/html/tpls/**/**.html'],
            tasks: ['angular-convert-tpls']
        },
        htmlIndex: {
            files: ['<%= src %>/html/index/**.html'],
            tasks: ['build-html-index']
        },
        htmlCopy: {
            files: ['<%= src %>/html/partials/**/**.html'],
            tasks: ['copy-html']
        },
        scripts: {
            files: ['<%= src %>/js/**/**.js'],
            tasks: ['angular-concat-modules', 'copy-script']
        },
        less: {
            files: ['<%= src %>/less/**/**.less'],
            tasks: ['build-less', 'copy-css']
        },
        res: {
            files: ['<%= src %>/res/**/**'],
            tasks: ['copy-res']
        }
    });

    grunt.loadTasks('./grunt/package');
    grunt.registerTask('package', ['prepare', 'dev-build', 'script-uglify', 'dev-to-dist']);
    grunt.registerTask('package-to-app', ['build-android', 'prepare', 'dev-build', 'dev-to-dist', 'app-build']);

    return grunt
};


