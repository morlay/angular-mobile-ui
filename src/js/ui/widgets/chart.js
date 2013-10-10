angular.module("ui.widgets.chart", ["utils.chart"])
    .directive("chart", ["Chart", "$document", function (Chart, $document) {
        return {
            restrict: "A",
            scope: {
                data: "=",
                type: "@",
                options: "=",
                id: "@"
            },
            link: function (scope, elem, attrs) {

                if (attrs.autoWidth) {
                    elem.attr('width', $document[0].width - 20);
                }

                var ctx = elem[0].getContext("2d");
                var chart = Chart.chart(ctx);
                scope.$watch("data", function (newVal, oldVal) {
                    chart[scope.type](scope.data, scope.options);
                }, true);
            }
        }
    }]);