// 监控文件变化并动态执行任务
// 如下设置是 js 文件夹的任一 js 文件有变化则执行合并
// less 文件夹下任一 less 文件有变化则执行 less 编译 watch 一般用于开发，所以这里设置了，即编译但不压缩
// 文档 https://github.com/gruntjs/grunt-contrib-watch
module.exports = function (grunt) {

    require('./subTasks/angular-convert-tpls.js')(grunt);
    require('./subTasks/angular-concat-modules.js')(grunt);

    require('./subTasks/build-less.js')(grunt);
    require('./subTasks/build-html-index.js')(grunt);

    require('./subTasks/copy-html.js')(grunt);
    require('./subTasks/copy-script.js')(grunt);
    require('./subTasks/copy-css.js')(grunt);


    grunt.config('watch', {
        tpls: {
            files: ['src/html/tpls/**/**.html'],
            tasks: ['angular-convert-tpls']
        },
        htmlIndex: {
            files: ['src/html/index/**.html'],
            tasks: ['build-html-index']
        },
        htmlCopy: {
            files: ['src/html/partials/**/**.html'],
            tasks: ['copy-html']
        },
        scripts: {
            files: ['src/js/**/**.js'],
            tasks: ['angular-concat-modules', 'copy-script']
        },
        less: {
            files: ['src/less/**/**.less'],
            tasks: ['build-less', 'copy-css']
        }
    });


    grunt.registerTask('dev-build', ['angular-convert-tpls', 'angular-concat-modules', 'build-less']);
    grunt.registerTask('dev-to-dist', ['build-html-index', 'copy-html', 'copy-script', 'copy-css']);

    grunt.registerTask('dev', ['dev-build', 'dev-to-dist']);


    return grunt;
};