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
		this.gameSounds = new Game_Sounds();
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
		//this.isPlaying = true;
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
