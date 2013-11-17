angular.module("app/home/main", [
        'ui/container/swipe-tabs' ,
        'ui/container/grid-cell',

        'app/news/main'
    ])
    .config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/home', {
                name: "首页",
                templateUrl: "views/home/home.html",
                controller: 'HomeCtrl',
                parentPage: 'drawer',
                icon: 'fa fa-th-large'
            });
        }])
    .controller('HomeCtrl', [
        '$scope'
        , '$route'
        , '$location'
        , function ($scope, $route, $location) {

            $scope.navList = [];

            var index = 0;

            var navList = [];

            angular.forEach($route.routes, function (item, key) {
                if (item.parentPage == "home") {
                    item.color = 'color-' + [index % 7];
                    index++;
                    navList.push(item);
                }
            });


            // 分割对象
            function split(arr, size) {
                var arrays = [];
                while (arr.length > 0) {
                    arrays.push(arr.splice(0, size));
                }
                return arrays;
            }


            // Todo 修改这里的 7 为 9
            $scope.navList = split(navList, 7);


            $scope.switchPage = function (nav) {
                $location.path(!!nav.defaultPath ? nav.defaultPath : nav.originalPath);
            };

            $scope.actionBar = {
                icon: 'fa fa-th-large',
                viewList: [
                    {
                        name: '首页'
                    }
                ],
                curViewIndex: 0,
                isShowViewList: false,
                btns: [
                    {
                        name: '通知',
                        icon: 'fa fa-bell',
                        actionFoo: function () {
                            $location.path('/notice');
                        }
                    }
                ]
            };
            $scope.$emit('refreshActionBar', $scope.actionBar);

        }
    ]);
