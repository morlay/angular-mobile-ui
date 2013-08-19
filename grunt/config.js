module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json') //
        , version: '<%= pkg.version %>' //
        , isPhoneGap: false //
        , dist: 'dist'  //
        , build: 'build'  //
        , appModule: 'app.main' //
        , modules: []  // to be filled in by build task
        , appDependencies: [
            '"ngMobile"'
        ] //
        , filename: '<%= pkg.name %>'  //
        , meta: {
            modules: 'angular.module("<%= pkg.shortName %>", ["<%= appModule %>"]);',
            all: 'angular.module("<%= pkg.shortName %>", ["<%= pkg.shortName %>-tpls","<%= appModule %>",<%= appDependencies %>]);'
        }, endInit: {
            web: 'angular.bootstrap(window.document, ["<%= pkg.shortName %>"]);',
            phoneGap: 'document.addEventListener("deviceready", function () {<%= endInit.web %>});'
        }
    });

    require('../grunt/connect.js')(grunt);
    require('../grunt/prepare.js')(grunt);
    require('../grunt/dev.js')(grunt);
    require('../grunt/release.js')(grunt);

    grunt.registerTask('default', ['connect']);

    return grunt
};


