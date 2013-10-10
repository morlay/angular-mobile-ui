module.exports = function (grunt) {
    grunt.registerTask('wraper-hammer', 'wraper-hammer', function () {
        grunt.config('concat.hammer', {
            options: {
                banner: "(function(window, undefined) {\n\'use strict\';\n",
                footer: "})(this);"
            },
            src: [
                '<%= bower %>/hammerjs/src/core.js'
                , '<%= bower %>/hammerjs/src/setup.js'
                , '<%= bower %>/hammerjs/src/instance.js'
                , '<%= bower %>/hammerjs/src/event.js'
                , '<%= bower %>/hammerjs/src/pointerevent.js'
                , '<%= bower %>/hammerjs/src/utils.js'
                , '<%= bower %>/hammerjs//src/detection.js'
                , '<%= bower %>/hammerjs/src/gestures.js'
                , '<%= misc %>/fixed/hammer-angular-outro.js'
            ], //src filled in by build task
            dest: '<%= src %>/js/utils/hammer.js'
        });
        grunt.task.run(['concat:hammer']);
    });
    return grunt;
};