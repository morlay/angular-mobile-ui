angular.module("app/main", [
        'ngRoute',
        'ngAnimate',
        'ngTouch',

        'app/notice/main',
        'app/home/main'
    ])
    .run(['$route', '$http', '$templateCache', '$window', function ($route, $http, $templateCache, $window) {
        // preload the template of routes
        angular.forEach($route.routes, function (r) {
            if (r.templateUrl) {
                $http.get(r.templateUrl, {cache: $templateCache});
            }
        });
    }])
    .controller('MainCtrl', [
        '$scope'
        , '$rootScope'
        , '$route'
        , '$location'
        , '$window'
        , '$timeout'
        , function ($scope, $rootScope, $route, $location, $window, $timeout) {
            if ($location.path() === '') {
                $scope.isShowLogoPage = true;
                $timeout(function () {
                    $scope.isShowLogoPage = false;
                    $location.path('/home');
                }, 3000);
            } else {
                $scope.isShowLogoPage = false;
            }


            $scope.actionBar = {
                icon: 'fa fa-th-large',
                viewList: [],
                curViewIndex: 0,
                isShowViewList: false,
                btns: []
            };

            // init
            $scope.navDrawerList = [];

            $window.angular.forEach($route.routes, function (item, key) {
                if (item.parentPage == "drawer") {
                    $scope.navDrawerList.push(item);
                }
            });

            $scope.switchPage = function (nav) {
                $scope.hideNavDrawer();


                // 清空浏览器历史？
                $window.history.go(-$window.history.length);

                console.log($window.history);
                $location.path(nav.originalPath);
            };

            console.log($window.history);
            $scope.hideNavDrawer = function () {
                $scope.isShowNavDrawer = false;
            };

            function refreshNavDrawerActive(routeItem) {
                $window.angular.forEach($scope.navDrawerList, function (item, key) {
                    item.active = false;
                    if (routeItem.name === item.name) {
                        item.active = true;
                    }
                });
            }


            $rootScope.$on('$routeChangeSuccess', function (ev, msg) {
                refreshNavDrawerActive(msg.$$route);
            });


            $scope.$on('refreshActionBar', function (ev, msg) {
//                console.log('refreshActionBar', msg);
                $scope.actionBar = msg;
            });


        }]);









