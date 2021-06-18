import SG2DTransitions from "./../libs/sg2d/plugins/sg2d-transitions.js";
//import SG2DTransitions from "./../../../src/plugins/sg2d-transitions.js";

export class Sand extends SG2D.Tile {
	static texture = "lands/sand";
	static layer = "grounds";
	
	static useTransitions = true; // Using the SG2DTransitions plugin
	static char = "s"; // One-character tile code for SG2DTransitions plugin
	static altitude = 1; // Tile height for SG2DTransitions plugin
	static transitionsMask = SG2DTransitions.TRANSITIONS_STANDARD; // Transition type for SG2DTransitions plugin
}

export class Grass extends SG2D.Tile {
	static texture = "lands/grass";
	static layer = "grounds";
	
	static useTransitions = true;
	static char = "g"; // One-character tile code for SG2DTransitions plugin
	static altitude = 2; // Tile height for SG2DTransitions plugin
}

export class Water extends SG2D.Tile {
	static texture = "lands/water";
	static layer = "fluids";
	static noDraw = true;
}

export class Tree extends SG2D.Tile {
	static texture = "elements/trees/tree_";
	static layer = "trees";
	static zindex = 20;
	initialize(...args) {
		super.initialize(...args);
		let n = Math.floor(1 + Math.random() * 41);
		this.set("texture", Tree.texture + (n<10?"0":"") + n);
	}
}

export class Bush extends SG2D.Tile {
	static texture = "elements/bushes/bush_";
	static layer = "bodies";
	static zindex = 9;
	initialize(...args) {
		super.initialize(...args);
		let n = Math.floor(1 + Math.random() * 6);
		this.set("texture", Bush.texture + (n<10?"0":"") + n);
	}
}

export class Medikit extends SG2D.Tile {
	static texture = "objects/medikit100_1";
	static layer = "bodies";
	static scale = 0.7;
	static animation = {
		count: 8,
		sleep: 3,
		running: false,
		basetexture: "objects/medikit100_",
		onComplete: function(sprite) {
			sprite.visible = true;
		},
		loop: false
	};
	
	initialize(...args) {
		super.initialize(...args);
		this.scaleDir = 1;
	}
	
	iterateAnimations(...args) {
		this.set("angle", this.properties.angle + 1);
		this.set("scale", this.properties.scale +0.002 * this.scaleDir);
		if (this.properties.scale <= 0.6) this.scaleDir = 1;
		if (this.properties.scale >= 0.8) this.scaleDir = -1;
		
		if (! this.sprite.animation.running && Math.random() < 0.01) {
			this.startAnimation();
		}
		
		super.iterateAnimations(...args);
	}
}