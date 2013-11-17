angular.module("app/notice/main", [    ])
    .config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/notice', {
                name: "通知",
                templateUrl: "views/notice/notice-list.html",
                controller: 'NoticeListCtrl'
            });
            $routeProvider.when('/notice-info', {
                name: "通知详情",
                templateUrl: "views/notice/notice-info.html",
                controller: 'NoticeInfoCtrl',
                parentPage: 'notice'
            });
        }])
    .controller('NoticeListCtrl', [
        '$scope'
        , '$location'
        , '$window'
        , function ($scope, $location, $window) {

            $scope.noticeList = [
                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '行政处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '学院', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '教师', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}
            ];

            $scope.showMoreNotice = function () {
                $location.path('/notice-info')
            };


            $scope.actionBar = {
                icon: 'fa fa-bell',
                viewList: [
                    {name: '未读通知'}
                ],
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
                }

            });

            $scope.$emit('refreshActionBar', $scope.actionBar);

        }
    ])
    .controller('NoticeInfoCtrl', [
        '$scope'
        , '$location'
        , '$window'
        , function ($scope, $location, $window) {

            $scope.noticeList = [

                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}


            ];


            $scope.actionBar = {
                icon: 'fa fa-bell',
                viewList: [
                    {name: '教务处'}
                ],
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

            $scope.$emit('refreshActionBar', $scope.actionBar);
        }
    ]);