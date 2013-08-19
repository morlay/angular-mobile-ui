angular.module('ui.container.drawer', [])
    .controller('DrawerController', [
        '$scope'
        , '$rootScope'
        , function ($scope, $rootScope) {
            var ctrl = this,
                drawers = ctrl.drawers = $scope.drawers = {
                    leftActive: false,
                    rightActive: false
                };


            $rootScope.$on('resetDrawerLeft', function () {
                $scope.drawers.leftActive = false;
            });

            $rootScope.$on('resetDrawerRight', function () {
                $scope.drawers.rightActive = false;
            });

            $rootScope.$on('toggleDrawerLeft', function () {
                $scope.drawers.leftActive = !$scope.drawers.leftActive;
                if ($scope.drawers.rightActive) {
                    $scope.$emit('resetDrawerLeft');
                }
            });
            $rootScope.$on('toggleDrawerRight', function () {
                $scope.drawers.rightActive = !$scope.drawers.rightActive;
                if ($scope.drawers.leftActive) {
                    $scope.$emit('resetDrawerLeft');
                }
            });

            $rootScope.$on('$routeChangeSuccess', function () {
                // Page 变化后将还原 仅左抽屉。
                if ($scope.drawers.leftActive) {
                    $scope.$emit('resetDrawerLeft');
                }
                if ($scope.drawers.rightActive) {
                    $scope.$emit('resetDrawerRight');
                }
            });
        }])
    .directive('drawer', function () {
        return {
            restrict: 'EA',
            templateUrl: 'tpls/drawer/drawer.html',
            controller: 'DrawerController',
            transclude: true,
            replace: true,
            scope: {
                drawerLeftTpl: '=',
                drawerRightTpl: '='
            }
        };
    });