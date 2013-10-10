module.exports = function (grunt) {
    var shell = require('shelljs');


    grunt.registerTask('app-init', 'app-init', function () {


        if (!shell.which('cordova')) {
            shell.echo('Sorry, this script requires cordova');
            shell.exit(1);
        }

        shell.rm('-rf', 'build/app');

        // Run external tool synchronously
        if (shell.exec('cordova create build/app com.example.hello "HelloWorld"').code !== 0) {
            shell.echo('Error: cordova create failed');
            shell.exit(1);
        }


        shell.cd('build/app');
        if (shell.exec('cordova platform add android').code !== 0) {
            shell.echo('Error: cordova platform add android failed');
            shell.exit(1);
        }


    });


    grunt.registerTask('app-build', 'app-build', function () {


        if (!shell.which('cordova')) {
            shell.echo('Sorry, this script requires cordova');
            shell.exit(1);
        }

        shell.cd('build/app');
        if (shell.exec('cordova build').code !== 0) {
            shell.echo('Error: cordova build failed');
            shell.exit(1);
        }


    });


    grunt.registerTask('build-android', 'build-android', function () {
            grunt.config('isPhoneGap', true);
            grunt.config('dist', '<%= build %>/app/www');

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
    )
    ;

    return grunt;
}
;