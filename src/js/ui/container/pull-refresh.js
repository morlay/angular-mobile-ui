angular.module('ui.container.pull-refresh', ['utils.hammer'])

    .directive('pullRefresh', ['Hammer', function (Hammer) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                pullRefresh: '&',
                isLoading: '='
            },
            templateUrl: 'tpls/pull-refresh/pull-refresh.html',
            controller: function () {
            },
            link: function (scope, element, attrs) {

                var container = element.find('container')
                    , breakpoint = 60;


                function setHeight(height, animate) {
                    container.removeClass("animate");
                    if (animate) {
                        container.addClass("animate");
                    }
                    container.css({
                        webkitTransform: 'translate3d(0,' + height + 'px,0) scale3d(1,1,1)',
                        transform: 'translate3d(0,' + height + 'px,0) scale3d(1,1,1)'
                    });
                }


                scope.$watch('isLoading', function (value) {
                    if (!value) {
                        setHeight(0, true);
                    }
                });


                var handleHammer = function (ev) {
                    switch (ev.type) {
                        // reset element on start
                        case 'touch':
                            setHeight(0, true);
                            break;
                        // on release we check how far we dragged
                        case 'release':
                            if (!scope.isPulling) {
                                return;
                            }

                            // over the breakpoint, trigger the callback
                            if (ev.gesture.deltaY >= breakpoint) {
                                setHeight(60, true);
                                scope.pullRefresh();
                                // reset
                                scope.isPullingEnough = false;
                            } else {
                                setHeight(0, true);
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

                            scope.isPullingEnough = (ev.gesture.deltaY >= breakpoint);


                            if (!scope.isPulling) {
                                scope.isPulling = true;
                                scope.$emit('domPulling', {isPulling: scope.isPulling});
                            }


                            setHeight(ev.gesture.deltaY);


                            // stop browser scrolling
                            ev.gesture.preventDefault();


                            break;
                    }
                    scope.$apply();

                };
                Hammer(container[0])
                    .on("touch dragdown release", handleHammer);


            }

        };
    }]);


