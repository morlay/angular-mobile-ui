module.exports = function (grunt) {
    grunt.config('concat', {
        htmlIndex: {
            options: {
                footer: '\n<script src="js/angular.js"></script>\n' +
                    '<script src="js/angular-mobile.js"></script>\n' +
                    '<script src="js/<%= filename %>-tpls-<%= version %>.js"></script>\n' +
                    '</html>'
            },
            src: [
                'src/html/index/head.html',
                'src/html/index/body.html'
            ],
            dest: '<%= dist %>/index.html'
        }
    });
    grunt.registerTask('build-html-index', ['concat:htmlIndex']);
    return grunt;
};
