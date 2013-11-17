angular.module("app/news/main", [
        "app/news/newsInfo"
    ])
    .config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/news/category/:categoryId', {
                name: "新闻会议",
                defaultPath: '/news/category/1',
                templateUrl: "views/news/news-list.html",
                controller: 'NewsListCtrl',
                parentPage: 'home',
                icon: 'fa fa-list-alt'
            });
            $routeProvider.when('/news/category/:categoryId/post/:newsId', {
                name: "新闻详情",
                templateUrl: "views/news/news-info.html",
                controller: 'NewsInfoCtrl',
                parentPage: 'news'
            });
        }])
    .controller('NewsListCtrl', [
        '$scope'
        , '$location'
        , '$routeParams'
        , '$window'
        , function ($scope, $location, $routeParams, $window) {

            $scope.newsTags = [
                {id: 1, name: '学校要闻', newsList: [ ], offset: 0, hasFocus: true},
                {id: 2, name: '综合新闻', newsList: [ ], offset: 0, hasFocus: true},
                {id: 3, name: '会议讲座', newsList: [ ], offset: 0, hasFocus: false}
            ];


            $scope.contentLoader = function (newTag) {
                newTag.offset = 1;
                $scope.$emit('getNewsList', {newTag: newTag});
            };

            $scope.$watch('actionBar.curViewIndex', function (value) {
                $scope.actionBar.btns[0].actionFoo();
            });

            $scope.showMore = function (newTag) {
                $scope.actionBar.btns[0].actionFoo();
                newTag.offset += 1;
                $scope.$emit('getNewsList', {newTag: newTag});
            };


            $scope.updateFocusState = function (newTag) {
                newTag.hasFocus = !newTag.hasFocus;

                updateViewList();
                // todo wait backend
            };


            // init
            $scope.actionBar = {
                icon: 'home-icon-news',
                viewList: [],
                curViewIndex: 0,
                isShowViewList: false,
                btns: [
                    {
                        name: '刷新',
                        icon: 'fa fa-spinner fa-spin',
                        actionFoo: function () {
                            this.icon = 'fa fa-spinner fa-spin';
                            $scope.contentLoader($scope.newsTags[$scope.actionBar.curViewIndex]);
                        },
                        resetFoo: function () {
                            this.icon = 'fa fa-refresh';
                        }
                    },
                    {
                        name: '订阅',
                        icon: 'fa fa-rss',
                        actionFoo: function () {
                            $scope.isShowCategoryList = !$scope.isShowCategoryList;
                        }
                    }
                ]
            };

            // 读取完成后
            $scope.$on('updateNewsList', function (ev, msg) {
                if (msg.isReady) {
                    $scope.actionBar.btns[0].resetFoo();
                }
            });

            // 生成切换列表

            function updateViewList() {
                $scope.actionBar.viewList = [];
                $window.angular.forEach($scope.newsTags, function (item) {
                    if (item.hasFocus) {
                        item.actionFoo = function () {
                            $location.path('/news/category/' + item.id);
                        };
                        $scope.actionBar.viewList.push(item);
                    }
                });
            }

            updateViewList();

            $scope.actionBar.curViewIndex = parseInt($routeParams.categoryId) - 1;

            $scope.$emit('refreshActionBar', $scope.actionBar);


        }]);
