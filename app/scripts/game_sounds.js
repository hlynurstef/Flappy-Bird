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

