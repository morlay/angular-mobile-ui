angular.module("ui.container.alert", [])
    .directive('alert', function () {
        return {
            restrict: 'EA',
            templateUrl: 'tpls/alert/alert.html',
            transclude: true,
            replace: true,
            scope: {
                type: '=',
                close: '&'
            },
            link: function (scope, iElement, iAttrs, controller) {
                scope.closeable = "close" in iAttrs;
            }
        };
    });
