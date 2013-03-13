Game.Util = {
	round: function(X) {
		X[1] = Math.round(X[1]);
		if (X[1].mod(2)) {
			X[0] = 1+2*Math.round((X[0]-1)/2);
		} else {
			X[0] = 2*Math.round(X[0]/2);
		}
	},
	
	norm: function(V) {
		return Math.sqrt(V[0]*V[0]+V[1]*V[1])
	},
	
	vectorToDirection: function(V) {
		var angle = Math.atan2(V[1], V[0]);
		if (angle < 0) { angle += 2*Math.PI; }
		angle = 6*angle/(2*Math.PI);

		return Math.floor(angle+2.5).mod(6);
	}
}
