angular.module("app.tools.home", [

    ])
    .controller('HomeCtrl', [
        '$scope'
        , '$navigate'
        , 'toolList'
        , function ($scope, $navigate, toolList) {

            $scope.navList = [];


            var index = 0;

            angular.forEach(toolList, function (item, key) {
                if (item.navList == "home") {
                    item.color = 'color-' + [index % 7];
                    index++;
                    $scope.navList.push(item);
                }
            });


            $scope.switchPage = function (nav) {
                $navigate.go(nav.path, 'slide');
            };


            $scope.showNotice = function () {
                $navigate.go('/notice', 'slide');
            };


        }]);