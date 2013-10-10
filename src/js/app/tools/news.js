angular.module("app.tools.news", [
        "utils.data-pool" ,
        'ui.container.swipe-tabs',
        "ui.container.pull-refresh-android"
    ])
    .factory('newsDataPool', [
        '$rootScope'
        , 'httpMessageTypes'
        , 'httpData'
        , 'dataPool'
        , function ($rootScope, httpMessageTypes, httpData, dataPool) {

            //获取新闻列表  offset  newsType
            //响应  newsList(newsId schoolId userId realName title newsType imgNameList(只显示一张图片)) 列表不返回新闻内容 offset totalPages limit
            httpMessageTypes['GET_SCHOOL_NEWS'] = "news/getSchoolNews.do";
            //获取新闻详细  newsId
            //响应  newsInfo(newsId schoolId userId realName title content newsType imgNameList)
            httpMessageTypes['GET_NEWS_INFO'] = "news/getNewsInfo.do";


            var news = {};
            news.newsTags = [
                {id: 1, name: '学校要闻', newsList: [{}], offset: 0, isLoading: false},
                {id: 2, name: '综合新闻', newsList: [{}], offset: 0, isLoading: false},
                {id: 3, name: '会议讲座', newsList: [{}], offset: 0, isLoading: false}
            ];


            news.newsCurInfo = {};


            $rootScope.$on('getNewsList', function (ev, msg) {
                httpData.post('GET_SCHOOL_NEWS', {offset: msg.newTag.offset, newsType: msg.newTag.id}, function (data) {
                        console.log('GET_SCHOOL_NEWS');
                        console.log(data);

                        if (msg.newTag.offset == 1) {
                            msg.newTag.newsList = data.newsList;
                        } else {
                            msg.newTag.newsList = msg.newTag.newsList.concat(data.newsList);
                        }

                        msg.newTag.isLoading = false;

                        $rootScope.$emit('updateNewsList', {isReady: true});
                    }
                );

            });

            $rootScope.$on('getNewsInfo', function (ev, msg) {

                console.log('getNewsInfo');
                httpData.post('GET_NEWS_INFO', {newsId: msg.news.newsId}, function (data) {
                    console.log('GET_NEWS_INFO');
                    console.log(data);
                    news.newsCurInfo = data.newsInfo;
                    $rootScope.$emit('updateNewsInfo', {isReady: true});
                });
            });

            dataPool.news = news;

            return news;
        }])
    .controller('NewsCtrl', [
        '$scope'
        , '$navigate'
        , '$http'
        , 'newsDataPool'
        , function ($scope, $navigate, $http, newsDataPool) {

            console.log(newsDataPool);

            $scope.$navigate = $navigate;

            $scope.newsTags = newsDataPool.newsTags;

            $scope.contentLoader = function (newTag) {
                newTag.isLoading = true;
                newTag.offset = 1;
                $scope.$emit('getNewsList', {newTag: newTag});
            };


            $scope.showMore = function (newTag) {
                newTag.isLoading = true;
                newTag.offset += 1;
                $scope.$emit('getNewsList', {newTag: newTag});
            };


            $scope.$on('paneSwitchComplete', function (ev, msg) {
                // 切换后分栏

                angular.forEach($scope.newsTags, function (item) {
                    if (item.name == msg.currentPane.heading) {
                        $scope.contentLoader(item);
                    }
                });


            });


            $scope.readMore = function (news) {
                $scope.$emit('getNewsInfo', {news: news});
                $navigate.go('/news-info');
            };


        }])
    .controller('NewsInfoCtrl', [
        '$scope'
        , '$rootScope'
        , '$navigate'
        , 'newsDataPool'
        , function ($scope, $rootScope, $navigate, newsDataPool) {
            $scope.$navigate = $navigate;


            $rootScope.$on('updateNewsInfo', function (ev, msg) {
                $scope.isReady = msg.isReady;
                $scope.newsInfo = newsDataPool.newsCurInfo;
            });


        }]);