angular.module("app/news/dataPool", [
        "ngResource"
    ]).factory("news.dataPool", [
        '$resource',
        function ($resource) {

            return {
                newsTags: [],
                categoryList: $resource('/api/news/categoryList/'),
                newsList: $resource('/api/news/category/:categoryId', {categoryId: '@id'}),
                newsPost: $resource('/api/news/category/:categoryId/post/:postId', {categoryId: '@id', postId: '@id'})
            }
        }]);