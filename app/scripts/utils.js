/**
 * Cross browser RequestAnimationFrame
 */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        'use strict';
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function */ callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

$(window).resize(function() {
    'use strict';
	var fontSize = Math.min(
        window.innerWidth / 32,
        window.innerHeight / 48
    );
    $('.GameCanvas').css('fontSize', fontSize + 'px');
});
