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
			'../images/bird1.png',
			'../images/bird2.png',
			'../images/bird3.png'
		];

		this.animation = [0,1,2,1];

		this.frame = 0;
		this.rotation = 0;
		this.velocity = 0;
		this.gravity = 0.025;
		this.jumpSpeed = 0.5;
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
		/*if (this.controls.keys.right) {
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
		}*/
		if (this.velocity < 0) {
			this.upFlapSpeed = 0;
		}

		if (this.game.currentState === this.game.states.splash) {
			this.pos.y = this.game.WORLD_HEIGHT - 18 + Math.cos(this.game.frames/15);
			this.rotation = 0;
			
			if (this.controls.keys.space) {
				this.game.play();
				this.jump();
			}
		}
		else {
			if (this.controls.keys.space) {
				this.jump();
				this.upFlapSpeed = -4;
			}
			this.velocity += this.gravity;
			this.pos.y += this.velocity;

			// TODO: fix rotation
			if (this.velocity >= this.jumpSpeed) {
				console.log('rotating down');
				this.frame = 1;
				this.rotation = Math.min(Math.PI/2, this.rotation + 15);
			}
			else {
				console.log('rotating up');
				this.rotation = -7;
			}
		}

		this.checkCollisionWithBounds();

		var n = this.game.currentState === this.game.states.splash ? 10 : 5 + this.upFlapSpeed;
		this.frame += this.game.frames % n === 0 ? 1 : 0;
		this.frame %= this.animation.length;

		

		var i = this.animation[this.frame];

		// Update UI
		this.el.css('background', 'url(' + this.sprites[i] + ') no-repeat');
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) ' + 'rotate(' + this.rotation + 'deg)');
		this.el.css('background-size', '100% auto');
	}

	checkCollisionWithBounds () {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			return this.game.gameover();
		}
	}

	jump () {
		this.velocity = -this.jumpSpeed;
	}
}
