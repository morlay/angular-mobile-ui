angular.module("app.main", [
        'utils.hammer'
        , 'ui.common.lazy-compile'
        , 'utils.mobile-nav'
        , 'ui.container.drawer'
        , 'ui.container.error-alert'
        , 'app.nav.nav-left'
        , 'app.nav.nav-right'


        , 'utils.data-pool'

        , 'app.tools.logo'
        , 'app.tools.home'

        , 'app.tools.demo'

        , 'app.tools.news'

        , 'app.tools.map'
        , 'app.tools.calendar'

        , 'app.tools.daily'

        , 'app.tools.settings'
        , 'app.tools.notice'


    ])
    .constant('serverUrl', {
        "ws": "ws://42.96.185.197:8075/websocket",
//        "http": "http://192.168.1.102:8081/mobilecampus/",
        "http": "http://42.96.185.197:8080/mobilecampus/",
        "aliUrl": "http://mobilecampus.oss.aliyuncs.com/",
        "token": "327303566_hyJcb2OsmWilSWQdxcEs3ZN1jlNca5CvbElk3cXOL9Jkaompj2lvbklk3cXzL9Jsb2ipblupbWUdxcEzNzgyNTj2NzgIN8gs3ZGpn2txnW1l3cXd3dwdjZCsmS36MSwdioNljklk3cX1NdwdioNljkGebWUdxd3wMc3HMTE1MyJC"
    })
    .constant('toolList', [
        {name: "启动页", path: '/', templateUrl: "partials/tools/logo.html", controller: 'LogoCtrl'},
        {name: "智慧校园", path: '/home', templateUrl: "partials/tools/home.html", transition: "modal", controller: 'HomeCtrl'},

        {name: "新闻会议", navList: "home", icon: "home-icon-news", path: '/news', templateUrl: "partials/tools/news.html", controller: 'NewsCtrl'},
        {name: "新闻详情", path: '/news-info', templateUrl: "partials/tools/news-info.html", controller: 'NewsInfoCtrl'},


        {name: "校情展示", navList: "home", icon: "home-icon-school", path: '/school', templateUrl: "partials/tools/loginPage.html", controller: 'DemoCtrl'},
        {name: "巴士搜索", navList: "home", icon: "home-icon-bus", path: '/bus', templateUrl: "partials/tools/demo.html", controller: 'DemoCtrl'},

        {name: "地图搜索", navList: "home", icon: "home-icon-map", path: '/map', templateUrl: "partials/tools/map.html", controller: 'MapCtrl'},

        {name: "日程课表", navList: "home", icon: "home-icon-timetable", path: '/calendar', templateUrl: "partials/tools/calendar.html", controller: 'CalendarCtrl'},

        {name: "日常工作", navList: "home", icon: "home-icon-daily", path: '/daily', templateUrl: "partials/tools/daily.html", controller: 'DailyCtrl'},
        {name: "招生就业", navList: "home", icon: "home-icon-job", path: '/job', templateUrl: "partials/tools/demo.html", controller: 'DemoCtrl'},
        {name: "校园网", navList: "home", icon: "home-icon-wifi", path: '/wifi', templateUrl: "partials/tools/demo.html", controller: 'DemoCtrl'},


        {name: "设置", navList: "left", path: '/settings', templateUrl: "partials/tools/settings.html", controller: 'SettingsCtrl'} ,

        {name: "通知", path: '/notice', templateUrl: "partials/tools/notice.html", controller: 'NoticeCtrl'} ,
        {name: "通知列表", path: '/notice-info', templateUrl: "partials/tools/notice-info.html", controller: 'NoticeInfoCtrl'}

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
//            $routeProvider.otherwise({redirectTo: '/'});
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

            $rootScope.$on('$routeChangeSuccess', function (ev, msg) {
                $scope.pageHeading = msg.name;
            });


        }]);



