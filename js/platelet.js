Game.Platelet = function() {
	Game.Entity.call(this, "#", "#a74");
}
Game.Platelet.extend(Game.Entity);

Game.Platelet.create = function(point, V) {
	var avail = [];

	var orientation = Game.Util.vectorToDirection(V);
	var dir = ROT.DIRS[6][orientation];
	while (point.join(",") in Game.tunnel) {
		avail.push(point.slice());
		point[0] += dir[0];
		point[1] += dir[1];
	}
	
	point = avail.random();
	
	var platelet = new this();
	Game.setEntity(platelet, point[0], point[1]);

	return platelet;
}

Game.Platelet.prototype.bump = function(who, power) {
	if (!who.player) { return; }
	
	var pos = who.getPosition();
	var diff = [
		this._position[0] - pos[0],
		this._position[1] - pos[1]
	];
	var next = [
		this._position[0] + diff[0],
		this._position[1] + diff[1]
	];
	var key = next.join(",");
	if (key in Game.tunnel && !(key in Game.entities)) {
		Game.setEntity(this, next[0], next[1]);
		Game.message("Looks like this platelet can be moved around...");
	} else {
		Game.message("Cannot move this platelet around; something is in the way.");
	}
}
