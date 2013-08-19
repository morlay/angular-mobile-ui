// 本地服务器
// 长存进程
// 文档 https://github.com/gruntjs/grunt-contrib-connect
module.exports = function (grunt) {

    grunt.config('connect', {
        devServer: {
            options: {
                port: 80,
                hostname: '0.0.0.0',
                base: '<%= dist %>',
                keepalive: true,
                middleware: function (connect, options) {
                    return [
                        // Serve static files.
                        connect.static(options.base),
                        // Make empty directories browsable.
                        connect.directory(options.base)
                    ];
                }
            }
        }
    });

    return grunt;
};