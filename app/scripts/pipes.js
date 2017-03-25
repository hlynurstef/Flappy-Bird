class Pipes {
	constructor(el1,el2,el3,game) {
		this.speed = 6.4;
		this.el1 = el1;
		this.el2 = el2;
		this.el3 = el3;
		this.game = game;
		this.width = 5;
		this.spacing = 15;

		this.pos1 = {
			x: 40,
			y: 0
		};
		this.pos2 = {
			x: 55,
			y: 0
		};
		this.pos3 = {
			x: 70,
			y: 0
		};
	}

	reset () {
		this.pos1 = {
			x: 40,
			y: 0
		};
		this.pos2 = {
			x: 55,
			y: 0
		};
		this.pos3 = {
			x: 70,
			y: 0
		};
		this.el1.css('top', this.getHeight() + 'em');
		this.el2.css('top', this.getHeight() + 'em');
		this.el3.css('top', this.getHeight() + 'em');
	}

	onFrame (delta) {
		if (this.game.currentState === this.game.states.game) {
			if (this.pos1.x < -this.width) {
				this.pos1.x = this.pos3.x + this.spacing;
				this.el1.css('top', this.getHeight() + 'em');
			}
			else if (this.pos2.x < -this.width) {
				this.pos2.x = this.pos1.x + this.spacing;
				this.el2.css('top', this.getHeight() + 'em');
			}
			else if (this.pos3.x < -this.width) {
				this.pos3.x = this.pos2.x + this.spacing;
				this.el3.css('top', this.getHeight() + 'em');
			}

			this.pos1.x -= delta * this.speed;
			this.pos2.x -= delta * this.speed;
			this.pos3.x -= delta * this.speed;
		}

		this.el1.css('transform', 'translateZ(0) translate(' + this.pos1.x + 'em, ' +  this.pos1.y + 'em)');
		this.el2.css('transform', 'translateZ(0) translate(' + this.pos2.x + 'em, ' +  this.pos2.y + 'em)');
		this.el3.css('transform', 'translateZ(0) translate(' + this.pos3.x + 'em, ' +  this.pos3.y + 'em)');
	}

	getHeight () {
		return Math.floor(Math.random() * ((-4) - (-25) + 1)) + (-25);
	}
}