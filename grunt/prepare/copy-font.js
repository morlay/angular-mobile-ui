module.exports = function (grunt) {
    grunt.registerTask('copy-font', 'Create bootstrap build files', function () {
        grunt.config('copy.lib-font', {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['<%= bower %>/font-awesome/font/**', '<%= bower %>/bootstrap/fonts/**' ],
                    dest: '<%= dist %>/font/',
                    filter: 'isFile'
                }
            ]
        });
        grunt.task.run(['copy:lib-font']);
    });
    return grunt;
};