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
			that.game.reset();
		});
	}
}