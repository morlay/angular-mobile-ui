angular.module("app.tools.logo", [
        'ui.widgets.facebook-loadingbar'
    ])
    .controller('LogoCtrl', [
        '$scope'
        , '$navigate'
        , '$timeout'
        , function ($scope, $navigate,$timeout) {
            $timeout(function () {
                $navigate.go('/home');
            }, 3000);
        }]);