module.exports = function (grunt) {

    grunt.config('ngtemplates', {
        app: {
            options: {
                url: function (url) {
                    return url.replace('src/html/tpls/', 'tpls/');
                },
                module: '<%= pkg.shortName %>-tpls',
                bootstrap: function (module, script) {
                    return 'angular.module("' + module + '",[]).run(["$templateCache", function($templateCache) {' + script + '}]);';
                },
                htmlmin: { collapseWhitespace: true }
            }  //
            , src: '<%= src %>/html/tpls/**/**.html' //
            , dest: '<%= build %>/tmp/tpls.js'  //
        }
    });

    grunt.registerTask('angular-convert-tpls', ['ngtemplates']);

    return grunt;
};

