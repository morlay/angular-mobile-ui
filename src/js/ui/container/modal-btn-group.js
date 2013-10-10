angular.module('ui.container.modal-btn-group', [])
    .factory('modalBtnGroupConfig', function () {
        this.gap = 60;
        this.deltaDeg = 3;
        return {
            gap: this.gap,
            deltaDeg: this.deltaDeg,
            r: (this.gap / 2) / Math.sin((this.deltaDeg / 2) * Math.PI / 180)
        }
    })
    .controller('ModalBtnGroupController', [
        '$scope'
        , function ($scope) {


            $scope.btnListLength = $scope.btnList.length;

            $scope.btnListFuncInner = function (btn) {
                $scope.btnListFunc(btn);
                $scope.isFold = false;
            }

        }])
    .directive("modalBtnGroup", function () {
        return {
            require: '^modalBtnGroup',
            restrict: 'EA',
            scope: {
                btnList: "=",
                btnListFunc: "="
            },
            replace: true,
            controller: 'ModalBtnGroupController',
            templateUrl: 'tpls/modal-btn-group/modal-btn-group.html',
            link: function (scope, element, attrs) {
            }
        }
    })
    .directive("mbgStyle", ['modalBtnGroupConfig', function (modalBtnGroupConfig) {
        return {
            require: '^modalBtnGroup',
            restrict: 'A',
            link: function (scope, element, attrs) {
                var index = (scope.btnListLength - scope.$eval(attrs.mbgStyle)) * modalBtnGroupConfig.deltaDeg;
                var styleString = [
                    'translate3d(-'
                    , (modalBtnGroupConfig.r - Math.cos(index * Math.PI / 180) * modalBtnGroupConfig.r)
                    , 'px,-'
                    , (Math.sin(index * Math.PI / 180) * modalBtnGroupConfig.r)
                    , 'px,0) rotate(-'
                    , index
                    , 'deg)'
                ].join('');
                element.css({
                    webkitTransform: styleString,
                    transform: styleString
                });
            }
        }
    }]);