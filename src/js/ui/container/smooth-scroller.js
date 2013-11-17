angular.module('ui/container/smooth-scroller', [
        'ui/utils/dragger',
        'ui/utils/transformer',
        'tpls/smooth-scroller/pull-down-span',
        'tpls/smooth-scroller/pull-up-span',
        'tpls/smooth-scroller/smooth-scroller'
    ])
    // 恢复桌面端的事件响应，按键 和 滚轮
    .provider('$desktopScroller', function () {

        var KEYS = {
            38: 150, //up arrow -> up
            40: -150, //down arrow -> down
            32: -600 //spacebar -> down
        };
        this.key = function (keyCode, delta) {
            if (arguments.length > 1) {
                KEYS[keyCode] = delta;
            }
            return KEYS[keyCode];
        };

        var _mouseWheelDistanceMulti = 0.5;
        this.mouseWheelDistanceMulti = function (newMulti) {
            arguments.length && (_mouseWheelDistanceMulti = newMulti);
            return _mouseWheelDistanceMulti;
        };

        this.$get = ['$window', '$document', function ($window, $document) {

            $desktopScroller.mouseWheelDistanceMulti = _mouseWheelDistanceMulti;
            $desktopScroller.easeTimeMulti = 0.66;

            function $desktopScroller(elm, scroller) {
                var self = {};

                elm.bind('$destroy', function () {
                    $document.unbind('mousewheel', onMousewheel);
                    $document.unbind('keydown', onKey);
                });
                $document.bind('mousewheel', onMousewheel);
                $document.bind('keydown', onKey);

                function onMousewheel(e) {
                    var delta = e.wheelDeltaY * $desktopScroller.mouseWheelDistanceMulti;

                    if (!delta) {
                        return;
                    }

                    //Only go if the scroll is targeting this element
                    //We are on desktop when this is called, so we are less worried about performance
                    var target = angular.element(e.target);
                    while (target.length) {
                        if (target[0] === elm.parent()[0]) {
                            scroll(delta);
                            e.preventDefault();
                            break;
                        }
                        target = target.parent();
                    }
                }

                function scroll(delta) {
                    scroller.calculateHeight();
                    var newPos = scroller.transformer.pos.y + delta;
                    scroller.transformer.setTo({y: clamp(-scroller.scrollHeight, newPos, 0)});
                }

                var INPUT_REGEX = /INPUT|TEXTAREA|SELECT/i;

                function onKey(e) {
                    //Don't do key events if typing
                    if (document.activeElement && document.activeElement.tagName &&
                        document.activeElement.tagName.match(INPUT_REGEX)) {
                        return;
                    }

                    var delta = KEYS[e.keyCode || e.which];
                    if (delta) {
                        e.preventDefault();
                        if (scroller.transformer.changing) return;
                        scroller.calculateHeight();

                        var newPos = scroller.transformer.pos.y + delta;
                        newPos = clamp(-scroller.scrollHeight, newPos, 0);

                        if (newPos !== scroller.transformer.pos.y) {
                            var newDelta = newPos - scroller.transformer.pos.y;
                            var time = Math.abs(newDelta * $desktopScroller.easeTimeMulti);

                            scroller.transformer.easeTo({y: newPos}, time);
                        }
                    }
                }

                return self;
            }

            function clamp(a, b, c) {
                return $window.Math.min($window.Math.max(a, b), c);
            }

            return $desktopScroller;
        }];
    })
    .provider('$scrollerBar', function () {

        var _className = 'scroller-bar';

        this.className = function (classNameString) {
            _className = classNameString;
            return _className;
        };

        this.$get = function () {


            function $scrollerBar(elm) {
                var self = {};

                var barElm = angular.element('<div></div>').addClass(_className),
                    handleElm = angular.element('<div></div>');

                barElm.append(handleElm);
                elm.append(barElm);


                self.handleElm = handleElm;

                self.setHeight = function (screenHeight, height) {
                    self.rateY = screenHeight / height;

                    handleElm.data('$transformer.rateY', -self.rateY);

                    handleElm.css({
                        'height': self.rateY * 100 + '%'
                    });
                };


                return self;
            }


            return $scrollerBar;
        };
    })
    // 滚动机制
    .provider('$scroller', function () {

        var _supportDesktop = true;
        this.supportDesktop = function (newSupport) {
            _supportDesktop = !!newSupport;
            return _supportDesktop;
        };


        var _hasScrollerBar = true;
        this.hasScrollerBar = function (newBoolean) {
            _hasScrollerBar = !!newBoolean;
            return _hasScrollerBar;
        };

        var _decelerationRate = 0.001;
        this.decelerationRate = function (newDecelerationRate) {
            arguments.length && (_decelerationRate = newDecelerationRate);
            return _decelerationRate;
        };

        var _pastBoundaryScrollRate = 0.4;
        this.pastBoundaryScrollRate = function (newRate) {
            arguments.length && (_pastBoundaryScrollRate = newRate);
            return _pastBoundaryScrollRate;
        };

        var _minDistanceForAcceleration = 10;
        this.minDistanceForAcceleration = function (newMinScrollDistance) {
            arguments.length && (_minDistanceForAcceleration = newMinScrollDistance);
            return _minDistanceForAcceleration;
        };

        var _bounceBuffer = 40;
        this.bounceBuffer = function (newBounceBuffer) {
            arguments.length && (_bounceBuffer = newBounceBuffer);
            return _bounceBuffer;
        };


        var _bounceBackMinTime = 200;
        var _bounceBackDistanceMulti = 1.5;

        this.bounceBackMinTime = function (newBounceBackMinTime) {
            arguments.length && (_bounceBackMinTime = newBounceBackMinTime);
            return _bounceBackMinTime;
        };
        this.bounceBackDistanceMulti = function (newBounceBackDistanceMult) {
            arguments.length && (_bounceBackDistanceMulti = newBounceBackDistanceMult);
            return _bounceBackDistanceMulti;
        };

        //Quicker than Math.floor
        //http://jsperf.com/math-floor-vs-math-round-vs-parseint/69
        function floor(n) {
            return n | 0;
        }

        this.$get = [
            '$dragger',
            '$transformer',
            '$window',
            '$desktopScroller',
            '$scrollerBar',
            function ($dragger, $transformer, $window, $desktopScroller, $scrollerBar) {

                // 计算各种属性。
                function getContentRect(raw) {
                    var style, offTop, offBottom, top, bottom, height;
                    style = $window.getComputedStyle(raw);
                    offTop = parseInt(style.getPropertyValue('margin-top'), 10) + parseInt(style.getPropertyValue('padding-top'), 10);
                    offBottom = parseInt(style.getPropertyValue('margin-bottom'), 10) + parseInt(style.getPropertyValue('padding-bottom'), 10);

                    top = parseInt(style.getPropertyValue('top'), 10);
                    bottom = parseInt(style.getPropertyValue('bottom'), 10);
                    height = parseInt(style.getPropertyValue('height'), 10);

                    return {
                        top: offTop + (isNaN(top) ? 0 : top),
                        bottom: offBottom + (isNaN(bottom) ? 0 : bottom),
                        height: height
                    };
                }

                function bounceTime(howMuchOut) {
                    return  $window.Math.abs(howMuchOut) * _bounceBackDistanceMulti + _bounceBackMinTime;
                }


                function $scroller(elm, config) {
                    var self = {}, raw, parentElmContentRect, startCoords, startPosY, startedAt, deltaY, transformer, isPullDownAction, isPullUpAction;

                    raw = elm[0];


                    if (_hasScrollerBar) {
                        var scrollerBar = self.scrollerBar = new $scrollerBar(elm.parent());


                        transformer = self.transformer = new $transformer(elm, [
                            scrollerBar.handleElm
                        ]);
                    } else {
                        transformer = self.transformer = new $transformer(elm);
                    }


                    if (_supportDesktop) {
                        var desktopScroller = new $desktopScroller(elm, self);
                    }

                    parentElmContentRect = getContentRect(elm.parent()[0]);


                    // 计算滚动高度
                    self.calculateHeight = function () {

                        var rect = getContentRect(raw);
                        var screenHeight = parentElmContentRect.height;
                        //If our content doesn't fill the whole area, just act like it's
                        //exactly one screen tall for scrolling purposes
                        if (rect.height < screenHeight) {
                            self.scrollHeight = 0;
                        } else {
                            self.scrollHeight = rect.height - screenHeight + rect.top + rect.bottom;
                        }


                        if (_hasScrollerBar) {
                            scrollerBar.setHeight(screenHeight, rect.height);
                        }

                        return self.scrollHeight;
                    };

                    self.calculateHeight();


                    // 出范围判断，并且，激活下拉和上拉事件。
                    self.outOfBounds = function (pos) {
                        if (pos > 0) {
                            return pos;
                        }
                        if (pos < -self.scrollHeight) {
                            return pos + self.scrollHeight;
                        }
                        return false;
                    };


                    $dragger.bind(elm, {
                            'start': function (coords) {
                                if (transformer.changing) {
                                    transformer.stop();
                                }
                                self.calculateHeight();
                                startCoords = coords;
                                startPosY = transformer.pos.y;
                                startedAt = Date.now();
                            },
                            'move': function (coords) {
                                deltaY = coords.y - startCoords.y;

                                var newPos = startPosY + deltaY;
                                //If going past boundaries, scroll at 0.4 倍 速度
                                if (self.outOfBounds(newPos)) {
                                    if (config.isPullDownAction && newPos > 0) {
                                        config.pullDownAction(newPos);
                                    }

                                    if (config.isPullUpAction && newPos < -self.scrollHeight) {
                                        config.pullUpAction(newPos);
                                    }


                                    newPos = startPosY + floor(deltaY * _pastBoundaryScrollRate);

                                }
                                transformer.setTo({y: newPos});
                            },
                            'end': function (coords) {
                                deltaY = coords.y - startCoords.y;

                                if (self.outOfBounds(transformer.pos.y)) {

                                    // 边界运动
                                    if (config.isPullDownAction && transformer.pos.y > 0) {
                                        // 超出上边界
                                        config.pullDownActionEnd();
                                        self.checkBoundaries(60);
                                    } else if (config.isPullUpAction && transformer.pos.y < -self.scrollHeight) {
                                        // 超出上边界
                                        config.pullUpActionEnd();
                                        self.checkBoundaries(60);
                                    } else {
                                        self.checkBoundaries(0);
                                    }


                                } else if (Math.abs(deltaY) >= _minDistanceForAcceleration) {
                                    // 非边界运动
                                    var momentum = self.momentum({
                                        distanceY: deltaY,
                                        updatedAt: (Date.now()),
                                        startedAt: startedAt
                                    });
                                    if (momentum.position !== transformer.pos.y) {
                                        transformer.easeTo(
                                            {y: momentum.position},
                                            momentum.time, function () {
                                                self.checkBoundaries(0);
                                            }

                                        );
                                    }
                                }
                            }
                        }

                    );

                    self.checkBoundaries = function (fixHeight) {
                        self.calculateHeight();
                        var howMuchOut = self.outOfBounds(transformer.pos.y);
                        if (howMuchOut) {
                            var newPosition = howMuchOut > 0 ? (0 + fixHeight) : (-self.scrollHeight - fixHeight);
                            transformer.easeTo({y: newPosition}, bounceTime(howMuchOut));
                        }
                    };


                    self.momentum = function (dragData) {
                        self.calculateHeight();
                        var speed = $window.Math.abs(dragData.distanceY) / (dragData.updatedAt - dragData.startedAt);
                        var newPos = transformer.pos.y + (speed * speed) /
                            (2 * _decelerationRate) *
                            (dragData.distanceY < 0 ? -1 : 1);
                        var time = speed / _decelerationRate;
                        var howMuchOver = self.outOfBounds(newPos);
                        var distance;
                        if (howMuchOver) {
                            if (howMuchOver > 0) {
                                newPos = $window.Math.min(howMuchOver, _bounceBuffer);
                            } else if (howMuchOver < 0) {
                                newPos = $window.Math.max(newPos, -(self.scrollHeight + _bounceBuffer));
                            }
                            distance = $window.Math.abs(newPos - transformer.pos.y);
                            time = distance / speed;
                        }
                        return {
                            position: newPos,
                            time: floor(time)
                        };
                    };

                    return self;
                }

                return $scroller;
            }
        ]
        ;

    })
    .
    directive('smoothScroller', ['$scroller', function ($scroller) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                pullDownAction: '&',
                pullUpAction: '&',
                isLoading: '='
            },
            templateUrl: 'tpls/smooth-scroller/smooth-scroller',
            controller: function () {

            },
            link: function (scope, element, attrs) {

                element[0].addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);


                var scroller, container, breakpoint, isPullDownAction, isPullUpAction;

                container = element.find('container');
                breakpoint = 200;


                scope.isPullDownAction = (attrs.pullDownAction != undefined)
                scope.isPullUpAction = (attrs.pullUpAction != undefined);


                if (isPullDownAction) {
                    container.append()
                }

                scroller = new $scroller(container, {
                    isPullDownAction: scope.isPullDownAction,
                    pullDownAction: function (pos) {
                        scope.isPullingEnough = (pos >= breakpoint);
                        if (!scope.isPulling) {
                            scope.isPulling = true;
                        }
                        scope.$apply();

                    },
                    pullDownActionEnd: function () {
                        if (scope.isPullingEnough) {
                            scope.pullDownAction();
                        }
                        scope.$apply();
                    },
                    isPullUpAction: scope.isPullUpAction,
                    pullUpAction: function (pos) {
                        scope.isPullingEnough = (pos <= -scroller.scrollHeight - breakpoint);
                        if (!scope.isPulling) {
                            scope.isPulling = true;
                        }
                        scope.$apply();
                    },
                    pullUpActionEnd: function () {
                        if (scope.isPullingEnough) {
                            scope.pullUpAction();
                        }
                        scope.$apply();
                    }
                });


                scope.$watch('isLoading', function (value) {
                    if (!value) {
                        // 暂时归零
                        scroller.checkBoundaries(0);

                    }
                });
            }
        }
    }])
    .directive('pullDownSpan', function () {
        return {
            restrict: 'C',
            require: '^smoothScroller',
            templateUrl: 'tpls/smooth-scroller/pull-down-span',
            replace: true,
            link: function (scope, elm, attrs) {
                // 如果没被定义，自销毁。
                if (!scope.isPullDownAction) {
                    elm.remove();
                }
            }
        };
    })
    .directive('pullUpSpan', function () {
        return {
            restrict: 'C',
            require: '^smoothScroller',
            templateUrl: 'tpls/smooth-scroller/pull-up-span',
            replace: true,
            link: function (scope, elm, attrs) {

                // 如果没被定义，自销毁。
                if (!scope.isPullUpAction) {
                    elm.remove();
                }


            }
        };
    });



