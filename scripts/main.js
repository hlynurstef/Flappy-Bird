$(function() {
    'use strict';

    var game = new Game($('.GameCanvas'));
    game.start();
});

/**
 * Cross browser RequestAnimationFrame
 */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        'use strict';
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function */ callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

$(window).resize(function() {
	var fontSize = Math.min(
        window.innerWidth / 32,
        window.innerHeight / 48
    );
    $('.GameCanvas').css('fontSize', fontSize + 'px');
});


/**
 * Key codes we're interested in.
 */
var KEYS = {
    32: 'space',
    1:  'leftClick',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

/**
 * A singleton class which abstracts all player input,
 * should hide complexity of dealing with keyboard, mouse
 * and touch devices.
 * @constructor
 */
class Controls {
    constructor (game) {
        this.game = game;
        this._didJump = false;
        this.showCollisions = false;
        this.keys = {};
        $(window).on('keydown', this._onKeyDown.bind(this))
                    .on('keyup', this._onKeyUp.bind(this));
        $(window).on('mousedown', this._onMouseDown.bind(this))
                    .on('mouseup', this._onMouseUp.bind(this));
    }

    _onKeyDown (e) {
        if (e.keyCode == 67) {
            this.showCollisions = !this.showCollisions;
        }

        if (e.keyCode == 77) {
            this.game.gameSounds.toggleAudio();
        }

        if (this.game.currentState !== this.game.states.gameover) {
            // Only jump if space wasn't pressed.
            if (e.keyCode === 32 && !this.keys.space) {
                this._didJump = true;
            }
            // Remember that this button is down.
            if (e.keyCode in KEYS) {
                var keyName = KEYS[e.keyCode];
                this.keys[keyName] = true;
                return false;
            }
        }
    }

    _onKeyUp (e) {
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = false;
            return false;
        }
    }

    _onMouseDown (e) {
        if (this.game.currentState !== this.game.states.gameover) {
            if (e.which === 1 && !this.keys.leftClick) {
                this._didJump = true;
            }

            // Remember that this button is down.
            if (e.which in KEYS) {
                var keyName = KEYS[e.which];
                this.keys[keyName] = true;
                return false;
            }
        }
    }

    _onMouseUp (e) {
        if (e.which in KEYS) {
            var keyName = KEYS[e.which];
            this.keys[keyName] = false;
            return false;
        }

    }

    /**
     * Only answers true once until a key is pressed again.
     */
    didJump () {
        var answer = this._didJump;
        this._didJump = false;
        return answer;
    }
}    


class Background {
	constructor(el1, el2, game) {
		this.speed = 1.6;
		this.el1 = el1;
		this.el2 = el2;
		this.game = game;
		this.backgrounds = [
			'./images/background_day.png',
			'./images/background_night.png',
			'./images/background_nightmare.png'
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

		if (this.game.nightmareMode) {
			this.currentImage = this.backgrounds[2];
		}
		else {
			// Don't change background for first play, always start with day background
			if (this.firstPlay) {
				this.firstPlay = false;
			}
			else {
				var random = Math.floor(Math.random() * (100 - 1));
				this.currentImage = this.backgrounds[random % 2];
			}
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
			'./images/foreground.png',
			'./images/foreground_nightmare.png'
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
class Pipes {
	constructor(el1,el2,el3,game) {
		this.speed = 8;
		this.el = [
			el1,
			el2,
			el3
		];

		this.pipes = [
			[
				'./images/pipenorth.png',
				'./images/pipesouth.png'
			], [
				'./images/pipenorth_nightmare.png',
				'./images/pipesouth_nightmare.png'
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
			this.speed = 8;
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
class Scoreboard {
	constructor(currScoreEl, gameOverEl, game) {
		this.currScoreEl = currScoreEl;
		this.numberEl = [
			this.currScoreEl.find('#NumberDigit'),
			this.currScoreEl.find('#NumberTen'),
			this.currScoreEl.find('#NumberHundred')
		];
		this.gameOverEl = gameOverEl;
		this.GameOverEl = [
			this.gameOverEl.find('#GameOverDigit'),
			this.gameOverEl.find('#GameOverTen'),
			this.gameOverEl.find('#GameOverHundred')
		]
		this.HighScoreEl = [
			this.gameOverEl.find('#HighScoreDigit'),
			this.gameOverEl.find('#HighScoreTen'),
			this.gameOverEl.find('#HighScoreHundred')
		]
		this.newLabelEl = this.gameOverEl.find('.newLabel');
		this.game = game;
		this.topScore = 0;
		this.currentScore = 0;
	}

	reset () {
		this.currentScore = 0;
		this.hideLiveScore();
		this.clearShowGameOverScore();
	}

	onFrame () {
		if (this.game.currentState === this.game.states.game) {
			var score = this.currentScore.toString().split('').reverse();
			for (var i = 0; i < score.length; i++) {
				this.numberEl[i].css('background', 'url(./images/numbers/' + score[i] + '.png) no-repeat');
				this.numberEl[i].css('background-size', 'auto 100%');
				if(this.numberEl[i].is(':hidden')) {
					this.numberEl[i].show();
				}
			}
		}
	}

	addScore () {
		// 999 is the highest score you can get
		if (this.currentScore !== 999) {
			this.currentScore++;
			this.game.gameSounds.playSound('score');
		}
	}

	showGameOverScore () {
		this.hideLiveScore();
		
		if (this.currentScore > this.topScore) {
			this.topScore = this.currentScore;
			this.newLabelEl.css('background', 'url(./images/new.png) no-repeat');
			this.newLabelEl.css('background-size', 'auto 100%');
		} else {
			this.newLabelEl.css('background', 'url() no-repeat');
			this.newLabelEl.css('background-size', 'auto 100%');
		}
		
		var score = this.currentScore.toString().split('').reverse();
		for (var i = 0; i < score.length; i++) {
			this.GameOverEl[i].css('background', 'url(./images/numbers/' + score[i] + '.png) no-repeat');
			this.GameOverEl[i].css('background-size', 'auto 100%');
			if(this.GameOverEl[i].is(':hidden')) {
				this.GameOverEl[i].show();
			}
		}

		score = this.topScore.toString().split('').reverse();
		
		for (var i = 0; i < score.length; i++) {
			this.HighScoreEl[i].css('background', 'url(./images/numbers/' + score[i] + '.png) no-repeat');
			this.HighScoreEl[i].css('background-size', 'auto 100%');
			if(this.HighScoreEl[i].is(':hidden')) {
				this.HighScoreEl[i].show();
			}
		}
	}

	hideLiveScore() {
		for (var i = 0; i < this.numberEl.length; i++) {
			this.numberEl[i].hide();
		}
	}

	clearShowGameOverScore() {
		for (var i = 0; i < 3; i++) {
			if(this.GameOverEl[i].is(':visible')) {
				this.GameOverEl[i].hide();
			}
		}
		for (var i = 0; i < 3; i++) {
			if(this.HighScoreEl[i].is(':visible')) {
				this.HighScoreEl[i].hide();
			}
		}
	}
}
class SplashScreen {
	constructor(el) {
		this.el = el;
	}

	show() {
		this.el.addClass('is-visible');
	}

	hide() {
		this.el.removeClass('is-visible');
	}
}
/**
 * Main game class.
 * @param {Element} el jQuery element containing the game.
 * @constructor
 */

class Game {
	constructor (el) {
		// el = .GameCanvas
		this.el = el;
		this.player = new Player(this.el.find('.Player'), this);
		this.background = new Background(
			this.el.find('.Background1'),
			this.el.find('.Background2'),
			this
		);
		this.foreground = new Foreground(
			this.el.find('.Foreground1'),
			this.el.find('.Foreground2'),
			this
		);

		this.pipes = new Pipes(
			this.el.find('.PipeSet1'),
			this.el.find('.PipeSet2'),
			this.el.find('.PipeSet3'),
			this
		);

		this.scoreboard = new Scoreboard(
			this.el.find('.Score'),
			this.el.find('.GameOver'),
			this
		);

		this.splashScreen = new SplashScreen(
			this.el.find('.Splash')
		);
		this.splashScreen.hide();

		this.introScreen = new IntroScreen(
			this.el.find('.Intro'),
			this
		);
		
		this.gameOver = new GameOver(
			this.el.find('.GameOver'),
			this
		);

		this.states = {
			intro: 0,
			splash: 1,
			game: 2,
			gameover: 3
		};
		this.currentState = this.states.intro;

		this.frames = 0;
		this.firstPlay = true;
		this.nightmareMode = false;

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);

		this.WORLD_WIDTH = 32;
		this.WORLD_HEIGHT = 38;

		this.resizeGame();
		this.gameSounds = new Game_Sounds(
			this.el.find('.musicToggle'),
			this
		);
	}

	static get WORLD_WIDTH() { return WORLD_WIDTH; }
	static get WORLD_HEIGHT() { return WORLD_HEIGHT; }
	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	onFrame () {
		this.frames++;
		// Check if the game loop should stop.
		/*if (!this.isPlaying) {
			return;
		}*/

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
			delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		this.foreground.onFrame(delta);
		this.background.onFrame(delta);
		this.pipes.onFrame(delta);
		this.scoreboard.onFrame();

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	}

	/**
	 * Starts a new game.
	 */
	start () {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
	}

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	reset () {
		
		if (this.nightmareMode) {
			this.gameSounds.playNightmare();
		}
		else {
			this.gameSounds.stopNightmare();
			this.foreground.reset();
			this.background.reset();
			this.player.reset();
		}

		if (!this.firstPlay) {
			this.player.reset();
			this.foreground.reset();
			this.background.reset();
			this.pipes.reset();
			this.scoreboard.reset();
			this.splashScreen.show();
			this.currentState = this.states.splash;
		}
		else {
			this.firstPlay = false;
			//this.player.reset();
			//this.foreground.reset();
			//this.background.reset();
			this.pipes.reset();
			this.scoreboard.reset();
			this.introScreen.setIntroScreen();
			this.currentState = this.states.intro;
		}
		
	}

	/**
	 * Signals that the game is over.
	 */
	gameover () {
		//this.isPlaying = false;
		this.currentState = this.states.gameover;

		// TODO: refactor code from this function
		this.scoreboard.showGameOverScore(); // <------- into this function in scoreboard

		this.gameOver.loadGameOver();
		// Should be refactored into a Scoreboard class.
		/*var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl.addClass('is-visible')
					.find('.Scoreboard-restart')
					.one('click', function() {
						scoreboardEl.removeClass('is-visible');
						that.reset();
					});*/
	}

	play () {
		this.currentState = this.states.game;
		this.splashScreen.hide();
	}

	resizeGame () {
		var fontSize = Math.min(
			window.innerWidth / 32,
			window.innerHeight / 48
		);
		this.el.css('fontSize', fontSize + 'px');
	};
}

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
				'./images/bird_yellow_1.png',
				'./images/bird_yellow_2.png',
				'./images/bird_yellow_3.png'
			],
			blue: [
				'./images/bird_blue_1.png',
				'./images/bird_blue_2.png',
				'./images/bird_blue_3.png'
			],
			red: [
				'./images/bird_red_1.png',
				'./images/bird_red_2.png',
				'./images/bird_red_3.png'
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

class Game_Sounds {
	constructor (el, game) {
        this.el = el;
		this.game = game;
		this.channel_max = 6;	// number of channels 
		this.c = 0;				// number of the next free channel 
		this.audiochannels = new Array(); 
		for (var a=0; a < this.channel_max; a++) {						// prepare the channels
			this.audiochannels[a] = new Array();
			this.audiochannels[a]['channel'] = new Audio();				// expected end time for this channel
		}
		this.mute = false;
		this.nightmareTheme = new Audio();
		this.nightmareTheme.src = document.getElementById('nightmare').src;
		this.playingTheme = false;

		this.muteAudioListener();
	}

	playSound(s) { 
		if(!this.mute) {
			this.audiochannels[this.c]['channel'].src = document.getElementById(s).src;
			this.audiochannels[this.c]['channel'].load();
			this.audiochannels[this.c]['channel'].play(); 
			this.c = this.c + 1;	// increment to the next free channel 
			if (this.c > this.channel_max-1) { // loop back to channel zero when max is reached 
				this.c = 0;
			}	
		}
		
    }

	toggleAudio() {
		this.mute = !this.mute;
		if (this.game.nightmareMode) {
			if(this.mute) {
				this.stopNightmare();
			} else {
				this.playNightmare();
			}
		}
	}

	playNightmare() {
		if(!this.mute) {
			this.playingTheme = true;
			this.nightmareTheme.addEventListener('ended', function() {
				this.currentTime = 0;
				this.play();
			}, false);
			this.nightmareTheme.play();
		}
	}

	stopNightmare() {
		this.nightmareTheme.pause();
		this.nightmareTheme.currentTime = 0;
	}

	muteAudioListener() {
		let that = this;
		$('#toggleImage').on('click', function() {
			that.toggleAudio();
			if(that.mute) {
				$(this).css('background', 'url(./images/unmute_button.png) no-repeat');
				$(this).css('background-size', 'auto 100%');
			}
			else {
				$(this).css('background', 'url(./images/mute_button.png) no-repeat');
				$(this).css('background-size', 'auto 100%');
			}
		});
	}
}


class IntroScreen {
	constructor(el, game) {
		this.el = el;
		this.game = game;
	}

	show() {
		this.el.addClass('is-visible');
	}

	hide() {
		this.el.removeClass('is-visible');
	}

	setIntroScreen() {
		var that = this;
		this.show();
		$('.IntroPlay').one('click', function() {
			that.hide();
			that.game.currentState = that.game.states.splash;
			that.game.splashScreen.show();
			//that.game.reset();
		});

		$('.IntroNightmare').one('click', function() {
			that.hide();
			that.game.nightmareMode = true;
			that.game.currentState = that.game.states.splash;
			that.game.reset();
		});
	}
}
class GameOver {
	constructor (el, game) {
		this.el = el;
		this.game = game;
	}

	show() {
		this.el.addClass('is-visible');
	}

	hide() {
		this.el.removeClass('is-visible');
	}

	loadGameOver() {
		var that = this;
		this.show();
		$('.GameOverPlay').one('click', function() {
			that.hide();
			that.game.currentState = that.game.states.splash;
			that.game.reset();
		});

		$('.ExitToIntro').one('click', function() {
			that.hide();
			that.game.currentState = that.game.states.intro;
			that.game.firstPlay = true;
			that.game.nightmareMode = false;
			that.game.player.movingToStartPos = true;
			that.game.reset();
		});
	}
}
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
	constructor (img, x, y, width, height) {
		this.img = img;
		this.x = x*2;
		this.y = y*2;
		this.width = width*2;
		this.height = height*2;
	}
}

function loadAllSprites(img) {
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