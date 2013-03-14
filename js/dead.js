Game.Dead = function(ch, fg, bg) {
	Game.Entity.call(this, ch, fg, bg);
}
Game.Dead.extend(Game.Entity);

Game.Dead.create = function(point, V) {
	var o1 = Game.Util.vectorToDirection(V);
	var o2 = (o1+1).mod(6); // body orientation
	var dir = ROT.DIRS[6][o1];
	var bodyDir = ROT.DIRS[6][o2];
	var chars = "...o@".split("").reverse();
	var color = ["#333", "#444", "#555", "#666"].random();
	
	for (var i=0;i<chars.length;i++) {
		var ch = chars[i];
		var p = point.slice();
		p[0] += i*bodyDir[0];
		p[1] += i*bodyDir[1];
		if (!(p.join(",") in Game.tunnel)) { continue; }

		while (p.join(",") in Game.tunnel) {
			p[0] += dir[0];
			p[1] += dir[1];
		}
		p[0] -= dir[0];
		p[1] -= dir[1];
		if (p.join(",") in Game.entities) { continue; }
		
		var part = new Game.Dead(ch, color);
		Game.setEntity(part, p[0], p[1]);
	}
}

