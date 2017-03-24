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