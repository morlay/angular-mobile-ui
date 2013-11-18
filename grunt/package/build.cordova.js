module.exports = function (grunt) {
    var shell = require('shelljs');
    var cordovaPath = grunt.config('build') + '/cordova';
    var cordovaName = grunt.config('pkg.name');
    var cordovaOrganization = grunt.config('pkg.organization');

    grunt.registerTask('cordova.init', 'cordova.init', function () {
        if (!shell.which('cordova')) {
            shell.echo('Sorry, this script requires cordova');
            shell.exit(1);
        }
        shell.rm('-rf', cordovaPath);
        // Run external tool synchronously
        if (shell.exec(['cordova', 'create', cordovaPath, [cordovaOrganization, cordovaName].join('.'), cordovaName].join(' ')).code !== 0) {
            shell.echo('Error: cordova create failed');
            shell.exit(1);
        }
        shell.cd(cordovaPath);
        if (shell.exec('cordova platform add android').code !== 0) {
            shell.echo('Error: cordova platform add android failed');
            shell.exit(1);
        }
    });

    grunt.registerTask('cordova.add.plugins', 'cordova.add.plugins', function () {

        var plugins = grunt.file.readJSON(grunt.config('misc') + '/cordova/plugins.json');

        shell.cd(cordovaPath);
        plugins.forEach(function (pluginName) {
            shell.echo('cordova plugin add ' + pluginName);
            if (shell.exec('cordova plugin add ' + pluginName).code !== 0) {
                shell.echo('Error: cordova plugin add ' + pluginName + ' failed');
                shell.exit(1);
            }
        });
    });


    grunt.registerTask('cordova.prepare', 'cordova.prepare', function () {

        if (!shell.which('cordova')) {
            shell.echo('Sorry, this script requires cordova');
            shell.exit(1);
        }

        shell.cd(cordovaPath);
        if (shell.exec('cordova prepare').code !== 0) {
            shell.echo('Error: cordova build failed');
            shell.exit(1);
        }
    });

    grunt.registerTask('build.cordova', 'build.cordova', function () {
            grunt.config('isCordova', true);

            grunt.config('dist', '<%= build %>/cordova/www');

            grunt.config('clean.cordova', ["<%= dist %>"]);

            grunt.config('copy.cordova', {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= misc %>/cordova/config.xml'],
                        dest: '<%= dist %>/',
                        filter: 'isFile'
                    }
                ]
            });

            grunt.task.run(['clean:cordova', 'copy:cordova']);
        }
    );

    return grunt;
}
;