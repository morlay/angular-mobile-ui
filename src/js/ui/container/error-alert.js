angular.module('ui.container.error-alert', [])
    .directive('errorAlert', [
        '$rootScope'
        , '$timeout'
        , function ($rootScope, $timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: "<div class=\"error-alert\"><span ng-bind='content'></span></div>",
                link: function (scope, elm, attrs) {
                    $rootScope.$on('showErrorAlert', function (event, msg) {
                        scope.content = msg.content;

                        elm.addClass('fade');
                        $timeout(function () {
                            elm.addClass('in');
                        }, 100);

                        $timeout(function () {
                            elm.removeClass('in');
                            $timeout(function () {
                                elm.removeClass('fade');
                            }, 500);
                        }, 4000);

                    });

                }
            };
        }]);