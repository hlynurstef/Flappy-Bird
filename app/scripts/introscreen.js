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
			console.log("setting introscreen to false");
			that.hide();
			that.game.currentState = that.game.states.splash;
			that.game.reset();
		});
	}
}