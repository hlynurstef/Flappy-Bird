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
			this.el.find('.Background2')
		);
		this.foreground = new Foreground(
			this.el.find('.Foreground1'),
			this.el.find('.Foreground2')
		);
		this.isPlaying = false;

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);

		this.WORLD_WIDTH = 32;
		this.WORLD_HEIGHT = 48;

		this.img = new Image();
		this.img.onload = function() {
			loadAllSprites(this);
		};
		this.img.src = '../images/sheet.png';
		this.resizeGame();
	}

	static get WORLD_WIDTH() { return WORLD_WIDTH; }
	static get WORLD_HEIGHT() { return WORLD_HEIGHT; }
	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	onFrame () {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
			delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		this.foreground.onFrame(delta);
		this.background.onFrame(delta);

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
		this.isPlaying = true;
	}

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	reset () {
		this.player.reset();
		this.foreground.reset();
	}

	/**
	 * Signals that the game is over.
	 */
	gameover () {
		this.isPlaying = false;

		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl.addClass('is-visible')
					.find('.Scoreboard-restart')
					.one('click', function() {
						scoreboardEl.removeClass('is-visible');
						that.start();
					});
	}

	resizeGame () {
		var fontSize = Math.min(
			window.innerWidth / 32,
			window.innerHeight / 48
		);
		this.el.css('fontSize', fontSize + 'px');
	};
}
