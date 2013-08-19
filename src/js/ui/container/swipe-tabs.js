angular.module('ui.container.swipe-tabs', ['utils.hammer'])
    .controller('SwipeTabsetController', ['$scope', '$element',
        function ($scope, $element) {

            var ctrl = this,
                tabs = ctrl.tabs = $scope.tabs = [];

            ctrl.select = function (tab, isHammer) {
                angular.forEach(tabs, function (item) {
                    item.active = false;
                });
                tab.active = true;
                if (!isHammer) {
                    $scope.showPane(tabs.indexOf(tab));
                }
            };

            ctrl.addTab = function addTab(tab) {
                tabs.push(tab);
                if (tabs.length === 1 || tab.active) {
                    ctrl.select(tab);
                }

            };

            ctrl.removeTab = function removeTab(tab) {
                var index = tabs.indexOf(tab);
                //Select a new tab if the tab to be removed is selected
                if (tab.active && tabs.length > 1) {
                    //If this is the last tab, select the previous tab. else, the next tab.
                    var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
                    ctrl.select(tabs[newActiveIndex]);
                }
                tabs.splice(index, 1);
            };
        }])
    .directive('swipeTabset', [
        '$window'
        , 'Hammer'
        , '$rootScope'
        , function ($window, Hammer, $rootScope) {
            return {
                restrict: 'EA',
                transclude: true,
                replace: true,
                require: '^swipeTabset',
                scope: {},
                controller: 'SwipeTabsetController',
                templateUrl: 'tpls/swipe-tabs/swipe-tabset.html',
                compile: function (elm, attrs, transclude) {
                    var container = elm.find('container'),
                        currentPane = 0,
                        isOtherDrag = false;

                    $rootScope.$on('domPulling', function (ev, msg) {
                        isOtherDrag = msg.isPulling;
                    });


                    return function (scope, element, attrs, tabsetCtrl) {


                        scope.tabsAbove = (scope.direction != 'below');
                        tabsetCtrl.$scope = scope;
                        tabsetCtrl.$transcludeFn = transclude;


                        scope.paneWidth = elm[0].offsetWidth;
                        // 自适应宽度
                        angular.element($window).bind("load resize orientationchange", function () {
                            scope.paneWidth = elm[0].offsetWidth;
                            scope.$apply();
                        });

                        function setContainerOffset(percent, animate) {
                            container.removeClass("animate");
                            if (animate) {
                                container.addClass("animate");
                            }
                            container.css({
                                "webkitTransform": "translate3d(" + percent + "%,0,0) scale3d(1,1,1)",
                                "transform": "translate3d(" + percent + "%,0,0) scale3d(1,1,1)"
                            });
                        }


                        scope.showPane = function (index) {
                            // between the bounds
                            index = Math.max(0, Math.min(index, scope.tabs.length - 1));
                            currentPane = index;
                            var offset = -((100 / scope.tabs.length) * currentPane);
                            setContainerOffset(offset, true);
                            tabsetCtrl.select(scope.tabs[currentPane], true);
                        };


                        function handleHammer(ev) {

                            // disable browser scrolling
                            ev.gesture.preventDefault();

                            switch (ev.type) {
                                case 'dragright':
                                case 'dragleft':
                                    // 在其他拖拽时，禁用当前
                                    if (!isOtherDrag) {

                                        var pane_offset = -(100 / scope.tabs.length) * currentPane;
                                        var drag_offset = ((100 / scope.paneWidth) * ev.gesture.deltaX) / scope.tabs.length;

                                        // slow down at the first and last pane
                                        if ((currentPane == 0 && ev.gesture.direction == 'right') ||
                                            (currentPane == scope.tabs.length - 1 && ev.gesture.direction == 'left')) {
                                            drag_offset *= .4;
                                        }
                                    } else {
                                        ev.stopPropagation();
                                    }

                                    setContainerOffset(drag_offset + pane_offset);
                                    break;

                                case 'swipeleft':
                                    scope.showPane(currentPane + 1);
                                    ev.gesture.stopDetect();
                                    break;

                                case 'swiperight':
                                    scope.showPane(currentPane - 1);
                                    ev.gesture.stopDetect();
                                    break;

                                case 'release':
                                    if (Math.abs(ev.gesture.deltaX) > scope.paneWidth / 2) {
                                        if (ev.gesture.direction == 'left') {
                                            scope.showPane(currentPane + 1);
                                        } else {
                                            scope.showPane(currentPane - 1);
                                        }
                                    } else {
                                        scope.showPane(currentPane);
                                    }
                            }


                            scope.$apply();

                        }

                        Hammer(container[0], { drag_lock_to_axis: true })
                            .on("release dragleft dragright swipeleft swiperight", handleHammer);

                    };
                }
            };
        }])

    .directive('swipeTab', ['$parse', '$http', '$templateCache', '$compile',
        function ($parse, $http, $templateCache, $compile) {
            return {
                require: '^swipeTabset',
                restrict: 'EA',
                replace: true,
                templateUrl: 'tpls/swipe-tabs/swipe-tab.html',
                transclude: true,
                scope: {
                    heading: '@',
                    onSelect: '&select', //This callback is called in contentHeadingTransclude
                    //once it inserts the tab's content into the dom
                    onDeselect: '&deselect'
                },
                controller: function () {
                    //Empty controller so other directives can require being 'under' a tab
                },
                compile: function (elm, attrs, transclude) {
                    return function postLink(scope, elm, attrs, tabsetCtrl) {
                        var getActive, setActive;
                        if (attrs.active) {
                            getActive = $parse(attrs.active);
                            setActive = getActive.assign;
                            scope.$parent.$watch(getActive, function updateActive(value) {
                                scope.active = !!value;
                            });
                            scope.active = getActive(scope.$parent);
                        } else {
                            setActive = getActive = angular.noop;
                        }

                        scope.$watch('active', function (active) {
                            setActive(scope.$parent, active);
                            if (active) {
                                tabsetCtrl.select(scope);
                                scope.onSelect();
                                elm.css({'width': '35%'});

                            } else {
                                scope.onDeselect();
                                elm.css({'width': 65 / (tabsetCtrl.tabs.length - 1) + '%'});

                            }
                        });


                        scope.disabled = false;
                        if (attrs.disabled) {
                            scope.$parent.$watch($parse(attrs.disabled), function (value) {
                                scope.disabled = !!value;
                            });
                        }

                        scope.select = function () {
                            if (!scope.disabled) {
                                scope.active = true;
                            }
                        };

                        tabsetCtrl.addTab(scope);
                        scope.$on('$destroy', function () {
                            tabsetCtrl.removeTab(scope);
                        });
                        if (scope.active) {
                            setActive(scope.$parent, true);
                        }


                        //We need to transclude later, once the content container is ready.
                        //when this link happens, we're inside a tab heading.
                        scope.$transcludeFn = transclude;
                    };
                }
            };
        }])

    .directive('swipeTabHeadingTransclude', function () {
        return {
            restrict: 'A',
            require: '^swipeTab',
            link: function (scope, elm, attrs, tabCtrl) {
                scope.$watch('headingElement', function updateHeadingElement(heading) {
                    if (heading) {
                        elm.html('');
                        elm.append(heading);
                    }
                });
            }
        };
    })

    .directive('swipeTabContentTransclude', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'A',
            require: '^swipeTabset',
            link: function (scope, elm, attrs) {
                var tab = scope.$eval(attrs.swipeTabContentTransclude);

                //Now our tab is ready to be transcluded: both the tab heading area
                //and the tab content area are loaded.  Transclude 'em both.
                tab.$transcludeFn(tab.$parent, function (contents) {
                    angular.forEach(contents, function (node) {
                        if (isTabHeading(node)) {

                            tab.headingElement = node;

                        } else {
                            elm.append(node);
                        }
                    });
                });
            }

        };
        function isTabHeading(node) {
            return node.tagName && (
                node.hasAttribute('swipe-tab-heading') ||
                    node.hasAttribute('data-tab-heading') ||
                    node.tagName.toLowerCase() === 'swipe-tab-heading' ||
                    node.tagName.toLowerCase() === 'data-tab-heading'
                );
        }
    }])

    .directive('swipeTabsetTitles', function ($http) {
        return {
            restrict: 'A',
            require: '^swipeTabset',
            templateUrl: 'tpls/swipe-tabs/swipe-tabset-titles.html',
            replace: true,
            link: function (scope, elm, attrs, tabsetCtrl) {
                if (!scope.$eval(attrs.swipeTabsetTitles)) {
                    elm.remove();
                } else {
                    //now that tabs location has been decided, transclude the tab titles in
                    tabsetCtrl.$transcludeFn(tabsetCtrl.$scope.$parent, function (node) {
                        elm.append(node);
                    });

                }
            }
        };
    });


