Game.Slider = function(orientation) {
	Game.Entity.call(this, null, null, "gray");

	this._orientation = orientation;
	this._direction = 1;
	this._parts = [this];
}
Game.Slider.extend(Game.Entity);

Game.Slider.create = function(point, V) {
	var angle = Math.atan2(V[1], V[0]);
	if (angle < 0) { angle += 2*Math.PI; }
	angle = 6*angle/(2*Math.PI);

	var orientation = Math.floor(angle+2.5).mod(6);
	
	var inverse = (orientation + 3).mod(6);
	var dir = ROT.DIRS[6][inverse];
	while (point.join(",") in Game.tunnel) {
		point[0] += dir[0];
		point[1] += dir[1];
	}
	
	var slider = new this(orientation);
	Game.setEntity(slider, point[0], point[1]);

	return slider;
}

Game.Slider.prototype.act = function() {
	if (this._direction == 1) {
		var dir = ROT.DIRS[6][this._orientation];
		var pos = this._parts[this._parts.length-1].getPosition();
		var x = pos[0] + dir[0];
		var y = pos[1] + dir[1];
		var key = x+","+y;

		if (key in Game.entities) {

		}

		var part = new Game.Entity(null, null, "gray");
		this._parts.push(part);
		Game.setEntity(part, x, y);

		x += dir[0];
		y += dir[1];
		if (!(x+","+y in Game.tunnel)) { this._direction = -1; }
	} else {
		var last = this._parts.pop();
		Game.removeEntity(last);
		if (this._parts.length == 1) { this._direction = 1; }
	}
}
