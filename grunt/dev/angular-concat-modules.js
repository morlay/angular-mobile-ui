module.exports = function (grunt) {

    var foundModules = {};

    function findModule(name) {
        if (foundModules[name]) {
            return;
        }
        foundModules[name] = true;
        function enquote(str) {
            return '"' + str + '"';
        }

        var module = {
            name: name,
            moduleName: enquote(name),
            srcFiles: grunt.file.expand("src/js/" + name.replace(/\./g, '/') + ".js"),
            dependencies: dependenciesForModule(name)
        };
        module.dependencies.forEach(findModule);

        grunt.config('modules', grunt.config('modules').concat(module));

    }

    function dependenciesForModule(name) {
        var deps = [];
        grunt.file.expand('src/js/' + name.replace(/\./g, '/') + ".js")
            .map(grunt.file.read)
            .forEach(function (contents) {
                //Strategy: find where module is declared,
                //and from there get everything inside the [] and split them by comma
                var moduleDeclIndex = contents.indexOf('angular.module(');
                var depArrayStart = contents.indexOf('[', moduleDeclIndex);
                var depArrayEnd = contents.indexOf(']', depArrayStart);
                var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);
                dependencies.split(',').forEach(function (dep) {
                    if (dep.length > 0) {
                        var depName = dep.trim().replace(/['"]/g, '');
                        if (deps.indexOf(depName) < 0) {
                            deps.push(depName);
                            //Get dependencies for this new dependency
                            deps = deps.concat(dependenciesForModule(depName));
                        }
                    }
                });
            });
        return deps;
    }

    grunt.registerTask('angular-concat-modules', 'angular-concat-modules', function () {

        var _ = grunt.util._;

        findModule(grunt.config('appModule'));

        var modules = grunt.config('modules');

        grunt.config('srcModules', _.pluck(modules, 'moduleName'));

        var srcFiles = _.pluck(modules, 'srcFiles');

        console.log(modules);


        grunt.config('concat.dist', {
            options: {
                banner: '<%= meta.all %>\n',
                footer: '<%= isPhoneGap?endInit.phoneGap:endInit.web %>\n'
            },
            src: ["<%= build %>/tmp/tpls.js", srcFiles], //src filled in by build task
            dest: '<%= build %>/<%= filename %>-tpls-<%= version %>.js'
        });
        grunt.task.run(['concat:dist']);
    });

    return grunt;
};