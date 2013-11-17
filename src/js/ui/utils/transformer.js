angular.module('ui/utils/transformer', [])
    .factory('$nextFrame', ['$window', function ($window) {
        // 为多浏览器兼容 for requestAnimationFrame
        return $window.requestAnimationFrame ||
            $window.webkitRequestAnimationFrame ||
            $window.mozRequestAnimationFrame ||
            function fallback(cb) {
                return $window.setTimeout(cb, 17);
            };
    }])
    // 运动函数
    .provider('$transformer', function () {

        // 用于 CSS
        var timingFunction = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.timingFunction = function (newTimingFunction) {
            arguments.length && (timingFunction = newTimingFunction);
            return timingFunction;
        };


        // 以上内容可在 .config 中配置调用。

        // .config(['$transformer',function($transformer) {
        //     $transformer.timingFunction('cubic-bezier(0.25, 0.46, 0.45, 0.94)');
        // }]);

        this.$get = ['$window', '$nextFrame', '$sniffer', function ($window, $nextFrame, $sniffer) {


            // 浏览器前缀
            var prefix = $sniffer.vendorPrefix;
            // ie10, older webkit - expects lowercase. firefox, opera - uppercase
            if (prefix && prefix !== 'Moz' && prefix !== 'O') {
                prefix = prefix.substring(0, 1).toLowerCase() + prefix.substring(1);
            }


            var transformProp = prefix ? (prefix + 'Transform') : 'transform';
            var transformPropDash = prefix ? ('-' + prefix.toLowerCase() + '-transform') : 'transform';
            var transitionProp = prefix ? (prefix + 'Transition') : 'transition';
            var transitionEndProp = prefix ? (prefix + 'TransitionEnd') : 'transitionend';

            function transitionString(transitionTime) {
                return transformPropDash + ' ' + transitionTime + 'ms ' + timingFunction;
            }

            function transformString(x, y) {
                return 'translate3d(' + (x || 0) + 'px,' + (y || 0) + 'px,0)';
            }

            // Creates a transformer for an element
            // relationElmArr =[{elm:jQLiteObj,rate:{x:0,y:0}]
            function $transformer(elm, relationElmArr) {
                var self = {};
                var raw = elm[0], hasRelation;

                hasRelation = (typeof relationElmArr === 'object' && relationElmArr.length > 0);


                elm.bind('$destroy', function () {
                    self.pos = {};
                    changingDoneCallback = null;
                });

                self.pos = {x: 0, y: 0};

                //Gets the current x and y transform of the element
                self.updatePosition = function () {
                    var style = $window.getComputedStyle(elm[0]);
                    var matrix = (style[transformProp] || '')
                        .replace(/[^0-9-.,]/g, '')
                        .split(',');
                    if (matrix.length > 1) {
                        self.pos.x = parseInt(matrix[4], 10);
                        self.pos.y = parseInt(matrix[5], 10);
                    }
                    return self.pos;
                };
                self.updatePosition();

                var changingDoneCallback;

                elm.bind(transitionEndProp, onTransitionEnd);
                function onTransitionEnd() {
                    if (self.changing) {
                        self.stop(changingDoneCallback);
                    }
                }

                self.stop = function (done) {
                    //Stop transitions, and set self.pos to wherever we were.
                    raw.style[transitionProp] = '';


                    if (hasRelation) {
                        angular.forEach(relationElmArr, function (elm) {
                            elm.css(transitionProp, '');
                        })
                    }


                    self.updatePosition();
                    self.changing = false;

                    //On next frame, set our element's position - this wait is so the
                    //transition style on the element has time to 'remove' itself
                    $nextFrame(function () {
                        self.setTo(self.pos);
                        (done || angular.noop)();
                    });
                };


                self.easeTo = function (pos, transitionTime, done) {
                    if (!angular.isNumber(transitionTime) || transitionTime < 0) {
                        throw new Error("Expected a positive number for time, got '" +
                            transitionTime + "'.");
                    }
                    //If we're currently animating, we need to stop before we try to
                    //animate differently.
                    if (self.changing) {
                        self.stop(doTransition);
                    } else {
                        doTransition();
                    }
                    function doTransition() {
                        elm.css(transitionProp, transitionString(transitionTime));

                        if (hasRelation) {
                            angular.forEach(relationElmArr, function (elm) {
                                elm.css(transitionProp, transitionString(transitionTime));
                            })
                        }

                        self.changing = true;
                        changingDoneCallback = done;

                        //On next frame, start transition - this wait is so the transition
                        //style on the element has time to 'apply' itself before the elm's
                        //position is set
                        $nextFrame(function () {
                            self.setTo(pos);
                        });
                    }
                };

                //Allow setting with setTo(x,y) or setTo({x:x, y:y})
                self.setTo = function (pos) {


                    angular.isDefined(pos.x) && (self.pos.x = pos.x);
                    angular.isDefined(pos.y) && (self.pos.y = pos.y);

                    elm.css(transformProp, transformString(self.pos.x, self.pos.y));

                    if (hasRelation) {
                        angular.forEach(relationElmArr, function (elm) {
                            var rate = {};
                            rate.x = elm.data('$transformer.rateX');
                            rate.y = elm.data('$transformer.rateY');
                            rate.x = rate.x ? rate.x : 0;
                            rate.y = rate.y ? rate.y : 0;

                            elm.css(transformProp, transformString(self.pos.x * rate.x, self.pos.y * rate.y));
                        })
                    }
                };

                self.clear = function () {
                    elm.css(transformProp, '');
                    elm.css(transitionProp, '');

                    if (hasRelation) {
                        angular.forEach(relationElmArr, function (elm) {
                            elm.css(transformProp, '');
                            elm.css(transitionProp, '');
                        })
                    }
                };

                return self;
            }

            $transformer.transformProp = transformProp;
            $transformer.transformPropDash = transformPropDash;
            $transformer.transitionProp = transitionProp;
            $transformer.transitionEndProp = transitionEndProp;


            return $transformer;
        }];
    });