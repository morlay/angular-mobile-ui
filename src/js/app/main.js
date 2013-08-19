angular.module("app.main", [
        'utils.hammer'
        , 'utils.mobile-nav'
        , 'ui.container.drawer'
        , 'ui.container.error-alert'
        , 'app.nav.nav-left'
        , 'app.nav.nav-right'
        , 'app.tool.news'
        , 'app.tool.course'
    ])
    .constant('toolList', [
        {name: "载入动画", path: '/', templateUrl: "partials/tools/loader.html"}
        ,
        {name: "新闻", navList: "left", path: '/news', templateUrl: "partials/tools/news.html", transition: "modal", controller: 'NewsCtrl'}
        ,
        {name: "课程", navList: "left", path: '/course', templateUrl: "partials/tools/course.html", transition: "modal", controller: 'CourseCtrl'}
        ,
        {name: "设置", navList: "right", path: '/settings', templateUrl: "partials/tools/settings.html", transition: "modal"}
    ])
    .config([
        '$routeProvider',
        'toolList',
        function ($routeProvider, toolList) {
            var i = toolList.length, tool;
            while (i--) {
                tool = toolList[i];
                $routeProvider.when(tool.path, tool);
            }
            $routeProvider.otherwise({redirectTo: '/'});
        }])
    .run(['$route', '$http', '$templateCache', function ($route, $http, $templateCache) {
        // 预载缓存 toolList
        angular.forEach($route.routes, function (r) {
            if (r.templateUrl) {
                $http.get(r.templateUrl, {cache: $templateCache});
            }
        });
    }])
    .controller('MainCtrl', [
        '$scope'
        , '$rootScope'
        , '$navigate'
        , '$location'
        , function ($scope, $rootScope, $navigate, $location) {

//            // 刷新回首页
//            if ($location.path() != '/') {
//                $navigate.go('/');
//            }

            $scope.$navigate = $navigate;


            $scope.goLastPath = function () {
                // todo
                $navigate.go('/news');
            };

            $scope.toggleDrawerLeft = function () {
                $scope.$emit('toggleDrawerLeft');
            };

            $scope.toggleDrawerRight = function () {
                $scope.$emit('toggleDrawerRight');
            };

            $scope.showError = function (string) {
                $scope.$emit('showErrorAlert', {
                    content: string
                });
            };


        }]);



