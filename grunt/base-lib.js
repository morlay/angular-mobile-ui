module.exports = function (grunt) {

    grunt.registerTask('build-hammer', 'Create bootstrap build files', function () {

        grunt.config('concat.hammer', {
            options: {
                banner: "(function(window, undefined) {\n\'use strict\';\n",
                footer: "})(this);"
            },
            src: [
//                './misc/base-lib/hammer/src/intro.js'
                 './misc/base-lib/hammer/src/core.js'
                , './misc/base-lib/hammer/src/setup.js'
                , './misc/base-lib/hammer/src/instance.js'
                , './misc/base-lib/hammer/src/event.js'
                , './misc/base-lib/hammer/src/pointerevent.js'
                , './misc/base-lib/hammer/src/utils.js'
                , './misc/base-lib/hammer/src/detection.js'
                , './misc/base-lib/hammer/src/gestures.js'
//                , './misc/base-lib/hammer/src/outro.js'
                , './misc/base-lib/hammer-angular-outro.js'
            ], //src filled in by build task
            dest: './src/js/utils/hammer.js'
        });


        console.log(grunt.config('concat'));

        grunt.task.run(['concat:hammer']);
    });

    return grunt;
};