angular.module("app.nav.nav-right", [])
    .controller('NavRightCtrl', [
        '$scope'
        , '$rootScope'
        , '$navigate'
        , 'toolList'
        , function ($scope, $rootScope, $navigate, toolList) {
            $scope.$navigate = $navigate;
            $scope.navList = [];

            angular.forEach(toolList, function (item) {
                if (item.navList == "right") {
                    $scope.navList.push(item);
                }
            });


            $scope.logout = function () {
                $navigate.go('/');
            };


            $scope.switchPage = function (nav) {
                $scope.$emit('resetDrawerLeft');
                $navigate.go(nav.path, 'slide');
            };

        }]);