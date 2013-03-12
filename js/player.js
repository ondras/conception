Game.Player = function() {
	Game.Entity.call(this, "@", "white");

	this._maxEnergy = 200;
	this._energy = this._maxEnergy+1;
	this._parts = [this];
	this.player = true;

	var parts = ["o", ".", ".", "."];
	while (parts.length) {
		var part = new Game.Entity(parts.shift(), "white");
		part.player = true;
		part.bump = this.bump.bind(this); /* bumping into our parts is the same as bumping to us */
		this._parts.push(part);
	}

	this._energyPerPart = Math.floor(this._maxEnergy/this._parts.length);
	this._keys = {};

	this._keys[ROT.VK_Y] = 0;
	this._keys[ROT.VK_NUMPAD7] = 0;
	this._keys[ROT.VK_U] = 1;
	this._keys[ROT.VK_NUMPAD9] = 1;
	this._keys[ROT.VK_L] = 2;
	this._keys[ROT.VK_RIGHT] = 2;
	this._keys[ROT.VK_NUMPAD6] = 2;
	this._keys[ROT.VK_N] = 3;
	this._keys[ROT.VK_NUMPAD3] = 3;
	this._keys[ROT.VK_B] = 4;
	this._keys[ROT.VK_NUMPAD1] = 4;
	this._keys[ROT.VK_H] = 5;
	this._keys[ROT.VK_LEFT] = 5;
	this._keys[ROT.VK_NUMPAD4] = 5;
	this._keys[ROT.VK_K] = 0;
	this._keys[ROT.VK_UP] = 0;
	this._keys[ROT.VK_NUMPAD8] = 0;
	this._keys[ROT.VK_J] = 3;
	this._keys[ROT.VK_DOWN] = 3;
	this._keys[ROT.VK_NUMPAD2] = 3;

	this._keys[ROT.VK_PERIOD] = -1;
	this._keys[ROT.VK_CLEAR] = -1;
	this._keys[ROT.VK_NUMPAD5] = -1;
	
}
Game.Player.extend(Game.Entity);

Game.Player.prototype.showAt = function(x, y) {
	for (var i=0;i<this._parts.length;i++) {
		Game.setEntity(this._parts[i], x-2*i, y);
	}
}

Game.Player.prototype.adjustEnergy = function(diff) {
	this._energy = Math.max(0, this._energy + diff);
	this._updateEnergy();
	
	var parts = Math.ceil(this._energy / this._energyPerPart);
	parts = Math.max(parts, 1);

	while (parts < this._parts.length) {
		Game.removeEntity(this._parts.pop());
	}

	if (!this._energy) { Game.over(false); }
}

Game.Player.prototype.act = function() {
	this.adjustEnergy(-1);
	if (!this._energy) { return; }
	
	Game.engine.lock();
	window.addEventListener("keydown", this); /* wait for input */
}

Game.Player.prototype.bump = function(who, power) {
	this.adjustEnergy(-power);
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
	
	if (entity) {
		var index = this._parts.indexOf(entity);

		if (index == -1) { 
			entity.bump(this, 100);
			return; 
		}

		if (index < this._parts.length-1) {
			return;
		}
	}
	
	
	if (!(key in Game.tunnel)) {
		Game.message("Cannot move there.");
		return; 
	}

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
