module.exports = function (grunt) {

    grunt.config('copy.script', {
        files: [
            {
                expand: true,
                flatten: true,
                src: [
                    '<%= build %>/<%= filename %>-tpls-<%= version %>.js'
                    , '<%= misc %>/base-lib/angular/angular.js'
                    , '<%= misc %>/base-lib/angular/angular-touch.js'
                    , '<%= misc %>/base-lib/angular/angular-route.js'
                ],
                dest: '<%= dist %>/js/',
                filter: 'isFile'
            }
        ]
    });

    grunt.registerTask('copy-script', ['copy:script']);
    return grunt;
};