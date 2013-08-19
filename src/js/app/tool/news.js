angular.module("app.tool.news", [])
    .controller('NewsCtrl', [
        '$scope'
        , '$navigate'
        , function ($scope, $navigate) {
            $scope.navList = [];


            $scope.switchPage = function (nav) {
                $scope.$emit('resetDrawerLeft');
                $navigate.go(nav.path, 'slide');
            };


        }]);