Game.Platelet = function() {
	Game.Entity.call(this, "#", "#a74");
}
Game.Platelet.extend(Game.Entity);

Game.Platelet.create = function(point, V) {
	point = Game.Util.findFreePoint(point, V);
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
		Game.message("You bump into the platelet; it moves a bit.");
	} else {
		Game.message("You bump into the platelet.");
	}
}
