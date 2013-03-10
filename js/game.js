var Game = {
	engine: null,
	player: null,
	entities: {},
	tunnel: {},
	_display: null,
	_offset: [0, 0], /* cell in left-top of canvas */
	_colors: {},
	_noise: new ROT.Noise.Simplex(),

	setEntity: function(entity, x, y) {
		var oldPosition = entity.getPosition();
		if (oldPosition) {
			var oldKey = oldPosition.join(",");
			if (this.entities[oldKey] == entity) { delete this.entities[oldKey]; }
			this._draw(oldPosition[0], oldPosition[1]);
		}

		var key = x+","+y;
		entity.setPosition(x, y);

		if (x !== null) {
			this.entities[key] = entity;
			this._draw(x, y);
		}
	},
	
	removeEntity: function(entity) {
		var oldPosition = entity.getPosition();
		if (!oldPosition) { return; }
		var oldKey = oldPosition.join(",");
		if (this.entities[oldKey] == entity) { delete this.entities[oldKey]; }
		this._draw(oldPosition[0], oldPosition[1]);
	},
	
	init: function() {
		this.engine = new ROT.Engine();
		this.player = new Game.Player();
		this.engine.addActor(this.player);

		this._start();
	},

	_start: function() {
		var options = {
			fontSize: 20,
			layout: "hex",
			fontFamily: "droid sans mono",
			border: 0.5,
			spacing: 0.9
		}
		this._display = new ROT.Display(options);
		document.body.appendChild(this._display.getContainer());

		Game.Digger.dig();
		this.player.showAt(0, 0);
		this._resize();

		this.engine.start();

		window.addEventListener("resize", this._resize.bind(this));
	},
	

	/**
	 * @param {int} x absolute
	 * @param {int} y absolute
	 */
	_draw: function(x, y) {
		var dispX = x - this._offset[0];
		var dispY = y - this._offset[1];
		var key = x+","+y;
		var entity = this.entities[key];
		if (entity) {
			this._display.draw(dispX, dispY, entity.ch, entity.fg, entity.bg);
		} else if (this.tunnel[key]) {
			this._display.draw(dispX, dispY);
		} else {
			var bg = this._getColor(x, y);
			this._display.draw(dispX, dispY, null, null, bg);
		}
	},

	setCenter: function() {
		var pos = this.player.getPosition();
		var opts = this._display.getOptions();
		this._offset[0] = pos[0]-Math.floor(opts.width/2);
		this._offset[1] = pos[1]-Math.floor(opts.height/2);
		if ((this._offset[0] + this._offset[1]) % 2) { this._offset[0]--; }

		/* redraw all */
		this._display.clear();

		for (var j=0;j<opts.height;j++) {
			for (var i=j%2;i<opts.width;i+=2) {
				this._draw(i+this._offset[0], j+this._offset[1]);
			}
		}
	},
	
	over: function(victory) {
		this.engine.lock();
		var status = document.querySelector("#status")
		if (victory) {
			status.innerHTML = "Mission accomplished!";
			alert("Good job, soldier! We are victorious!");
		} else {
			status.innerHTML = "<a href='http://en.wikipedia.org/wiki/FUBAR'>FUBAR</a>";
			alert("Damn, you have run out of energy. Reload the page and try again, this is an order!");
		}
	},

	_resize: function() {
		var size = this._display.computeSize(window.innerWidth-document.querySelector("#column").offsetWidth, window.innerHeight);
		this._display.setOptions({width:size[0], height:size[1]});
		this.setCenter();
	},

	_getColor: function(x, y) {
		var key = x+","+y;
		if (key in this._colors) {
			var color = this._colors[key];
		} else {
			var noise = Math.abs(this._noise.get(x/40, y/40));
			var arr = [255, 100+Math.round(120*noise), 100+Math.round(120*noise)];
			var color = "rgb(" + arr.join(",") + ")";
			this._colors[key] = color;
		}
		return color;
	}
}
