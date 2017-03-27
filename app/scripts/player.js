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

		this.sprites = {
			yellow: [
				'/images/bird_yellow_1.png',
				'/images/bird_yellow_2.png',
				'/images/bird_yellow_3.png'
			],
			blue: [
				'/images/bird_blue_1.png',
				'/images/bird_blue_2.png',
				'/images/bird_blue_3.png'
			],
			red: [
				'/images/bird_red_1.png',
				'/images/bird_red_2.png',
				'/images/bird_red_3.png'
			]
		}
		this.currentImage = this.sprites.yellow;

		this.animation = [0,1,2,1];

		this.frame = 0;
		this.rotation = 0;
		this.velocity = 0;
		this.gravity = 0.025;
		this.jumpSpeed = 0.52;
		this.upFlapSpeed = 0;
		this.gameOverLanding = false;
		this.falling = false;
		this.controls = new Controls(game);
		this.firstPlay = true;
		// Is true when character is moving from Intro screen pos to splash pos
		this.movingToStartPos = true;	
		this.currentPipe = -1;
	}

	/**
	 * Resets the state of the player for a new game.
	 */
	reset () {
		if (this.game.nightmareMode) {
			this.jumpSpeed = 0.35;
		}
		else {
			this.jumpSpeed = 0.52;
		}
		if(this.movingToStartPos) {
			this.pos.x = this.game.WORLD_WIDTH - 18;
			this.pos.y = this.game.WORLD_HEIGHT - 21;
		} else {
			this.pos.x = INITIAL_POSITION_X;
			this.pos.y = INITIAL_POSITION_Y;
		}
		
		this.falling = false;
		this.gameOverLanding = false;
		this.rotation = 0;
		this.velocity = 0;

		if (this.firstPlay) {
			this.firstPlay = false;
		}
		else {
			var random = Math.floor(Math.random() * (100 - 1)) % 3;
			switch (random) {
				case 0:
					this.currentImage = this.sprites.yellow;
					break;
				case 1:
					this.currentImage = this.sprites.blue;
					break;
				case 2:
					this.currentImage = this.sprites.red;
				default:
					break;
			}
		}
	}

	onFrame (delta) {
		switch (this.game.currentState) {
			case this.game.states.splash:
				this.splashState();
				break;
			case this.game.states.game:
				this.gameState();
				break;
			case this.game.states.gameover:
				this.gameOverState();
				break;
			case this.game.states.intro:
				this.introState();
				break;
			default:
				break;
		}

		this.checkCollisionWithBounds();

		if (this.game.currentState !== this.game.states.gameover) {
			// Calculate speed of animation
			if (!this.falling) {
				var n = (this.game.currentState === this.game.states.splash ||
						 this.game.currentState === this.game.states.intro) ? 15 : 5 + this.upFlapSpeed;
				this.frame += this.game.frames % n === 0 ? 1 : 0;
				this.frame %= this.animation.length;
			}
			else {
				this.frame = 1;
			}

			// Get animation sprite and render it
			var i = this.animation[this.frame];
			this.el.css('background', 'url(' + this.currentImage[i] + ') no-repeat');
		}
		
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) ' + 'rotate(' + this.rotation + 'rad)');
		this.el.css('background-size', '100% auto');

	}

	checkCollisionWithBounds () {
		if (this.pos.y < -10) {
			this.pos.y = -10;
		}
		
		if (this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {

			this.pos.y = this.game.WORLD_HEIGHT - HEIGHT;
			if (this.game.currentState !== this.game.states.gameover) {
				this.die();
			}
			else {
				this.gameOverLanding = false;
			}
		}
	}

	checkPipeCollision () {
		var pipe = this.game.pipes.pos[this.game.pipes.closestPipe];
		
		// Closest x coordinate
		var cx   = Math.min(Math.max(this.pos.x, pipe.x - (WIDTH/2)), pipe.x + this.game.pipes.width - (WIDTH/2));
		// Closest y coordinate of north pipe
		var cy1  = Math.min(Math.max(this.pos.y, pipe.y + pipe.yOffset), pipe.y + this.game.pipes.height + pipe.yOffset - this.game.pipes.gap - (HEIGHT/2));
		// Closest y coordinate of south pipe
		var cy2  = Math.min(Math.max(this.pos.y, pipe.y + this.game.pipes.height + pipe.yOffset - (HEIGHT/2)), pipe.y + 2*this.game.pipes.height + pipe.yOffset + this.game.pipes.gap);

		this.showCollisionDetection(cx, cy1, cy2);
		
		var dx  = this.pos.x - cx;
		var dy1 = this.pos.y - cy1;
		var dy2 = this.pos.y - cy2;

		var northPipeDistance = Math.sqrt((dx * dx) + (dy1 * dy1));
		var southPipeDistance = Math.sqrt((dx * dx) + (dy2 * dy2));

		var radius = (HEIGHT/2);
		if(radius > northPipeDistance || radius > southPipeDistance) {
			this.die(true);
		}

	}

	showCollisionDetection (cx, cy1, cy2) {
		let northTarget = $('.NorthTarget');
		let southTarget = $('.SouthTarget');
		if (this.controls.showCollisions) {
			if (northTarget.is(':hidden') || southTarget.is(':hidden')) {
				northTarget.show();
				southTarget.show();
			}
			// This shows you where the collision detection is exactly (top left corner of box)
			// red
			northTarget.css('transform', 'translateZ(0) translate(' + (cx + (WIDTH/2)) + 'em, ' + (cy1 + (HEIGHT/2) - 2.1) + 'em)');
			// green
			southTarget.css('transform', 'translateZ(0) translate(' + (cx + (WIDTH/2)) + 'em, ' + (cy2 + (HEIGHT/2)) + 'em)');
		}
		else {
			if (northTarget.is(':visible') || southTarget.is(':visible')) {
				northTarget.hide();
				southTarget.hide();
			}
		}
	}

	checkIfThroughPipe () {
		var pipe = this.game.pipes.pos[this.game.pipes.closestPipe];
		if ( this.pos.x + (WIDTH/2) >= pipe.x + (this.game.pipes.width/2) && pipe != this.currentPipe) {
			this.game.scoreboard.addScore();
			this.currentPipe = pipe;
		}
	}

	die (pipe) {
		this.gameOverLanding = true;
		this.velocity = -this.jumpSpeed/1.5;
		if (pipe) {
			this.game.gameSounds.playSound('hitNfall');
		}
		else {
			this.game.gameSounds.playSound('hit');
		}
		
		this.game.gameover();
		$('.NorthTarget').hide();
		$('.SouthTarget').hide();
	}

	jump () {
		this.velocity = -this.jumpSpeed;
		this.game.gameSounds.playSound('jump');
	}

	rotate () {
		// rotate down
		if (this.velocity >= -0.6) {
			this.falling = true;
		}
		if (this.velocity >= this.jumpSpeed) {
			this.rotation = Math.min(Math.PI/2, this.rotation + 0.1);
		}
		else { // rotate up
			this.falling = false;
			this.rotation = -(Math.PI / 8);
		}
	}

	introState() {
		this.pos.y = this.game.WORLD_HEIGHT - 21 + 0.8*Math.cos(this.game.frames/15);
		this.pos.x = this.game.WORLD_WIDTH - 18;
		this.rotation = 0;
	}

	splashState () {
		if(this.movingToStartPos) {
			let dx = (INITIAL_POSITION_X) - this.pos.x;
			let dy = (this.game.WORLD_WIDTH - 18) - this.pos.y;
			let distance = Math.sqrt((dx*dx) + (dy * dy));
			let ratio = SPEED / distance;
			this.pos.x -= ratio/30;
			this.pos.y += ratio/60;

			if(this.pos.x <= INITIAL_POSITION_X &&
				this.pos.y >= this.game.WORLD_HEIGHT - 18) {
				this.movingToStartPos = false;
			}	
		} else {
			this.pos.y = this.game.WORLD_HEIGHT - 18 + 0.8*Math.cos(this.game.frames/15);
			this.pos.x = INITIAL_POSITION_X;
		}

		this.rotation = 0;
		
		if (this.controls.didJump() && !this.movingToStartPos) {
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

		this.rotate();
		this.checkPipeCollision();	
		this.checkIfThroughPipe();
	}

	gameOverState () {
		this.velocity += this.gravity;
		this.pos.y += this.velocity;

		if (this.gameOverLanding) {
			this.rotate();
		}
	}
}
