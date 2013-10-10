angular.module('ui.container.loader-shelter', [
        'ui.widgets.android-loadingbar'
    ])
    .directive("loaderShelter", ['$compile', function ($compile) {
        return {
            scope: {
                loaderShelter: "="
            },
            transclude: true,
            replace: true,
            template: '<div class="loader-shelter" ng-transclude></div>',
            compile: function compile(tElement, tAttrs, transclude) {
                return function (scope, elem, attrs) {


                    scope.$watch('loaderShelter', function (value) {
                        if (value) {
                            elem.html('<android-loadingbar></android-loadingbar>');
                            $compile(elem.contents())(scope);
                        } else {
                            transclude(scope.$parent, function (clone) {
                                tElement.html('');
                                tElement.append(clone);
                            });
                        }

                    });


                }
            }

        }
    }])
;