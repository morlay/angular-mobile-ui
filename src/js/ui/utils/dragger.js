angular.module('ui/utils/dragger', [])
    .factory('$dragger', [function () {
        // The total distance in any direction before we make the call on swipe vs. scroll.
        var MOVE_BUFFER_RADIUS = 40;

        function getCoordinates(event) {
            var touches = event.touches && event.touches.length ? event.touches : [event];
            var e = (event.changedTouches && event.changedTouches[0]) ||
                (event.originalEvent && event.originalEvent.changedTouches &&
                    event.originalEvent.changedTouches[0]) ||
                touches[0].originalEvent || touches[0];


            return {
                x: e.clientX,
                y: e.clientY
            };
        }

        return {
            bind: function (element, eventHandlers) {
                // Absolute total movement, used to control swipe vs. scroll.
                var totalX, totalY;
                // Coordinates of the start position.
                var startCoords;
                // Last event's position.
                var lastPos;
                // Whether a swipe is active.
                var active = false;

                element.on('touchstart mousedown', function (event) {
                    startCoords = getCoordinates(event);
                    active = true;
                    totalX = 0;
                    totalY = 0;
                    lastPos = startCoords;
                    eventHandlers['start'] && eventHandlers['start'](startCoords, event);
                });

                element.on('touchcancel', function (event) {
                    active = false;
                    eventHandlers['cancel'] && eventHandlers['cancel'](event);
                });

                element.on('touchmove mousemove', function (event) {
                    if (!active) return;

                    // Android will send a touchcancel if it thinks we're starting to scroll.
                    // So when the total distance (+ or - or both) exceeds 10px in either direction,
                    // we either:
                    // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
                    // - On totalY > totalX, we let the browser handle it as a scroll.

                    if (!startCoords) return;
                    var coords = getCoordinates(event);

                    totalX += Math.abs(coords.x - lastPos.x);
                    totalY += Math.abs(coords.y - lastPos.y);

                    lastPos = coords;

                    if (totalX > MOVE_BUFFER_RADIUS && totalY > MOVE_BUFFER_RADIUS) {
                        return;
                    }

                    // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
                    if (totalY < totalX) {
                        // Allow native scrolling to take over.
                        active = false;
                        eventHandlers['cancel'] && eventHandlers['cancel'](event);
                        return;
                    } else {
                        // Prevent the browser from scrolling.
                        event.preventDefault();
                        eventHandlers['move'] && eventHandlers['move'](coords, event);
                    }
                });

                element.on('touchend mouseup', function (event) {
                    if (!active) return;
                    active = false;
                    eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
                });
            }
        };
    }]);