Game.Entity = function(ch, fg, bg) {
	this._position = null;
	this._ch = ch;
	this._fg = fg;
	this._bg = bg;
}

Game.Entity.prototype.getSpeed = function() {
	return 100;
}

Game.Entity.prototype.setPosition = function(x, y) {
	this._position = (x === null ? null : [x, y]);
	return this;
}

Game.Entity.prototype.getPosition = function() {
	return this._position;
}

Game.Entity.prototype.getChar = function() {
	return this._ch;
}

Game.Entity.prototype.getFg = function() {
	return this._fg;
}

Game.Entity.prototype.getBg = function() {
	return this._bg;
}

Game.Entity.prototype.act = function() {

}
