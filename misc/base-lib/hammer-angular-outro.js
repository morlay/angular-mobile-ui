if (!angular) {
    throw new Error("window.angular is not defined.");
}

var GESTURES = [
    'hold',
    'tap',
    'doubletap',
    'drag',
    'dragstart',
    'dragend',
    'dragup',
    'dragdown',
    'dragleft',
    'dragright',
    'swipe',
    'swipeup',
    'swipedown',
    'swipeleft',
    'swiperight',
    'transform',
    'transformstart',
    'transformend',
    'rotate',
    'pinch',
    'pinchin',
    'pinchout',
    'touch',
    'release'
];

// Create clean scope

var newScope;

angular.injector(['ng']).invoke(['$rootScope', function ($rootScope) {
    newScope = $rootScope.$new();
}]);

// Create module

var module = angular.module('utils.hammer', []);

module.factory('Hammer', function () {
    return Hammer;
});

GESTURES.forEach(function (gesture, idx) {
    var hammerGesture = 'hammer' + gesture[0].toUpperCase() + gesture.slice(1);

    module.directive(hammerGesture, ['$parse', function ($parse) {
        return function (scope, element, attr) {
            var args = newScope.$eval(attr[hammerGesture]),
                tapHandler,
                options,
                instance;

            if (typeof args === 'undefined') {
                tapHandler = $parse(attr[hammerGesture]);
            } else {
                tapHandler = $parse(args.fn);
                delete args.fn;
                options = args;
            }

            instance = Hammer(element[0], options).on(gesture, function (e) {
                scope.$apply(function () {
                    tapHandler(scope, { $event: e });
                });
            });
        };
    }]);
});


