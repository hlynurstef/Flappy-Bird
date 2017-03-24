
/**
 * Bootstrap and start the game.
 */
$(function() {
    'use strict';

    var game = new Game($('.GameCanvas'));
    game.start();
});
