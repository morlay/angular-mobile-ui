module.exports = function (grunt) {
    require('./subTasks/build-hammer.js')(grunt);
    require('./subTasks/copy-font.js')(grunt);


    grunt.registerTask('prepare', ['build-hammer','copy-font']);

    return grunt;
};
