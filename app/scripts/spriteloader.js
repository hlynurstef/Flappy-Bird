let
sprbird,
sprbg,
sprfg,
sprpipeNorth,
sprpipeSouth,
sprtext,
sprscore,
sprsplash,
sprbuttons,
sprnumberS,
sprnumberB;

class Sprite {
	constructor(img, x, y, width, height) {
		this.img = img;
		this.x = x*2;
		this.y = y*2;
		this.width = width*2;
		this.height = height*2;
	}

	draw (ctx, x, y) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
			x, y, this.width, this.height);
	}
}

function initSprites(img) {
	'use strict';

	sprbird = [
		new Sprite(img, 156, 115, 17, 12),
		new Sprite(img, 156, 128, 17, 12),
		new Sprite(img, 156, 141, 17, 12)
	];
	
	sprbg = new Sprite(img,   0, 0, 138, 114);
	sprbg.color = '#70C5CF';
	sprfg = new Sprite(img, 138, 0, 112,  56);
	
	sprpipeNorth = new Sprite(img, 251, 0, 26, 200);
	sprpipeSouth = new Sprite(img, 277, 0, 26, 200);
	
	sprtext = {
		FlappyBird: new Sprite(img, 59, 114, 96, 22),
		GameOver:   new Sprite(img, 59, 136, 94, 19),
		GetReady:   new Sprite(img, 59, 155, 87, 22)
	};
	sprbuttons = {
		Rate:  new Sprite(img,  79, 177, 40, 14),
		Menu:  new Sprite(img, 119, 177, 40, 14),
		Share: new Sprite(img, 159, 177, 40, 14),
		Score: new Sprite(img,  79, 191, 40, 14),
		Ok:    new Sprite(img, 119, 191, 40, 14),
		Start: new Sprite(img, 159, 191, 40, 14)
	};

	sprscore  = new Sprite(img, 138,  56, 113, 58);
	sprsplash = new Sprite(img,   0, 114,  59, 49);

	sprnumberS = new Sprite(img, 0, 177, 6,  7);
	sprnumberB = new Sprite(img, 0, 188, 7, 10);

	sprnumberS.draw = sprnumberB.draw = function(ctx, x, y, num) {
		num = num.toString();
		var step = this.width + 2;
		for (var i = 0, len = num.length; i < len; i++) {
			var n = parseInt(num[i]);
			ctx.drawImage(img, step*n, this.y, this.width, this.height,
				x, y, this.width, this.height);
			x += step;
		}
	};
}
