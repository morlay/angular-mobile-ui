angular.module("app.tool.course", [
        "ui.container.swipe-tabs",
        "ui.container.pull-refresh"
    ])
    .controller('CourseCtrl', [
        '$scope'
        , '$navigate'
        , function ($scope, $navigate) {
            $scope.navList = [];


//            $scope.switchPage = function (nav) {
//                $scope.$emit('resetDrawerLeft');
//                $navigate.go(nav.path, 'slide');
//            };


            $scope.rdImgSrc = 'http://lorempixel.com/800/600/?' + (new Date().getTime());

            $scope.isLoading = false;

            $scope.rdImg = function () {



                console.log('rdImg');
                $scope.isLoading = true;

                var preload = new Image();
                preload.onload = function () {
                    console.log('rdImg onloaded');
                    $scope.rdImgSrc = this.src;
                    $scope.isLoading = false;
                    $scope.$digest();
                };
                preload.src = 'http://lorempixel.com/800/600/?' + (new Date().getTime());

            };


        }]);