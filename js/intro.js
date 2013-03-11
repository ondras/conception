Game.Intro = function() {
	this._node = document.querySelector("#intro");
	this._node.parentNode.removeChild(this._node);
	Game.start();
}
