module.exports = function (grunt) {
    grunt.registerTask('copy-base-lib', 'copy-base-lib', function () {
        grunt.config('copy.baseLib', {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: [
                        '<%= bower %>/angular/angular.js',
                        '<%= bower %>/angular-route/angular-route.js',
                        '<%= bower %>/angular-touch/angular-touch.js'
                    ],
                    dest: '<%= dist %>/js/',
                    filter: 'isFile'
                }
            ]
        });
        grunt.task.run(['copy:baseLib']);
    });
    return grunt;
};