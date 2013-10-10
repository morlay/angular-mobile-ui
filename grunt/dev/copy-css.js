module.exports = function (grunt) {
    grunt.registerTask('copy-css', 'Create bootstrap build files', function () {
        grunt.config('copy.css', {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= build %>/styles.css'],
                        dest: '<%= dist %>/css/',
                        filter: 'isFile'
                    }
                ]
            }
        );
        grunt.task.run(['copy:css']);
    });
    return grunt;
}
;