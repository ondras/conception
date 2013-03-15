Game.Ovum = function(radius) {
	Game.Entity.call(this, "O", "#ee4");
	this._radius = radius;
	this._parts = [];
	this._period = 8;
	this._time = 0;
	this._hiddenPart = null;
	this._hiddenPosition = null;
	
	this._hue = 1/6; /* yellow */
}
Game.Ovum.extend(Game.Entity);

Game.Ovum.prototype.setPosition = function(x, y) {
	Game.Entity.prototype.setPosition.call(this, x, y);
	this._build();
}

Game.Ovum.prototype.bump = function(who, power) {
	setInterval(this._animate.bind(this), 50);
	Game.over(true);
}

Game.Ovum.prototype._animate = function() {
	this._hue += 0.03;
	if (this._hue >= 1) { this._hue -= 1; }
	var color = ROT.Color.hsl2rgb([this._hue, 1, 0.5]);
	color = ROT.Color.toRGB(color);
	
	this.fg = color;
	var pos = this._position.slice();
	Game.removeEntity(this);
	Game.setEntity(this, pos[0], pos[1]);
}

Game.Ovum.prototype.act = function() {
	this._time++;
	var playerPos = Game.player.getPosition();
	var dist = Game.Util.distance(playerPos[0], playerPos[1], this._position[0], this._position[1])
	if (dist < this._radius) {
		if (this._hiddenPart) {
			Game.player.removeParts();
			var key = this._hiddenPosition.join(",");
			var entity = Game.entities[key];
			if (entity) { entity.bump(this, 100); }
			Game.setEntity(this._hiddenPart, this._hiddenPosition[0], this._hiddenPosition[1]);
			this._hiddenPart = null;
		}
		return;
	}

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
			part._name = "egg's cover";
			part.bump = this._bumpPart;
			this._parts.push(part);
			Game.setEntity(part, pos[0], pos[1]);
			pos[0] += dir[0];
			pos[1] += dir[1];
		}
	}
}

Game.Ovum.prototype._bumpPart = function(who, power) {
	if (who.player) { Game.message("The %c is impenetrable.".format(this)); }
}
