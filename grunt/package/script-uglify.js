module.exports = function (grunt) {

    grunt.config('uglify', {
        // 文档 https://github.com/gruntjs/grunt-contrib-uglify
        options: {
            mangle: true,   // 是否替换变量名
            report: 'gzip'
        },
//        dist: {
//            src: ['<%= build %>/<%= filename %>-<%= version %>.js'],
//            dest: '<%= build %>/<%= filename %>-<%= version %>.js'
//        },
        dist_tpls: {
            src: ['<%= build %>/<%= filename %>-tpls-<%= version %>.js'],
            dest: '<%= build %>/<%= filename %>-tpls-<%= version %>.js'
        }
    });

    grunt.registerTask('script-uglify', ['uglify']);

    return grunt;
};