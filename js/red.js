Game.Red = function() {
	Game.Entity.call(this, "o", "#f33");
}
Game.Red.extend(Game.Entity);

Game.Red.create = function(point, V) {
	var avail = [];

	var orientation = Game.Util.vectorToDirection(V);
	var dir = ROT.DIRS[6][orientation];
	while (point.join(",") in Game.tunnel) {
		avail.push(point.slice());
		point[0] += dir[0];
		point[1] += dir[1];
	}
	
	point = avail.random();
	
	var red = new this();
	Game.setEntity(red, point[0], point[1]);

	return red;
}

Game.Red.prototype.bump = function(who, power) {
	Game.removeEntity(this);
	if (!who.player) { return; }
	
	who.restoreEnergy();
	Game.message("A red blood cell! This will restore some of my energy.");
}
