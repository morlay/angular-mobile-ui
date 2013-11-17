module.exports = function (grunt) {
    grunt.registerTask('copyFiles.css', 'copyFiles.css', function () {
        grunt.config('copy.css', {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['<%= build %>/css/styles.css'],
                    dest: '<%= dist %>/css/',
                    filter: 'isFile'
                }
            ]
        });
        grunt.task.run(['copy:css']);
    });
    return grunt;
};