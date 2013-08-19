module.exports = function (grunt) {
    grunt.registerTask('copy-html', 'Create bootstrap build files', function () {
        grunt.config('copy.partials', {
            files: [
                {
                    expand: true,
                    cwd: 'src/html/partials/',
                    src: ['**/**.html'],
                    dest: '<%= dist %>/partials/'

                }
            ]
        });
        grunt.task.run(['copy:partials']);
    });
    return grunt;
};