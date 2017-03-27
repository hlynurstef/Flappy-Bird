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
			var score = this.currentScore.toString().split('');
			for (var i = 0; i < score.length; i++) {
				this.numberEl[i].css('background', 'url(/images/numbers/' + score[i] + '.png) no-repeat');
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
			this.newLabelEl.css('background', 'url(/images/new.png) no-repeat');
			this.newLabelEl.css('background-size', 'auto 100%');
		} else {
			this.newLabelEl.css('background', 'url() no-repeat');
			this.newLabelEl.css('background-size', 'auto 100%');
		}
		
		var score = this.currentScore.toString().split('');
		for (var i = 0; i < score.length; i++) {
			this.GameOverEl[i].css('background', 'url(/images/numbers/' + score[i] + '.png) no-repeat');
			this.GameOverEl[i].css('background-size', 'auto 100%');
			if(this.GameOverEl[i].is(':hidden')) {
				this.GameOverEl[i].show();
			}
		}

		score = this.topScore.toString().split('');
		for (var i = 0; i < score.length; i++) {
			this.HighScoreEl[i].css('background', 'url(/images/numbers/' + score[i] + '.png) no-repeat');
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