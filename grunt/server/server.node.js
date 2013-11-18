// connect
// doc https://github.com/gruntjs/grunt-contrib-connect
module.exports = function (grunt) {

    var shell = require('shelljs');

    grunt.registerTask('server.node', 'server.node', function () {
        if (!shell.which('node')) {
            shell.echo('Sorry, this script requires node');
            shell.exit(1);
        }

        if (shell.exec('node server/server.js').code !== 0) {
            shell.echo('Error: node server/server.js failed');
            shell.exit(1);
        }

    });
    return grunt;
};