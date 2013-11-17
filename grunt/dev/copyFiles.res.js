module.exports = function (grunt) {
    grunt.registerTask('copyFiles.res', 'copyFiles.res', function () {
        grunt.config('copy.res', {
            files: [
                {
                    expand: true,
                    cwd: '<%= src %>/res/',
                    src: ['**/**'],
                    dest: '<%= dist %>'
                }
            ]
        });
        grunt.task.run(['copy:res']);
    });
    return grunt;
};