class Scoreboard {
	constructor(currScoreEl, game) {
		this.currScoreEl = currScoreEl;
		this.numberEl = [
			this.currScoreEl.find('.NumberHundred'),
			this.currScoreEl.find('.NumberTen'),
			this.currScoreEl.find('.NumberDigit')
		];
		this.game = game;
		this.topScore = 0;
		this.currentScore = 0;
	}

	reset () {
		this.currentScore = 0;
		for (var i = 0; i < this.numberEl.length; i++) {
			this.numberEl[i].hide();
			console.log('hiding stuff');
		}
	}

	onFrame () {
		if (this.game.currentState === this.game.states.game) {
			var score = this.currentScore.toString().split('');
			for (var i = 0; i < score.length; i++) {
				this.numberEl[i].css('background', 'url(../images/numbers/' + score[i] + '.png) no-repeat');
				this.numberEl[i].css('background-size', 'auto 100%');
				if(this.numberEl[i].is(':hidden')) {
					this.numberEl[i].show();
					console.log('showing');
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
		// TODO: add code for showing scoreboard at game over
		console.log('SCORE: ' + this.currentScore);
		if (this.currentScore > this.topScore) {
			this.topScore = this.currentScore;
			console.log('NEW HIGH SCORE: ' + this.topScore);
		}
	}
}