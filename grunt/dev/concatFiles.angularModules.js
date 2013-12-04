module.exports = function (grunt) {

    var foundModules, modules;

    foundModules = {};
    modules = [];

    function dependenciesForModule(filePath) {
        var deps = [];
        grunt.file.defaultEncoding = 'utf8';
        grunt.file.expand(filePath)
            .map(grunt.file.read)
            .forEach(function (contents) {
                // Strategy: find where module is declared,
                // and from there get everything inside the [] and split them by comma
                var moduleDeclIndex = contents.indexOf('angular.module(');
                var depArrayStart = contents.indexOf('[', moduleDeclIndex);
                var depArrayEnd = contents.indexOf(']', depArrayStart);
                var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);


                // if all blank char …… fix the bug in some windows pc

                if (dependencies.match(/\S/) === null) {
                    return deps;
                }

                dependencies.split(',').forEach(function (dep) {
                    console.log(dep, dep.length);
                    if (dep.length > 0) {
                        var depName = dep.trim().replace(/['"]/g, '');
                        if (deps.indexOf(depName) < 0) {
                            deps.push(depName);
                            // Get dependencies for this new dependency
//                            deps = deps.concat(dependenciesForModule(depName));
                        }
                    }
                });
            });
        return deps;
    }

    function findModule(name) {
        if (foundModules[name] || name.length === 0) {
            // if have
            return;
        }
        console.log(name);


        function enquote(str) {
            return '"' + str + '"';
        }

        foundModules[name] = true;
        var module, isHasDeps, filePath;

        if (name.substring(0, 2) === "ng") {
            var ngName = name.toLowerCase().slice(2, name.length);

            filePath = [ grunt.config('bower'), "angular-" + ngName , "angular-" + ngName + ".js"].join("/");

            isHasDeps = false;
        } else if (name.split('/')[0] === "tpls") {
            filePath = [grunt.config('build'), 'html', name + ".js"].join("/");
            isHasDeps = false;
        } else {
            filePath = [grunt.config('src'), 'js', name + ".js"].join("/");
            isHasDeps = true;
        }

        module = {
            name: name,
//            moduleName: enquote(name),
            srcFiles: grunt.file.expand(filePath),
            dependencies: []
        };

        if (isHasDeps) {
            module.dependencies = dependenciesForModule(filePath);
        }

        if (module.dependencies.length > 0) {
            module.dependencies.forEach(findModule);
        }


        modules = modules.concat(module);
    }


    grunt.registerTask('concatFiles.angularModules', 'concatFiles.angularModules', function () {

        var srcFiles = [];

        findModule(grunt.config('appEnterModule'));

        modules.forEach(function (obj) {
            srcFiles = srcFiles.concat(obj.srcFiles);
        });

        console.log(modules);

        //        console.log('modules',modules);
        grunt.file.write(grunt.config('build') + '/ng.json', JSON.stringify(modules));


        grunt.config('concat.dist', {
            options: {
                banner: '(function(window, angular, undefined) { <%= meta %>\n',
                footer: '<%= isCordova?endInit.cordova:endInit.web %>\n })(window, window.angular);'
            },
            src: srcFiles,
            dest: '<%= build %>/js/<%= pkg.shortName %>-tpls-<%= version %>.js'
        });

        grunt.task.run(['concat:dist']);

    });

    return grunt;
};