module.exports = function (grunt) {

    grunt.loadTasks('./grunt/server');
    grunt.loadTasks('./grunt/prepare');
    grunt.loadTasks('./grunt/package');
    grunt.loadTasks('./grunt/dev');

    grunt.config('watch', {
        jadeIndex: {
            files: ['<%= src %>/jade/index.jade', '<%= src %>/jade/includes/index/**.jade'],
            tasks: ['build-jade-index', 'copyFiles.html']
        },
        jadeTpls: {
            files: ['<%= src %>/jade/tpls/**/**.jade'],
            tasks: ['build-jade-tpls', 'build.angularTpls']
        },
        jadeViews: {
            files: ['<%= src %>/jade/views/**/**.jade', '<%= src %>/jade/includes/**/**.jade'],
            tasks: ['build-jade-views', 'copyFiles.html']
        },
        scripts: {
            files: ['<%= src %>/js/**/**.js'],
            tasks: ['concatFiles.angularModules', 'copyFiles.script']
        },
        less: {
            files: ['<%= src %>/less/**/**.less'],
            tasks: ['build.less', 'copyFiles.css']
        },
        res: {
            files: ['<%= src %>/res/**/**'],
            tasks: ['copyFiles.res']
        }
    });


//    grunt.registerTask('default', ['server.normal']);
    grunt.registerTask('default', ['server.node']);

    grunt.registerTask('prepare', ['copyFiles.baseLibs', 'copyFiles.fonts', 'wraper.libs']);

    grunt.registerTask('package', [
        'prepare',
        'build.less',
        'build.jade',
        'build.angularTpls',
        'concatFiles.angularModules',
        'build.uglify',
        'copyFiles.css',
        'copyFiles.script',
        'copyFiles.html'
    ]);

    grunt.registerTask('package.cordova', [
        'build.cordova',
        'package',
        'cordova.prepare'
    ]);


    return grunt
};
