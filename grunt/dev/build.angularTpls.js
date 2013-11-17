module.exports = function (grunt) {

    grunt.config('html2js', {
        dist: {
            options: {
                module: null, // no bundle module for all the html2js templates
                base: './<%= build %>/html/',
                rename: function (moduleName) {
                    return moduleName.replace('.html', '');
                }
            },
            files: [
                {
                    expand: true,
                    src: ['<%= build %>/html/tpls/**/*.html'],
                    ext: '.js'
                }
            ]
        }
    });

    grunt.registerTask('build.angularTpls', ['html2js']);

    return grunt;
};

