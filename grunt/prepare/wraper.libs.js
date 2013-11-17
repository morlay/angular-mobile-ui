module.exports = function (grunt) {
    grunt.registerTask('wraper.libs', 'wraper.libs', function () {

        grunt.config('concat.XDate', {
            options: {
                banner: "angular.module('libs/xdate', []).provider('XDate', function () {this.$get = function () {",
                footer: "return XDate;}});"
            },
            src: [
                '<%= bower %>/xdate/src/xdate.js'
            ],
            dest: '<%= src %>/js/libs/xdate.js'
        });
        grunt.task.run(['concat:XDate']);


    });
    return grunt;
};