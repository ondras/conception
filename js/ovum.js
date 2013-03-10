Game.Ovum = function(radius) {
	Game.Entity.call(this, "*");
	this._radius = radius;
}
Game.Ovum.extend(Game.Entity);

Game.Ovum.prototype.setPosition = function(x, y) {
	Game.Entity.prototype.setPosition.call(this, x, y);
	this._build();
}

Game.Ovum.prototype._build = function() {
	var coords = {};
	
	
}
