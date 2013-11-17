angular.module("app/news/newsInfo", [
        'ngSanitize'
    ]).controller('NewsInfoCtrl', [
        '$scope'
        , '$rootScope'
        , '$routeParams'
        , '$window'
        , function ($scope, $rootScope, $routeParams, $window) {

            $scope.contentLoader = function () {
                $scope.$emit('getNewsInfo', {news: $routeParams});
            };


            // init

            $scope.contentLoader();

            $scope.actionBar = {
                icon: 'home-icon-news',
                viewList: [],
                curViewIndex: 0,
                isShowViewList: false,
                btns: [
                    {
                        name: '返回',
                        icon: 'fa fa-times',
                        actionFoo: function () {
                            $window.history.go(-1);
                        }
                    },
                    {
                        name: '刷新',
                        icon: 'fa fa-spinner fa-spin',
                        actionFoo: function () {
                            this.icon = 'fa fa-spinner fa-spin';
                            $scope.contentLoader();
                        },
                        resetFoo: function () {
                            this.icon = 'fa fa-refresh';
                        }
                    }
                ]
            };

            $scope.$on('updateNewsInfo', function (ev, msg) {

                if (msg.isReady) {
                    $scope.actionBar.btns[1].resetFoo();
//                    $scope.newsInfo = newsDataPool.newsCurInfo;
                }

            });

            $scope.$emit('refreshActionBar', $scope.actionBar);

        }]);