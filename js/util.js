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
	}
}
