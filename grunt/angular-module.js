module.exports = function (grunt) {

    // Common amu module containing all modules for src
    // findModule: Adds a given module to config

    // 自动获取路径中的 module


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
            srcFiles: grunt.file.expand("src/js/" + name.replace('.', '/') + ".js"),
            dependencies: dependenciesForModule(name)
        };
        module.dependencies.forEach(findModule);

        grunt.config('modules', grunt.config('modules').concat(module));

    }

    function dependenciesForModule(name) {
        var deps = [];
        grunt.file.expand('src/js/' + name.replace('.', '/') + ".js")
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

    grunt.registerTask('build', 'build by module require', function () {

        var _ = grunt.util._;

        findModule('app.main');

        var modules = grunt.config('modules');

        grunt.config('srcModules', _.pluck(modules, 'moduleName'));

        var srcFiles = _.pluck(modules, 'srcFiles');

        grunt.config('concat.dist.src', grunt.config('concat.dist.src')
            .concat(srcFiles));

        grunt.config('concat.dist_tpls.src', grunt.config('concat.dist_tpls.src')
            .concat(srcFiles));

//        grunt.task.run(['ngtemplates', 'concat', 'uglify']);
        grunt.task.run(['ngtemplates', 'concat']);
    });

    return grunt;
};