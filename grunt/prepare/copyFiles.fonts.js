module.exports = function (grunt) {
    grunt.registerTask('copyFiles.fonts', 'copyFiles.fonts', function () {
        grunt.config('copy.fonts', {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['<%= bower %>/font-awesome/fonts/**', '<%= bower %>/bootstrap/fonts/**' ],
                    dest: '<%= dist %>/fonts/',
                    filter: 'isFile'
                }
            ]
        });
        grunt.task.run(['copy:fonts']);
    });
    return grunt;
};