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
	var pos = this._position.slice();
	for (var i=0;i<this._radius;i++) {
		pos[0]--;
		pos[1]++;
	}
	
	for (var i=0;i<6;i++) {
		var dir = ROT.DIRS[6][i];
		for (var j=0;j<this._radius;j++) {
			var part = new Game.Entity("*");
			Game.setEntity(part, pos[0], pos[1]);
			pos[0] += dir[0];
			pos[1] += dir[1];
		}
	}

}
