angular.module('ui.widgets.android-loadingbar', [])
    .directive('androidLoadingbar', function () {
        return {
            restrict: 'EA',
            replace: true,
            template: "<div class='android-loadingbar'><span></span><span></span><span></span><span></span></div>"
        }
    });