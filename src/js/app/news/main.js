angular.module("app/news/main", [
        "app/news/newsInfo",
        "app/news/dataPool"
    ])
    .config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/news/category/:categoryId', {
                name: "新闻会议",
                defaultPath: '/news/category/0',
                templateUrl: "views/news/news-list.html",
                controller: 'NewsListCtrl',
                parentPage: 'home',
                icon: 'fa fa-list-alt'
            });
            $routeProvider.when('/news/category/:categoryId/post/:postId', {
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
        , 'news.dataPool'
        , function ($scope, $location, $routeParams, $window, dataPool) {

            $scope.contentLoader = function (newTag) {
                newTag.offset = 1;
                dataPool.newsList.get({categoryId: newTag.id}, function (u, getResponseHeaders) {
                    console.log(u);
                    $scope.newsTags[newTag.id].newsList = u.newsPosts;

                    $scope.$emit('updateNewsList', {isReady: true});
                });
            };

            $scope.$watch('actionBar.curViewIndex', function (value) {

                console.log('actionBar.curViewIndex',value);
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
                            if (dataPool.newsTags.length > 0) {
                                $scope.contentLoader($scope.newsTags[$scope.actionBar.curViewIndex]);
                            }

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


            console.log(dataPool.newsTags.length)

            if (dataPool.newsTags.length === 0) {

                dataPool.categoryList.get(null, function (u, getResponseHeaders) {
                    $window.angular.forEach(u.newsTags, function (newsTag) {
                        newsTag.newsList = [];
                        newsTag.offset = 0;
                        newsTag.hasFocus = true;
                        dataPool.newsTags.push(newsTag);
                    });

                    $scope.newsTags = dataPool.newsTags;

                    console.log($scope.newsTags);
                    updateViewList();
                    $scope.actionBar.curViewIndex = parseInt($routeParams.categoryId);
                    $scope.actionBar.btns[0].actionFoo();
                });


            } else {
                $scope.newsTags = dataPool.newsTags;
                updateViewList();
                $scope.actionBar.curViewIndex = parseInt($routeParams.categoryId);
            }


            $scope.$emit('refreshActionBar', $scope.actionBar);


        }]);
