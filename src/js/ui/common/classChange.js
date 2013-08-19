angular.module('ui.common.classChange', [])
    .directive("transBy", function () {
        /**
         * dom 显示 or 隐藏
         * （控制节点 添加和删除 .show 或者其他 class 以 CSS3 实现动画切换）
         * Usage： <div trans-by="boolean" trans-class="className"></div>
         */
        return function (scope, element, attrs) {
            // 默认是 show 如果有自定义则为 attrs.transClass
            var transClass = "show";
            if (attrs.transClass) {
                transClass = attrs.transClass;
            }
            scope.$watch(attrs.transBy, function (value) {
                if (value) {
                    element.addClass(transClass);
                } else {
                    element.removeClass(transClass);
                }
            });
        }

    })
    .directive("toggleBoolean", function () {
        /**
         * 仅点击切换某个 scope true or false 绑定的是 mouseup 和 ng-click 不冲突
         * Usage： <div toggle-boolean="isShowNavigation"></div>
         *
         * warn: 如下写法会尝试一个闭包，阻止正常情况下内部值的传递，
         */
        return {
            replace: false,
            scope: {
                toggleBoolean: "="
            },
            link: function (scope, element, attrs) {
                element.bind('touchend mouseup', function () {
                    scope.toggleBoolean = !scope.toggleBoolean;
                    scope.$apply(); //  把值穿回去

                });

            }
        }
    })
    .directive("btnHasStyles", function () {
        /**
         * 鼠标 hover active 等模拟
         * Usage： <div btn-has-styles></div>
         */
        return function (scope, element, attrs) {
            element.bind('touchend mouseenter', function () {  /* 鼠标进入 */
                element.addClass("hover");
            });
            element.bind('touchstart mouseleave', function () {  /* 鼠标离开 */
                element.removeClass('hover');
            });
        }
    });


