angular.module("app.tools.notice", [

    ])
    .controller('NoticeCtrl', [
        '$scope'
        , '$navigate'
        , function ($scope, $navigate) {

            $scope.noticeList = [

                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '行政处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '学院', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '教师', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}
            ];

            $scope.showMoreNotice = function () {
                $navigate.go('/notice-info')
            }

        }
    ])
    .controller('NoticeInfoCtrl', [
        '$scope'
        , '$navigate'
        , function ($scope, $navigate) {

            $scope.noticeList = [

                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}    ,
                {from: '教务处', title: 'XXX 会议', content: 'adfasdf adf asdfasfasdfasdfasdf'}


            ];



        }
    ]);