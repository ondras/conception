Game.Enemy = function() {
	var types = [
		{
			ch: "%",
			fg: "#3f3",
			name: "xxx",
			power: 1
		},
		{
			ch: "&",
			fg: "#ff3",
			name: "yyy",
			power: 2
		},
		{
			ch: "§",
			fg: "#33f",
			name: "zzz",
			power: 3
		},
		{
			ch: "¤",
			fg: "#f3f",
			name: "qqq",
			power: 4			
		},
		{
			ch: "※",
			fg: "#3ff",
			name: "www",
			power: 5
		}
	];
	var type = types.random();
	this._name = type.name;
	this._power = type.power;
	this._target = null;
	Game.Entity.call(this, type.ch, type.fg);
}
Game.Enemy.extend(Game.Entity);

Game.Enemy.create = function(point, V) {
	point = Game.Util.findFreePoint(point, V);
	if (!point) { return null; }
	var enemy = new this();
	Game.setEntity(enemy, point[0], point[1]);
	Game.engine.addActor(enemy);
	return enemy;
}

Game.Enemy.prototype.bump = function(who, power) {
	Game.engine.removeActor(this);
	Game.removeEntity(this);
	
	if (!who.player) { return; }
	
	Game.message("You destroy the " + this._name + ".");
}

Game.Enemy.prototype.act = function() {
	var parts = Game.player.getParts();
	var index = parts.indexOf(this._target);
	if (index == -1) { this._target = parts.random(); }
	
	var pos1 = this._position;
	var pos2 = this._target.getPosition();
	
	var dist = this._dist(pos1[0], pos1[1], pos2[0], pos2[1]);
	if (dist == 1) {
		this._target.bump(this, this._power);
		Game.message("You are hit by a " + this._name + " and lose some energy!");
		return;
	}

	var wander = false;
	if (dist > 10) { wander = true; }


	var bestDist = 1/0;
	var avail = [];
	var dirs = ROT.DIRS[6];
	for (var i=0;i<dirs.length;i++) {
		var dir = dirs[i];
		var x = this._position[0]+dir[0];
		var y = this._position[1]+dir[1];
		var key = x+","+y;
		if (key in Game.entities) { continue; }
		if (!(key in Game.tunnel)) { continue; }
		
		if (wander) {
			avail.push([x, y]);
		} else {
			var dist = this._dist(x, y, pos2[0], pos2[1]);
			if (dist < bestDist) {
				avail = [];
				bestDist = dist;
			}
			if (dist == bestDist) { avail.push([x, y]); }
		}
		
	}
	if (!avail.length) { return true; }

	var pos = avail.random();
	Game.setEntity(this, pos[0], pos[1]);
}

Game.Enemy.prototype._dist = function(x1, y1, x2, y2) {
	var dx = x1-x2;
	var dy = y1-y2;
	return Math.abs(dy) + Math.max(0, (Math.abs(dx)-Math.abs(dy))/2);
}
