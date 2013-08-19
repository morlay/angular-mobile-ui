// 合并压缩 less 文件
// 文档 https://github.com/gruntjs/grunt-contrib-less
module.exports = function (grunt) {
    grunt.config('less', {
        dev: {
            options: {
                compress: true,
                yuicompress: false,
                optimization: 0
            },
            files: {
                "build/styles.css": "src/less/_index.less"
            }
        }
    });
    grunt.registerTask('build-less', ['less:dev']);
    return grunt;
};
