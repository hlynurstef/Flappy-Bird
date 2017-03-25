// All these constants are in em's, multiply by 10 pixels
// for 1024x576px canvas.
const SPEED = 30; // * 10 pixels per second
const WIDTH = 3;
const HEIGHT = 2.2;
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

		this.sprites = [
			'../images/bird_yellow_1.png',
			'../images/bird_yellow_2.png',
			'../images/bird_yellow_3.png'
		];

		this.animation = [0,1,2,1];

		this.frame = 0;
		this.rotation = 0;
		this.velocity = 0;
		this.gravity = 0.025;
		this.jumpSpeed = 0.6;
		this.upFlapSpeed = 0;

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

		switch (this.game.currentState) {
			case this.game.states.splash:
				this.splashState();
				break;
		
			default:
				this.gameState();
				break;
		}

		this.checkCollisionWithBounds();

		// Calculate speed of animation
		var n = this.game.currentState === this.game.states.splash ? 10 : 5 + this.upFlapSpeed;
		this.frame += this.game.frames % n === 0 ? 1 : 0;
		this.frame %= this.animation.length;

		// Convert rotation from radians to degrees
		var degrees = this.rotation * 180 / Math.PI;

		var i = this.animation[this.frame];

		// Update UI
		this.el.css('background', 'url(' + this.sprites[i] + ') no-repeat');
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) ' + 'rotate(' + degrees + 'deg)');
		this.el.css('background-size', '100% auto');
	}

	checkCollisionWithBounds () {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			this.game.gameSounds.play_sound('hit');
			this.jump();
			return this.game.gameover();
		}
	}

	jump () {
		this.velocity = -this.jumpSpeed;
		this.game.gameSounds.play_sound('jump');
	}

	splashState () {
		this.pos.y = this.game.WORLD_HEIGHT - 18 + Math.cos(this.game.frames/15);
		this.rotation = 0;
		
		if (this.controls.didJump()) {
			this.game.play();
			this.jump();
		}
	}

	gameState () {
		if (this.velocity < 0) {
			this.upFlapSpeed = 0;
		}

		if (this.controls.didJump()) {
			this.jump();
			this.upFlapSpeed = -4;
		}
		this.velocity += this.gravity;
		this.pos.y += this.velocity;

		// rotate down
		if (this.velocity >= this.jumpSpeed) {
			this.rotation = Math.min(Math.PI/2, this.rotation + 0.08);
		}
		else { // rotate up
			this.rotation = -0.25;
		}
	}
}
