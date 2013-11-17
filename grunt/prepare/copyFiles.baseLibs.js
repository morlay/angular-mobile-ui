module.exports = function (grunt) {
    grunt.registerTask('copyFiles.baseLibs', 'copyFiles.baseLibs', function () {
        grunt.config('copy.baseLibs', {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: [
                        '<%= bower %>/angular/angular.js'
                    ],
                    dest: '<%= dist %>/js/',
                    filter: 'isFile'
                }
            ]
        });
        grunt.task.run(['copy:baseLibs']);
    });
    return grunt;
};