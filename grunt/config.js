module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        version: '<%= pkg.version %>',
        bower: 'bower_components',
        src: 'src',
        dist: 'dist',
        build: 'build',
        misc: 'misc',
        appEnterModule: 'app/main', // Angular Enter
        filename: '<%= pkg.name %>',   //
        isCordova: false,
        meta: 'angular.module("<%= pkg.shortName %>", ["<%= appEnterModule %>"]);',
        endInit: {
            web: 'angular.bootstrap(window.document, ["<%= pkg.shortName %>"]);',
            cordova: 'document.addEventListener("deviceready", function () {<%= endInit.web %>});'
        }
    });

    require('./tasks.js')(grunt);

    return grunt
};


