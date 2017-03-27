class Foreground {
	constructor(el1, el2, game) {
		this.speed = 8;
		this.el1 = el1;
		this.el2 = el2;
		this.game = game;
		this.pos1 = {
			x: 0,
			y: 38
		};
		this.pos2 = {
			x: 31.9,
			y: 38
		};

		this.foregrounds = [
			'/images/foreground.png',
			'/images/foreground_nightmare.png'
		];
	}

	reset () {
		if (this.game.nightmareMode) {
			this.el1.css('background', 'url(' + this.foregrounds[1] + ') no-repeat');
			this.el1.css('background-size', '100%');
			this.el2.css('background', 'url(' + this.foregrounds[1] + ') no-repeat');
			this.el2.css('background-size', '100%');
			this.speed = 14;
		}
		else {
			this.el1.css('background', 'url(' + this.foregrounds[0] + ') no-repeat');
			this.el1.css('background-size', '100%');
			this.el2.css('background', 'url(' + this.foregrounds[0] + ') no-repeat');
			this.el2.css('background-size', '100%');
			this.speed = 8;
		}

		this.pos1 = {
			x: 0,
			y: 38
		};
		this.pos2 = {
			x: 31.9,
			y: 38
		};
	}

	onFrame(delta) {
		if (this.game.currentState !== this.game.states.gameover) {
			this.pos1.x -= delta * this.speed;
			this.pos2.x -= delta * this.speed;

			this.pos1.x = (this.pos1.x < -32) ? this.pos2.x + 31.9 : this.pos1.x;
			this.pos2.x = (this.pos2.x < -32) ? this.pos1.x + 31.9 : this.pos2.x;

			// Update UI
			this.el1.css('transform', 'translateZ(0) translate(' + this.pos1.x + 'em, ' + this.pos1.y + 'em)');
			this.el2.css('transform', 'translateZ(0) translate(' + this.pos2.x + 'em, ' + this.pos2.y + 'em)');
		}
	}
}