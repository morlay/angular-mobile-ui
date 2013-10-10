angular.module("app.tools.demo", [
        "ui.container.modal-btn-group"
    ])
    .controller('DemoCtrl', [
        '$scope'
        , '$navigate'
        , function ($scope, $navigate) {

            console.log('DemoCtrl');

            $scope.btnList = [
                {id: 0, title: '1111'},
                {id: 1, title: '2222'},
                {id: 2, title: '3333'},
                {id: 3, title: '4444'},
                {id: 4, title: '5555'}
            ];


            $scope.btnListFunc = function (btn) {
                console.log(btn);
            };


        }]);