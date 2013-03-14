String.format.map["c"] = "describe";

Game.Entity = function(ch, fg, bg) {
	this._position = null;
	this.ch = ch;
	this.fg = fg;
	this.bg = bg;
	this._name = "";
}

Game.Entity.prototype.describe = function() {
	return this._name + " (<span style='color:" + this.fg + "'>" + this.ch  +"</span>)";
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

Game.Entity.prototype.act = function() {
}

/* player bumps into */
Game.Entity.prototype.bump = function(who, power) {
}
