Game.Red = function() {
	Game.Entity.call(this, "o", "#f33");
}
Game.Red.extend(Game.Entity);

Game.Red.create = function(point, V) {
	point = Game.Util.findFreePoint(point, V);
	var red = new this();
	Game.setEntity(red, point[0], point[1]);
	return red;
}

Game.Red.prototype.bump = function(who, power) {
	Game.removeEntity(this);
	if (!who.player) { return; }
	
	who.restoreEnergy();
	Game.message("This red blood cell restored some of your energy.");
}
