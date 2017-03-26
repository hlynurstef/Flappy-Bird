class Game_Sounds {
	constructor() {
		this.channel_max = 6;	// number of channels 
		this.c = 0;				// number of the next free channel 
		this.audiochannels = new Array(); 
		for (var a=0; a < this.channel_max; a++) {						// prepare the channels
			this.audiochannels[a] = new Array();
			this.audiochannels[a]['channel'] = new Audio();				// expected end time for this channel
		}
		this.mute = false;
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
	}
}