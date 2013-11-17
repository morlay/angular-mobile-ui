module.exports = function (grunt) {
    grunt.registerTask('copyFiles.script', 'copyFiles.script', function () {
        grunt.config('copy.script', {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: [
                        '<%= build %>/js/<%= pkg.shortName %>-tpls-<%= version %>.js'
                    ],
                    dest: '<%= dist %>/js/',
                    filter: 'isFile'
                }
            ]
        });
        grunt.task.run(['copy:script']);
    });
    return grunt;
};