module.exports = function (grunt) {

    require('../grunt/prepare.js')(grunt);
    require('../grunt/dev.js')(grunt);
    require('./subTasks/script-uglify.js')(grunt);

    grunt.registerTask('release', ['dev-build', 'script-uglify','dev-to-dist']);


    return grunt;
};