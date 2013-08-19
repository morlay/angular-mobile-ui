module.exports = function (grunt) {
    grunt.registerTask('copy-font', 'Create bootstrap build files', function () {
        grunt.config('copy.font', {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['misc/base-lib/font-awesome/font/**'],
                    dest: '<%= dist %>/font/',
                    filter: 'isFile'
                }
            ]
        });
        grunt.task.run(['copy:font']);
    });
    return grunt;
};