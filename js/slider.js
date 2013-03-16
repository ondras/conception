Game.Slider = function(orientation) {
	Game.Entity.call(this, "¤", "#999");

	this._orientation = orientation;
	this._direction = 1;
	this._parts = [this];
	this._name = "candida";
}
Game.Slider.extend(Game.Entity);

Game.Slider.create = function(point, V) {
	var orientation = Game.Util.vectorToDirection(V);
	
	var inverse = (orientation + 3).mod(6);
	var dir = ROT.DIRS[6][inverse];
	while (point.join(",") in Game.tunnel) {
		point[0] += dir[0];
		point[1] += dir[1];
	}
	point[0] -= dir[0];
	point[1] -= dir[1];
	
	var slider = new this(orientation);
	Game.setEntity(slider, point[0], point[1]);
	Game.engine.addActor(slider);

	return slider;
}

Game.Slider.prototype.act = function() {
	if (this._direction == 1) {
		var dir = ROT.DIRS[6][this._orientation];
		var pos = this._parts[this._parts.length-1].getPosition();
		var x = pos[0] + dir[0];
		var y = pos[1] + dir[1];
		var key = x+","+y;

		var entity = Game.entities[key];
		if (entity) {
			entity.bump(this, 20);
			if (entity.player) { Game.message("You were hit by a %c and lost some of your energy.".format(this)); }
			this._direction = -1;
			return;
		}

		var part = new Game.Entity(this.ch, this.fg, this.bg);
		part.bump = this.bump.bind(this);
		this._parts.push(part);
		Game.setEntity(part, x, y);

		x += dir[0];
		y += dir[1];
		if (!(x+","+y in Game.tunnel)) { this._direction = -1; }
	} else {
		if (this._parts.length > 1) {
			var last = this._parts.pop();
			Game.removeEntity(last);
		}
		if (this._parts.length == 1) { this._direction = 1; }
	}
}

Game.Slider.prototype.bump = function(who, power) {
	if (who.player) { Game.message("A %c blocks the way...".format(this)); }
}
