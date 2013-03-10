Game.Player = function() {
	Game.Entity.call(this, "@", "white");

	this._maxEnergy = 10;
	this._energy = this._maxEnergy+1;
	this._parts = [this];

	var parts = ["o", ".", ".", "."];
	while (parts.length) {
		this._parts.push(new Game.Entity(parts.shift(), "white"));
	}
	
	this._keys = {};
	this._keys[103]	= 0; /* top left */
	this._keys[105]	= 1; /* top right */
	this._keys[102]	= 2; /* right */
	this._keys[99]	= 3; /* bottom right */
	this._keys[97]	= 4; /* bottom left */
	this._keys[100]	= 5; /* left */

	this._keys[81]	= 0; /* top left */
	this._keys[87]	= 1; /* top right */
	this._keys[83]	= 2; /* right */
	this._keys[88]	= 3; /* bottom right */
	this._keys[90]	= 4; /* bottom left */
	this._keys[65]	= 5; /* left */

	this._keys[37]	= 5; /* left */
	this._keys[39]	= 2; /* right */
	this._keys[38]	= 0; /* up */
	this._keys[40]	= 3; /* bottom */

	this._keys[101]	= -1; /* noop */
	this._keys[110]	= -1; /* noop */
	this._keys[190]	= -1; /* noop */
}
Game.Player.extend(Game.Entity);

Game.Player.prototype.showAt = function(x, y) {
	for (var i=0;i<this._parts.length;i++) {
		Game.setEntity(this._parts[i], x-2*i, y);
	}
}

Game.Player.prototype.act = function() {
	this._energy--;
	this._updateEnergy();
	if (!this._energy) {
		Game.over(false);
		return;
	}
	
	Game.engine.lock();
	window.addEventListener("keydown", this); /* wait for input */
}

Game.Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;
	if (!(code in this._keys)) { return; } /* not a direction/noop */
	
	code = this._keys[code];

	if (code == -1) { /* noop */
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
		return;
	}

	var dir = ROT.DIRS[6][code];
	var x = this._position[0] + dir[0];
	var y = this._position[1] + dir[1];
	this._tryMove(x, y);
}

Game.Player.prototype._updateEnergy = function() {
	var node = document.querySelector("#energy");
	node.innerHTML = this._energy;
	var frac = this._energy/this._maxEnergy;
	var color = ROT.Color.interpolateHSL([255, 0, 0], [60, 60, 255], frac);
	node.style.color = ROT.Color.toRGB(color);
}

Game.Player.prototype._tryMove = function(x, y) {
	var key = x+","+y;
	var entity = Game.entities[key];
	if (entity && entity.blocks && entity != this._parts[this._parts.length-1]) { 
		entity.bump();
		return; 
	}
	if (!(key in Game.tunnel)) { return; }

	var newPositions = [[x, y]];
	for (var i=0;i<this._parts.length;i++) {
		var part = this._parts[i]
		newPositions.push(part.getPosition().slice());
	}

	for (var i=0; i<this._parts.length; i++) {
		var part = this._parts[i];
		var pos = newPositions[i];
		Game.setEntity(part, pos[0], pos[1]);
	} 

	Game.setCenter();

	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}
