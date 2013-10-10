angular.module('ui.widgets.facebook-loadingbar', [])
    .directive('facebookLoadingbar', function () {
        return {
            restrict: 'EA',
            replace: true,
            template: "<div class='facebook-loadingbar'><span></span><span></span><span></span></div>"
        }
    });