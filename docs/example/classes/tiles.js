import SG2DTransitions from "./../libs/sg2d/plugins/sg2d-transitions.js";

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

export class BlockSteel extends SG2D.Tile {
	static texture = "elements/block-steel";
	static layer = "bodies";
	static zindex = 20;
	static blockage = true;
}

export class BlockStandard extends SG2D.Tile {
	static texture = "elements/block-standard";
	static layer = "bodies";
	static zindex = 20;
	static blockage = true;
}

export class BlockTriangle extends SG2D.Tile {
	static baseTexture = "elements/block-corner-";
	static texture = "elements/block-corner-45";
	static layer = "bodies";
	static zindex = 20;
	static blockage = true;
	initialize(...args) {
		super.initialize(...args);
		this.set("texture", BlockTriangle.baseTexture + this.properties.type);
	}
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

export class Whizbang extends SG2D.Tile {
	static texture = "objects/whizbang";
	static layer = "animations";
	static animation = {
		count: 6,
		sleep: 3,
		running: false,
		basetexture: "animations/explosionA_",
		loop: false,
		onComplete: function() {
			this.destroy();
		}
	};
	
	static STATE_FLY = 1;
	static STATE_EXPLODE = 2;
	
	defaults() {
		return SG2D.Model.defaults({
			state: Whizbang.STATE_FLY
		}, SG2D.Tile.defaultProperties);
	}
	
	iterate() {
		if (! this.clusters.size) {
			this.destroy();
		} else {
			switch (this.properties.state) {
				case Whizbang.STATE_FLY: {
					
					// TODO: SG2DBody collision detector
					for (var cluster of this.clusters) {
						for (var tile of cluster.tiles) {
							if (tile.constructor.blockage) {
								this.set("state", Whizbang.STATE_EXPLODE);
								return;
							}
						}
					}

					this.set("position", {
						x: this.properties.position.x + 10 * SG2D.Math.cos(this.properties.angle, 1),
						y: this.properties.position.y + 10 * SG2D.Math.sin(this.properties.angle, 1)
					});
					
					break;
				}
				case Whizbang.STATE_EXPLODE: {
					if (! this.sprite.animation.running) {
						this.startAnimation();
					}
					break;
				}
			}
		}
	}
}