Game.Intro = function() {
	this._node = document.querySelector("#intro");
	this._ready = false;
	this._waiting = true;
	setTimeout(this._timeout.bind(this), 500);
	this._node.className = "running"; /* chrome workaround (did not autostart) */
}

Game.Intro.prototype.ready = function() {
	this._ready = true;
	if (!this._waiting) { this._end(); }
}

Game.Intro.prototype.advance = function() {
	document.querySelector("#loading").innerHTML += ".";
}

Game.Intro.prototype.handleEvent = function() {
	window.removeEventListener("keypress", this);
	this._node.parentNode.removeChild(this._node);
	Game.start();
}

Game.Intro.prototype._timeout = function() {
	this._waiting = false;
	if (this._ready) { this._end(); }
}

Game.Intro.prototype._end = function() {
	var node = document.querySelector("#loading");
	node.innerHTML = "<strong>Press any key to start!<strong>";
	window.addEventListener("keypress", this);
}
