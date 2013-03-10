/* http://blog.gludion.com/2009/08/distance-to-quadratic-bezier-curve.html */
Game.Digger = {
	_options: {
		minWidth: 3,
		maxWidth: 8,
		segments: 2,
		length: 40,
		cpDirection: 1
	},
	
	dig: function(options) {
		for (var p in options) { this._options[p] = options[p]; }
		
		var start = [0, 0];
		this._digCircle(start, 8);

		var angle = 0;
		var mw = this._options.minWidth;
		var Mw = this._options.maxWidth;
		
		for (var i=0;i<this._options.segments;i++) {
			var angleDiff = ROT.RNG.getNormal(0, 1);
			angleDiff = Math.max(angleDiff, -1);
			angleDiff = Math.min(angleDiff, +1);
			angle += angleDiff;
			var end = [
				start[0] + this._options.length*Math.cos(angle),
				start[1] + this._options.length*Math.sin(angle)
			];
			var cp = this._findControlPoint(start, end);
			this._options.width = mw + ROT.RNG.getUniform()*(Mw-mw);
			this._digQuadraticBezier(start, end, cp);
			
			start = end;
		}

		this._digCircle(start, 10);
	},
	
	_digCircle: function(C, radius) {
		for (var j=C[1]-radius; j<=C[1]+radius;j++) {
			for (var i=C[0]-2*radius; i<C[0]+2*radius; i+=2) {
				var dx = (C[0]-i)/2;
				var dy = C[1]-j;
				if (dx*dx+dy*dy < radius*radius) {
					var P = [i, j];
					this._round(P);
					Game.tunnel[P.join(",")] = true;
				}
			}
		}
	},
	
	_findControlPoint: function(A, B) {
		var V = [B[0]-A[0], B[1]-A[1]];
		var norm = this._norm(V);
		var N = [V[1]/norm, -V[0]/norm];
		var M = [A[0]+V[0]/2, A[1]+V[1]/2];
		var dist = 10 + ROT.RNG.getUniform() * norm / 2;
		dist *= this._options.cpDirection;
		this._options.cpDirection *= -1;
		return [M[0]+dist*N[0], M[1]+dist*N[1]];
	},
	
	_digQuadraticBezier: function(P0, P2, P1) {
		var A = [P1[0]-P0[0], P1[1]-P0[1]];
		var B = [P2[0]-P1[0]-A[0], P2[1]-P1[1]-A[1]];
		var baseSliderChance = 0.0005;
		var sliderChanceDiff = 0.0001;
		var sliderChance = baseSliderChance;

		var count = 5*this._norm(A);
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
			
			var norm = this._norm(dP);
			if (ROT.RNG.getUniform() > 0.5) { norm *= -1; }
			var N = [dP[1]/norm, -dP[0]/norm];
			
			for (var j=-width;j<=width;j++) {
				var X = [P[0] + j*N[0], P[1] + j*N[1]];
				this._round(X);
				Game.tunnel[X.join(",")] = true;
			}

			if (ROT.RNG.getUniform() < sliderChance) {
				N[0] *= -1;
				N[1] *= -1;
				var slider = Game.Slider.fromVector(N);
				Game.setEntity(slider, X[0], X[1]);
				Game.engine.addActor(slider);
				sliderChance = baseSliderChance;
			} else {
				sliderChance += sliderChanceDiff;
			}
		}
	},
	
	_round: function(X) {
		X[1] = Math.round(X[1]);
		if (X[1].mod(2)) {
			X[0] = 1+2*Math.round((X[0]-1)/2);
		} else {
			X[0] = 2*Math.round(X[0]/2);
		}
	},
	
	_norm: function(V) {
		return Math.sqrt(V[0]*V[0]+V[1]*V[1])
	}
}
