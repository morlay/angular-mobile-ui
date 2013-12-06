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

        grunt.config('copy.devMap', {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: [
                        '<%= misc %>/dev/ng-map.html'
                    ],
                    dest: '<%= build %>/',
                    filter: 'isFile'
                }
            ]
        });

        grunt.task.run(['copy:devMap']);


        function convertAngularTranslate() {

            var fromFilePath = [grunt.config('bower'), 'angular-translate', 'angular-translate.js'].join('/');
            var toFilePath = [grunt.config('src'), 'js', 'libs', 'translate.js'].join('/');

            var contents = grunt.file.read(fromFilePath).replace(/pascalprecht\.translate/g, 'libs\/translate');


            grunt.file.write(toFilePath, contents);
        }

        console.log('Convert Angular Translate');
        convertAngularTranslate();

    });


    return grunt;
};