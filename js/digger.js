/* http://blog.gludion.com/2009/08/distance-to-quadratic-bezier-curve.html */
Game.Digger = {
	_options: {
		minWidth: 3,
		maxWidth: 8,
		segments: 10,
		length: 32,
		cpDirection: 1
	},
	
	_midpoints: [],
	
	dig: function(options) {
		for (var p in options) { this._options[p] = options[p]; }
		
		var start = [0, 0];
		var angle = 0;
		var i = 0;

		var dig = function() {
			var angleDiff = ROT.RNG.getNormal(0, 1);
			angleDiff = Math.max(angleDiff, -1);
			angleDiff = Math.min(angleDiff, +1);
			angle += angleDiff;
			var end = [
				start[0] + this._options.length*Math.cos(angle),
				start[1] + this._options.length*Math.sin(angle)
			];
			this._digSegment(start, end, i/(this._options.segments-1));
			start = end;
			
			Game.intro.advance();
			i++;
			if (i == this._options.segments) {
				this._fillMidpoints();
				Game.intro.ready();
			} else {
				setTimeout(dig.bind(this), 50);
			}
		}
		
		dig.call(this);
		
	},
	
	_fillMidpoints: function() {
		for (var i=0;i<this._options.segments;i++) {
			var midpoints = this._midpoints[i];
			this._fillMidpointPart(midpoints, i/(this._options.segments-1));
		}
		this._midpoints = [];
	},
	
	_fillMidpointPart: function(midpoints, frac) {
		var avail = [];
		for (var key in midpoints) { avail.push(key); }
		avail = avail.randomize();

		if (frac > 0 && frac < 1) {
			this._generateSliders(avail, midpoints, frac);
		}
		
		if (frac < 1) {
			this._generatePlatelets(avail, midpoints, frac);
		}

		if (frac > 0) {
			this._generateRed(avail, midpoints, frac);
		}

		if (frac >= 0.2 && frac < 1) {
			this._generateEnemies(avail, midpoints, frac);
		}

		if (frac < 1) {
			this._generateDead(avail, midpoints, frac);
		}
	},
	
	_digCircle: function(C, radius) {
		for (var j=C[1]-radius; j<=C[1]+radius;j++) {
			for (var i=C[0]-2*radius; i<C[0]+2*radius; i+=2) {
				var dx = (C[0]-i)/2;
				var dy = C[1]-j;
				if (dx*dx+dy*dy < radius*radius) {
					var P = [i, j];
					Game.Util.round(P);
					Game.tunnel[P.join(",")] = true;
				}
			}
		}
	},
	
	_findControlPoint: function(A, B) {
		var V = [B[0]-A[0], B[1]-A[1]];
		var norm = Game.Util.norm(V);
		var N = [V[1]/norm, -V[0]/norm];
		var M = [A[0]+V[0]/2, A[1]+V[1]/2];
		var dist = 10 + ROT.RNG.getUniform() * norm / 2;
		dist *= this._options.cpDirection;
		this._options.cpDirection *= -1;
		return [M[0]+dist*N[0], M[1]+dist*N[1]];
	},
	
	_digSegment: function(start, end, frac) {
		var cp = this._findControlPoint(start, end);

		var mw = this._options.minWidth;
		var Mw = this._options.maxWidth;
		this._options.width = mw + ROT.RNG.getUniform()*(Mw-mw);

		var midpoints = this._digQuadraticBezier(start, end, cp);
		this._midpoints.push(midpoints);
		var avail = [];
		for (var key in midpoints) { avail.push(key); }
		avail = avail.randomize();
		
		if (frac == 0) {
			this._digCircle(start, 8);
		}
		
		if (frac > 0 && frac < 1 && ROT.RNG.getUniform() > 0.7) {
			var size = this._options.width + 1 + Math.floor(ROT.RNG.getUniform()*2);
			var key = avail.shift();
			var parts = key.split(",");
			var point = [parseInt(parts[0]), parseInt(parts[1])];
			this._digCircle(point, size);
		}
		
		if (frac == 1) {
			var ovumSize = 4;
			this._digCircle(end, 2*ovumSize + 2);
			var ovum = new Game.Ovum(ovumSize);
			Game.Util.round(end);
			Game.setEntity(ovum, end[0], end[1]);
			Game.engine.addActor(ovum);
			
			if (ROT.RNG.getUniform() < 1/85) {
				end[0] += 5*ovumSize;
				this._digCircle(end, 2*ovumSize + 2);
				var ovum = new Game.Ovum(ovumSize);
				Game.setEntity(ovum, end[0], end[1]);
				Game.engine.addActor(ovum);
			}
		}
		
	},
	
	_digQuadraticBezier: function(P0, P2, P1) {
		var midpoints = {};
		var A = [P1[0]-P0[0], P1[1]-P0[1]];
		var B = [P2[0]-P1[0]-A[0], P2[1]-P1[1]-A[1]];

		var count = 5*Game.Util.norm(A);
		var width = this._options.width;
		for (var i=0;i<count;i++) {
			var t = i/(count-1);
			
			var P = [
				(1-t)*(1-t)*P0[0] + 2*t*(1-t)*P1[0] + t*t*P2[0],
				(1-t)*(1-t)*P0[1] + 2*t*(1-t)*P1[1] + t*t*P2[1]
			];
			
			var dP = [
				2*(A[0]+B[0]*t),
				2*(A[1]+B[1]*t)
			];
			
			var norm = Game.Util.norm(dP);
			if (ROT.RNG.getUniform() > 0.5) { norm *= -1; }
			var N = [dP[1]/norm, -dP[0]/norm];
			
			for (var j=-width;j<=width;j++) {
				var X = [P[0] + j*N[0], P[1] + j*N[1]];
				Game.Util.round(X);
				Game.tunnel[X.join(",")] = true;
			}
			
			if (t > 0.1 && t < 0.9) {
				Game.Util.round(P);
				midpoints[P.join(",")] = N;
			}
		}
		return midpoints;
	},
	
	_generateSliders: function(avail, midpoints, frac) {
		this._generateStuff(avail, midpoints, 1, 4, Game.Slider.create.bind(Game.Slider), frac);
	},

	_generatePlatelets: function(avail, midpoints, frac) {
		this._generateStuff(avail, midpoints, 3, 6, Game.Platelet.create.bind(Game.Platelet), frac);
	},

	_generateRed: function(avail, midpoints, frac) {
		this._generateStuff(avail, midpoints, 1, 4, Game.Red.create.bind(Game.Red), frac);
	},
	
	_generateEnemies: function(avail, midpoints, frac) {
		this._generateStuff(avail, midpoints, 3, 9, Game.Enemy.create.bind(Game.Enemy), frac);
	},

	_generateDead: function(avail, midpoints, frac) {
		this._generateStuff(avail, midpoints, 1, 5, Game.Dead.create.bind(Game.Dead), frac);
	},

	_generateStuff: function(avail, midpoints, min, max, factory, frac) {
		var count = min + Math.floor((max-min)*ROT.RNG.getUniform());
		for (var i=0;i<count;i++) {
			if (!avail.length) { return; }
			key = avail.shift();
			var vec = midpoints[key];
			var parts = key.split(",");
			parts[0] = parseInt(parts[0]);
			parts[1] = parseInt(parts[1]);
			factory(parts, vec, frac);
		}
	}
}
