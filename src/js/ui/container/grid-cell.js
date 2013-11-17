angular.module('ui/container/grid-cell', [])
    .controller('GridCellSetController', [
        '$scope'
        , function ($scope) {

            // This array keeps track of the accordion cells
            this.cells = [];
            this.cellWidth = 100;
            this.cellHeight = 100;

            this.scope = $scope;


            this.addCell = function (CellScope) {
                var self = this;
                this.cells.push(CellScope);

                CellScope.$on('$destroy', function (event) {
                    self.removeCell(CellScope);
                });
            };

            this.removeCell = function (Cell) {
                var index = this.cells.indexOf(Cell);
                if (index !== -1) {
                    this.cells.splice(this.cells.indexOf(Cell), 1);
                }
            };

        }])
    .directive('gridCellSet', [
        '$window'
        , function ($window) {
            return {
                restrict: 'EA',
                controller: 'GridCellSetController',
                transclude: true,
                replace: true,
                template: '<div class="grid-cell-set" ng-transclude></div>',
                compile: function compile(tElement, tAttrs, transclude) {
                    var col = tAttrs.col ? tAttrs.col : 1;
                    var row = tAttrs.row ? tAttrs.row : 1;

                    return  function postLink(scope, iElement, iAttrs, gridCellSetController) {

                        gridCellSetController.cellHeight = iElement[0].offsetHeight / row;
                        // offsetWidth 无法取值，只好用百分比
                        gridCellSetController.cellWidth = 1 / col * 100;

                    }
                }
            }
        }])

    .directive('gridCell', [
        '$window'
        , function ($window) {
            return {
                require: '^gridCellSet',         // We need this directive to be inside an accordion
                restrict: 'EA',
                transclude: true,              // It transcludes the contents of the directive into the template
                replace: true,                // The element containing the directive will be replaced with the template
                template: '<div class="grid-cell" ng-transclude></div>',
                link: function (scope, iElement, iAttrs, gridCellSetController) {
                    iElement.css({
                        width: gridCellSetController.cellWidth + "%",
                        height: gridCellSetController.cellHeight + "px"});
                    gridCellSetController.addCell(scope);
                }
            }
        }]);
