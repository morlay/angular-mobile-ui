module.exports = function (grunt) {

    grunt.config('uglify', {
        // 文档 https://github.com/gruntjs/grunt-contrib-uglify
        options: {
            mangle: true,   // 是否替换变量名
            report: 'gzip'
        },
        dist_tpls: {
            src: ['<%= build %>/js/<%= pkg.shortName %>-tpls-<%= version %>.js'],
            dest: '<%= build %>/js/<%= pkg.shortName %>-tpls-<%= version %>.js'
        }
    });

    grunt.registerTask('build.uglify', ['uglify']);

    return grunt;
};