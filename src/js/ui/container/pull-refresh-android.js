angular.module('ui.container.pull-refresh-android', [
        'utils.hammer',
        'ui.widgets.android-loadingbar'
    ])

    .directive('pullRefreshAndroid', ['Hammer', '$compile', function (Hammer, $compile) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                pullRefreshAndroid: '&',
                isLoading: '='
            },
            templateUrl: 'tpls/pull-refresh-android/pull-refresh-android.html',
            controller: function () {
            },
            link: function (scope, element, attrs) {

                var container = element.find('span');


                function setWidth(height, animate) {
                    container.removeClass("animate");
                    if (animate) {
                        container.addClass("animate");
                    }
                    container.css({
                        width: (height / 4) + '%'
                    });
                }


                var addLoaderBar = function () {
                    container.html('<android-loadingbar></android-loadingbar>');
                    $compile(container.contents())(scope);
                };

                var removeLoaderBar = function () {
                    container.html('');
                };


                scope.$watch('isLoading', function (value) {
                    if (!value) {
                        removeLoaderBar();
                        setWidth(0, false);
                    } else {
                        addLoaderBar();
                        setWidth(400, true);
                    }
                });


                var handleHammer = function (ev) {
                    switch (ev.type) {
                        // reset element on start
                        case 'touch':
                            setWidth(0, true);
                            break;
                        // on release we check how far we dragged
                        case 'release':
                            if (!scope.isPulling) {
                                return;
                            }

                            // over the breakpoint, trigger the callback
                            if (ev.gesture.deltaY / 200 >= 1) {
                                scope.pullRefreshAndroid();


                            } else {
                                setWidth(0, true);
                            }

                            scope.isPulling = false;
                            scope.$emit('domPulling', {isPulling: scope.isPulling});
                            break;

                        // when we dragdown
                        case 'dragdown':


                            var scrollY = container[0].scrollTop;
                            if (scrollY > 5) {
                                return;
                            } else if (scrollY !== 0) {
                                container[0].scrollTop = 0;
                            }

                            if (!scope.isPulling) {
                                scope.isPulling = true;
                                scope.$emit('domPulling', {isPulling: scope.isPulling});
                            }


                            setWidth(ev.gesture.deltaY);


                            // stop browser scrolling
                            ev.gesture.preventDefault();


                            break;
                    }
                    scope.$apply();

                };
                Hammer(element[0])
                    .on("touch dragdown release", handleHammer);


            }

        };
    }]);


