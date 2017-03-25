class Background {
	constructor(el1, el2) {
		this.speed = 1.6;
		this.el1 = el1;
		this.el2 = el2;
		this.backgrounds = [
			'../images/background_day.png',
			'../images/background_night.png'
		];
		this.currentImage = this.backgrounds[0];
		this.stuff = 0;
		this.pos1 = {
			x: 0,
			y: 0
		};
		this.pos2 = {
			x: 31.9,
			y: 0
		};
		this.firstPlay = true;
		this.el1.css('background', 'url(' + this.currentImage + ') no-repeat');
		this.el2.css('background', 'url(' + this.currentImage + ') no-repeat');
		this.el1.css('background-size', '100%');
		this.el2.css('background-size', '100%');

	}

	reset() {
		// Don't change background for first play, always start with day background
		if (this.firstPlay) {
			this.firstPlay = false;
		}
		else {
			var random = Math.floor(Math.random() * (100 - 1));
			this.currentImage = this.backgrounds[random % this.backgrounds.length];
		}

		this.pos1 = {
			x: 0,
			y: 0
		};
		this.pos2 = {
			x: 31.9,
			y: 0
		};
		this.el1.css('background', 'url(' + this.currentImage + ') no-repeat');
		this.el2.css('background', 'url(' + this.currentImage + ') no-repeat');
		this.el1.css('background-size', '100%');
		this.el2.css('background-size', '100%');
	}

	onFrame(delta) {
		this.pos1.x -= delta * this.speed;
		this.pos2.x -= delta * this.speed;

		this.pos1.x = (this.pos1.x < -32) ? this.pos2.x + 31.9 : this.pos1.x;
		this.pos2.x = (this.pos2.x < -32) ? this.pos1.x + 31.9 : this.pos2.x;
		//console.log(this.currentImage);
		// Update UI
		this.el1.css('transform', 'translateZ(0) translate(' + this.pos1.x + 'em, ' + this.pos1.y + 'em)');
		this.el2.css('transform', 'translateZ(0) translate(' + this.pos2.x + 'em, ' + this.pos2.y + 'em)');
	}
}