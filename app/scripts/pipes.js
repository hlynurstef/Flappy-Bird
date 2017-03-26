class Pipes {
	constructor(el1,el2,el3,game) {
		this.speed = 6.4;
		this.el = [
			el1,
			el2,
			el3
		];

		this.pipes = [
			[
				'../images/pipenorth.png',
				'../images/pipesouth.png'
			], [
				'../images/pipenorth_nightmare.png',
				'../images/pipesouth_nightmare.png'
			]
		];

		this.game = game;
		this.width = 5;
		this.height = 38.5;
		this.spacing = 15;
		this.gap = 9;
		this.north = $('.PipeNorth');
		this.south = $('.PipeSouth');

		this.pos = [{
				x: 40,
				y: 0,
				yOffset: 0,
				yStart: 0
			}, {
				x: 55,
				y: 0,
				yOffset: 0,
				yStart: 0
			}, {
				x: 70,
				y: 0,
				yOffset: 0,
				yStart: 0
			}
		];
		this.currentImage = this.pipes[0];
		this.closestPipe = 0;
	}

	reset () {
		if (this.game.nightmareMode) {
			this.north.css('background', 'url(' + this.pipes[1][0] + ') no-repeat');
			this.north.css('background-size', '100%');
			this.south.css('background', 'url(' + this.pipes[1][1] + ') no-repeat');
			this.south.css('background-size', '100%');
			this.speed = 14;
		}
		else {
			this.north.css('background', 'url(' + this.pipes[0][0] + ') no-repeat');
			this.north.css('background-size', '100%');
			this.south.css('background', 'url(' + this.pipes[0][1] + ') no-repeat');
			this.south.css('background-size', '100%');
			this.speed = 6.4;
		}

		var first  = this.getHeight(),
			second = this.getHeight(),
			third  = this.getHeight();

		this.pos = [{
				x: 40,
				y: 0,
				yOffset: first,
				yStart: first
			}, {
				x: 55,
				y: 0,
				yOffset: second,
				yStart: second
			}, {
				x: 70,
				y: 0,
				yOffset: third,
				yStart: third
			}
		];
		this.closestPipe = 0;
		for (var i = 0; i < this.pos.length; i++) {
			this.el[i].css('top', this.pos[i].yOffset + 'em');
		}
	}

	onFrame (delta) {
		if (this.game.currentState === this.game.states.game) {

			// Check if pipe is off screen
			for (var i = 0; i < this.pos.length; i++) {
				if (this.pos[i].x < -this.width) {
					this.pos[i].x = this.pos[(i+2)%3].x + this.spacing;
					this.pos[i].yOffset = this.getHeight();
					this.el[i].css('top', this.pos[i].yOffset + 'em');
					break;
				}
			}
			
			// Find closest pipe to player
			if (this.pos[this.closestPipe].x + this.width < 8) {
				this.closestPipe = (this.closestPipe + 1) % 3;
			}

			for (var i = 0; i < this.pos.length; i++) {
				this.pos[i].x -= delta * this.speed;
				if (this.game.nightmareMode) {
					this.pos[i].yOffset = this.game.WORLD_HEIGHT - 52 + 10*Math.cos(this.game.frames/50+this.pos[i].yStart);
				}
			}
		}

		for (var i = 0; i < this.pos.length; i++) {
			this.el[i].css('transform', 'translateZ(0) translate(' + this.pos[i].x + 'em, ' +  this.pos[i].y + 'em)');
			this.el[i].css('top', this.pos[i].yOffset + 'em');
			
		}
	}

	getHeight () {
		return Math.floor(Math.random() * ((-4) - (-25) + 1)) + (-25);
	}
}