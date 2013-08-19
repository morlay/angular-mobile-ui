module.exports = function (grunt) {

    grunt.config('ngtemplates', {
        app: {
            options: {
                base: 'src/html/tpls', prepend: 'tpls/', module: {
                    name: '<%= pkg.shortName %>-tpls',
                    define: true
                }
            }  //
            , src: 'src/html/tpls/**/**.html' //
            , dest: '<%= build %>/tmp/tpls.js'  //
        }
    });

    grunt.registerTask('angular-convert-tpls', ['ngtemplates']);

    return grunt;
};

