angular.module('ui.common.lazy-compile', [])
    .directive("lazyCompile", [
        '$timeout'
        , '$compile'
        , '$http'
        , function ($timeout, $compile, $http) {
            return {
                scope: {
                    lazyCompile: "="
                },
                replace: true,
                link: function (scope, element, attrs) {

                    element.html('<android-loadingbar></android-loadingbar>');
                    $compile(element.contents())(scope);
                    $timeout(function () {

                        $http.get(scope.lazyCompile).success(function (data) {
                            console.log(data);
                            element.html(data);
                            $compile(element.contents())(scope.$parent);
                        });

                    }, attrs.delay);
                }
            }
        }]);