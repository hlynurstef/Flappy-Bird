class Pipes {
	constructor(el1,el2,el3,game) {
		this.speed = 6.4;
		this.el = [
			el1,
			el2,
			el3
		];
		this.game = game;
		this.width = 5;
		this.height = 38.5;
		this.spacing = 15;
		this.gap = 9;

		this.pos = [{
				x: 40,
				y: 0,
				yOffset: 0
			}, {
				x: 55,
				y: 0,
				yOffset: 0
			}, {
				x: 70,
				y: 0,
				yOffset: 0
			}
		];
		
		this.closestPipe = 0;
	}

	reset () {
		this.pos = [{
				x: 40,
				y: 0,
				yOffset: this.getHeight()
			}, {
				x: 55,
				y: 0,
				yOffset: this.getHeight()
			}, {
				x: 70,
				y: 0,
				yOffset: this.getHeight()
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

			this.pos[0].x -= delta * this.speed;
			this.pos[1].x -= delta * this.speed;
			this.pos[2].x -= delta * this.speed;
		}

		for (var i = 0; i < this.pos.length; i++) {
			this.el[i].css('transform', 'translateZ(0) translate(' + this.pos[i].x + 'em, ' +  this.pos[i].y + 'em)');
			
		}
	}

	getHeight () {
		return Math.floor(Math.random() * ((-4) - (-25) + 1)) + (-25);
	}
}