// build.jade
// doc https://github.com/gruntjs/grunt-contrib-jade
module.exports = function (grunt) {

    function getJadeFilesFrom(basePath) {
        var src, files, build, dest;
        build = grunt.config('build');
        src = grunt.config('src');
        files = {};

        grunt.file.recurse([src, "jade" , basePath].join('/'), function callback(abspath, rootdir, subdir, filename) {
                if (subdir) {
                    dest = [build, 'html', basePath , subdir , filename.replace('.jade', '.html')].join('/');

                } else {
                    dest = [build, 'html', basePath , filename.replace('.jade', '.html')].join('/');
                }
                files[dest] = abspath;
            }
        );

        return files;
    }

    var scripts = [
        'js/angular.js',
        'js/<%= pkg.shortName %>-tpls-<%= version %>.js'
    ];

    if (grunt.config('isCordova')) {
        scripts = ['cordova.js'].concat(scripts);
    }

    grunt.registerTask('build-jade-index', 'jade-index', function () {
        grunt.config('jade.index', {
            options: {
                data: {
                    debug: false,
                    scripts: scripts
                }
            },
            files: {
                "<%= build %>/html/index.html": "<%= src %>/jade/index.jade"
            }
        })
        ;


        grunt.task.run(['jade:index']);
    })
    ;

    grunt.registerTask('build-jade-views', 'jade-views', function () {
        var dist = grunt.config('dist');
        grunt.config('jade.views', {
            files: getJadeFilesFrom('views')
        });
        grunt.task.run(['jade:views']);
    });

    grunt.registerTask('build-jade-tpls', 'jade-tpls', function () {
        var dist = grunt.config('build');
        grunt.config('jade.tpls', {
            files: getJadeFilesFrom('tpls')
        });
        grunt.task.run(['jade:tpls']);
    });

    grunt.registerTask('build.jade', ['build-jade-index', 'build-jade-views', 'build-jade-tpls']);

    return grunt;
}
;
