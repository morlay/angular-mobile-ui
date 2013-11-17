module.exports = function (grunt) {
    grunt.registerTask('copyFiles.html', 'copyFiles.res', function () {
        grunt.config('copy.html-views', {
            files: [
                {
                    expand: true,
                    cwd: '<%= build %>/html/views/',
                    src: ['**/**.html'],
                    dest: '<%= dist %>/views/'
                }
            ]
        });
        grunt.config('copy.html-index', {
            files: [
                {
                    expand: true,
                    cwd: '<%= build %>/html/',
                    src: ['index.html'],
                    dest: '<%= dist %>/'
                }
            ]
        });
        grunt.task.run(['copy:html-views', 'copy:html-index']);
    });
    return grunt;
};