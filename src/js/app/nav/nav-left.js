angular.module("app.nav.nav-left", [])
    .controller('NavLeftCtrl', [
        '$scope'
        , '$rootScope'
        , '$navigate'
        , 'toolList'
        , function ($scope, $rootScope, $navigate, toolList) {
            $scope.navList = [];

            angular.forEach(toolList, function (item) {
                if (item.navList == "left") {
                    $scope.navList.push(item);
                }
            });


            $rootScope.$on('$routeChangeSuccess', function (event, msg) {
                angular.forEach($scope.navList, function (item) {
                    item.active = false;
                    if (msg.path == item.path) {
                        item.active = true;
                    }
                });
            });


//
//


            $scope.switchPage = function (nav) {
                $scope.$emit('resetDrawerLeft');
                $navigate.go(nav.path, 'slide');
            };

        }]);