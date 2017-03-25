
/**
 * Key codes we're interested in.
 */
var KEYS = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

/**
 * A singleton class which abstracts all player input,
 * should hide complexity of dealing with keyboard, mouse
 * and touch devices.
 * @constructor
 */
class Controls {
    constructor (game) {
        this.game = game;
        this._didJump = false;
        this.keys = {};
        $(window).on('keydown', this._onKeyDown.bind(this))
                    .on('keyup', this._onKeyUp.bind(this));
    }

    _onKeyDown (e) {
        if (this.game.currentState !== this.game.states.gameover) {
            // Only jump if space wasn't pressed.
            if (e.keyCode === 32 && !this.keys.space) {
                this._didJump = true;
            }

            // Remember that this button is down.
            if (e.keyCode in KEYS) {
                var keyName = KEYS[e.keyCode];
                this.keys[keyName] = true;
                return false;
            }
        }
    }

    _onKeyUp (e) {
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = false;
            return false;
        }
    }

    /**
     * Only answers true once until a key is pressed again.
     */
    didJump () {
        var answer = this._didJump;
        this._didJump = false;
        return answer;
    }
}    

