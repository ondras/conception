Game.Ovum = function(radius) {
	Game.Entity.call(this, "O", "#ee4");
	this._radius = radius;
	this._parts = [];
	this._period = 8;
	this._time = 0;
	this._hiddenPart = null;
	this._hiddenPosition = null;
}
Game.Ovum.extend(Game.Entity);

Game.Ovum.prototype.setPosition = function(x, y) {
	Game.Entity.prototype.setPosition.call(this, x, y);
	this._build();
}

Game.Ovum.prototype.bump = function(who, power) {
	Game.over(true);
}

Game.Ovum.prototype.act = function() {
	this._time++;
	if (this._time >= this._period) {
		if (this._hiddenPart) {
			var entity = Game.entities[this._hiddenPosition.join(",")];
			if (entity) { return; }
			Game.setEntity(this._hiddenPart, this._hiddenPosition[0], this._hiddenPosition[1]);
		}

		this._time = 0;
		this._hiddenPart = this._parts.random();
		this._hiddenPosition = this._hiddenPart.getPosition().slice();
		Game.removeEntity(this._hiddenPart);
	}
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
			var part = new Game.Entity("*", this.fg, this.bg);
			part.bump = this._bumpPart;
			this._parts.push(part);
			Game.setEntity(part, pos[0], pos[1]);
			pos[0] += dir[0];
			pos[1] += dir[1];
		}
	}
}

Game.Ovum.prototype._bumpPart = function(who, power) {
	if (who.player) { Game.message("This egg's cover is impenetrable."); }
}
