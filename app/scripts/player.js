// All these constants are in em's, multiply by 10 pixels
// for 1024x576px canvas.
const SPEED = 30; // * 10 pixels per second
const WIDTH = 5;
const HEIGHT = 5;
const INITIAL_POSITION_X = 8;
const INITIAL_POSITION_Y = 8;

class Player {
	
	constructor (el, game) {
		this.el = el;
		this.game = game;
		this.pos = { 
			x: INITIAL_POSITION_X, 
			y: INITIAL_POSITION_Y 
		};
		this.controls = new Controls();
	}

	/**
	 * Resets the state of the player for a new game.
	 */
	reset () {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
	}

	onFrame (delta) {
		if (this.controls.keys.right) {
			this.pos.x += delta * SPEED;
		}
		if (this.controls.keys.left) {
			this.pos.x -= delta * SPEED;
		}
		if (this.controls.keys.down) {
			this.pos.y += delta * SPEED;
		}
		if (this.controls.keys.up) {
			this.pos.y -= delta * SPEED;
		}

		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	}

	checkCollisionWithBounds () {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			return this.game.gameover();
		}
	}
}
