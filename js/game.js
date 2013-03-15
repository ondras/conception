var Game = {
	engine: new ROT.Engine(),
	player: null,
	intro: null,
	entities: {},
	tunnel: {},
	_display: null,
	_offset: [0, 0], /* cell in left-top of canvas */
	_colors: {},
	_noise: new ROT.Noise.Simplex(),
	
	message: function(text) {
		var node = document.createElement("p");
		node.innerHTML = text;
		var parent = document.querySelector("#messages > div");
		parent.appendChild(node);		
		this._syncMessages();
	},

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
		this.player = new Game.Player();
		this.engine.addActor(this.player);
		var options = {
			fontSize: 24,
			layout: "hex",
			fontFamily: "droid sans mono",
			border: 0.5,
			spacing: 0.88
		}
		this._display = new ROT.Display(options);

		this.intro = new Game.Intro();
		Game.Digger.dig();
	},
	
	start: function() {
		document.body.appendChild(this._display.getContainer());

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

		for (var j=0 - 1;j<opts.height + 1;j++) {
			for (var i=j%2 - 2;i<opts.width + 2;i+=2) {
				this._draw(i+this._offset[0], j+this._offset[1]);
			}
		}
	},
	
	over: function(victory) {
		this.engine.lock();
		this.removeEntity(this.player);
		var status = document.querySelector("#status")
		if (victory) {
			var color = "#33f";
			status.innerHTML = "Mission accomplished!";
			status.style.color = color;
			this.message("<span style='color:"+color+"'>You successfully fertilized the egg.</span>");
			alert("Good job, soldier! We are victorious!");
		} else {
			status.innerHTML = "<a href='http://en.wikipedia.org/wiki/FUBAR'>FUBAR</a>";
			this.message("<span style='color:#f33'>You have run out of energy.</span>");
			alert("Damn, you have run out of energy. Reload the page and try again, this is an order!");
		}
	},

	_resize: function() {
		var size = this._display.computeSize(window.innerWidth-document.querySelector("#column").offsetWidth, window.innerHeight);
		this._display.setOptions({width:size[0], height:size[1]});
		this.setCenter();
		
		var messages = document.querySelector("#messages");
		var height = window.innerHeight - messages.offsetTop - 20;
		messages.style.height = height+"px";
		
		this._syncMessages();
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
	},
	
	_syncMessages: function() {
		var node = document.querySelector("#messages > div");
		var height = node.offsetHeight;
		var parentHeight = node.parentNode.offsetHeight;
		var top = parentHeight - height;
		node.style.top = top+"px";
	}
}
