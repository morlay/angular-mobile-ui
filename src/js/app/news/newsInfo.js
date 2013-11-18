angular.module("app/news/newsInfo", [
        "app/news/dataPool"
    ]).controller('NewsInfoCtrl', [
        '$scope'
        , '$rootScope'
        , '$routeParams'
        , '$window'
        , 'news.dataPool'
        , function ($scope, $rootScope, $routeParams, $window, dataPool) {

            $scope.contentLoader = function () {


                console.log($routeParams)

                dataPool.newsPost.get($routeParams, function (u, getResponseHeaders) {
                    console.log(u);
                    $scope.newsInfo = u.post;
                    $scope.$emit('updateNewsList', {isReady: true});
                });

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