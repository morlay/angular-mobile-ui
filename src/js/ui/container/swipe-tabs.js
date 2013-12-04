angular.module('ui/container/swipe-tabs', [
        'ngTouch',
        'ui/utils/transformer',
        'tpls/swipe-tabs/swipe-tab',
        'tpls/swipe-tabs/swipe-tabset'
    ])
    .controller('SwipeTabsetController', [
        '$scope',
        function ($scope) {


            var self = this,
                panes = self.panes = $scope.panes = [];

            this.selectPane = function (pane) {
                angular.forEach(panes, function (item) {
                    item.active = false;
                });
                pane.active = true;
            };

            this.addPane = function (pane) {
                panes.push(pane);
                if (panes.length === 1 || pane.active) {
                    self.selectPane(pane);
                }
            };

            this.removeTab = function removeTab(tab) {
                var index = panes.indexOf(tab);
                //Select a new tab if the tab to be removed is selected
                if (tab.active && panes.length > 1) {
                    //If this is the last tab, select the previous tab. else, the next tab.
                    var newActiveIndex = index == panes.length - 1 ? index - 1 : index + 1;
                    this.selectPane(panes[newActiveIndex]);
                }
                panes.splice(index, 1);
            };

        }
    ])
    .directive('swipeTabset', [
        '$window',
        '$swipe',
        '$transformer',
        function ($window, $swipe, $transformer) {
            return {
                restrict: 'EA',
                transclude: true,
                replace: true,
                scope: {
                    panesScope: "="
                },
                controller: 'SwipeTabsetController',
                templateUrl: 'tpls/swipe-tabs/swipe-tabset',
                compile: function (elm, attrs, transclude) {
                    var container = elm.find('container'),
                        currentPane = 0;
                    var transformer = new $transformer(container);

                    elm[0].addEventListener('touchmove', function (e) {
                        e.preventDefault();
                    }, false);

                    return function (scope, element, attrs, ctrl) {


                        ctrl.$scope = scope;


                        scope.panesScope = scope.panes;


                        ctrl.$transcludeFn = transclude;

                        scope.paneWidth = elm[0].offsetWidth;
                        // 自适应宽度
                        angular.element($window).bind("load resize orientationchange", function () {
                            scope.paneWidth = elm[0].offsetWidth;
                            scope.$apply();
                        });


                        function outOfBounds(pos) {
                            if (pos > 0) {
                                return pos;
                            }
                            if (pos < -scope.paneWidth * scope.panes.length) {
                                return pos + scope.paneWidth * scope.panes.length;
                            }
                            return false;
                        }


                        function bounceTime(howMuchOut) {
                            return $window.Math.abs(howMuchOut) * 1.5 + 200;
                        }


                        // 修改的次数在移动端有限制，如果多次，会傲娇。

                        scope.showPane = function (index) {
                            currentPane = index;
                            transformer.easeTo({
                                x: -scope.paneWidth * currentPane
                            }, bounceTime(scope.paneWidth / 2));
                        };
                        scope.changePaneTo = function (index) {
                            currentPane = $window.Math.max(0, $window.Math.min(index, scope.panes.length - 1));

                            console.log(currentPane, index);

                            if (currentPane != index) {
                                scope.showPane(currentPane)
                            } else {
                                ctrl.selectPane(scope.panes[currentPane]);
                            }

                            return index;
                        };

                        function floor(n) {
                            return n | 0;
                        }


                        var startCoords, deltaX, startPosX, startedAt, deltaTime;

                        $swipe.bind(container, {
                            'start': function (coords) {
                                if (transformer.changing) {
                                    transformer.stop();
                                }
                                startCoords = coords;
                                startPosX = transformer.pos.x;
                                startedAt = (Date.now());
                            },
                            'move': function (coords) {
                                deltaX = coords.x - startCoords.x;
                                var newPos = startPosX + deltaX;
                                if (outOfBounds(newPos)) {
                                    newPos = startPosX + floor(deltaX * 0.3);
                                }
                                transformer.setTo({
                                    x: newPos
                                });
                            },
                            'end': function (coords) {
                                deltaX = coords.x - startCoords.x;
                                deltaTime = (Date.now()) - startedAt;


                                if (Math.abs(deltaX) > scope.paneWidth * 0.4 || (Math.abs(deltaX) > 10 && deltaTime < 200)) {
                                    if (deltaX < 0) {
                                        scope.changePaneTo(currentPane + 1);
                                    } else {
                                        scope.changePaneTo(currentPane - 1);
                                    }
                                } else {
                                    scope.showPane(currentPane);
                                }

                                scope.$apply();
                            }
                        });

                    };
                }
            };
        }
    ])

    .directive('swipeTab', [
        '$parse',
        function ($parse) {
            return {
                require: '^swipeTabset',
                restrict: 'EA',
                replace: true,
                templateUrl: 'tpls/swipe-tabs/swipe-tab',
                transclude: true,
                controller: function () {
                    //Empty controller so other directives can require being 'under' a tab
                },
                link: function (scope, iElement, iAttrs, ctrl) {
                    scope.ctrlScope = ctrl.$scope;

                    var getActive, setActive;
                    if (iAttrs.active) {
                        getActive = $parse(iAttrs.active);
                        setActive = getActive.assign;
                        scope.$parent.$watch(getActive, function (value) {
                            scope.active = !!value;
                        });
                        scope.active = getActive(scope.$parent);
                    } else {
                        setActive = getActive = angular.noop;
                    }

                    scope.$watch('active', function (active) {
                        setActive(scope.$parent, active);
                        if (active) {
                            ctrl.$scope.showPane(ctrl.$scope.panes.indexOf(scope));
                        }
                    });

                    ctrl.addPane(scope);


                    scope.$on('$destroy', function () {
                        ctrl.removeTab(scope);
                    });

                }
            };
        }
    ]);