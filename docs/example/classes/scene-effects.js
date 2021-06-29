"use strict";

import SG2DTransitions from "./../libs/sg2d/plugins/sg2d-transitions.js";
//import SG2DTransitions from "./../../../src/plugins/sg2d-transitions.js";

export default class SceneEffects {
	static toApply(scene) {
		
		// Add shadows - shader on the layer with bodies
		scene.effects.addShadowsToLayer({
			layer: "bodies",
			rotation: 135,
			distance: 8,
			alpha: 0.6
		});
		
		// Elevated roads effect
		scene.effects.addBevelsToLayer({
			layer: "roads",
			rotation: 135,
			thickness: 2,
			lightAlpha: 0.8,
			shadowAlpha: 0.8
		});
		
		// Raised terrain above the water
		scene.effects.addBevelsToLayer({
			layer: "grounds",
			rotation: 135,
			thickness: 3,
			lightAlpha: 0.8,
			shadowAlpha: 0.8,
			lightColor: 0xffffff,
			shadowColor: 0x000000
		});
		
		// Bottom of water
		this.bottomTiling = PIXI.TilingSprite.from("lands/bottom", {
			width: scene.clusters.areasizepix,
			height: scene.clusters.areasizepix
		});
		scene.layers["bottom"].container.addChild(this.bottomTiling);
		
		// Water tiling sprite
		this.waterTiling = PIXI.TilingSprite.from("lands/water", {
			width: scene.clusters.areasizepix,
			height: scene.clusters.areasizepix
		});
		this.waterTiling.alpha = 0.7;
		scene.layers["fluids"].container.addChild(this.waterTiling);
		
		// Water animation
		scene.effects.addDisplacementToLayer({
			layer: "fluids",
			scale: 0.2,
			texture: "displacement_animation",
			animationStep: 1,
			iterate: function() {
				this.sprite.x += Math.random() * this.options.animationStep;
				this.sprite.y += Math.random() * this.options.animationStep;
			}
		});
		
		// Trees shadows
		scene.effects.addShadowsToLayer({
			layer: "trees",
			rotation: 135,
			distance: 8,
			alpha: 0.6
		});
		
		// Trees animation
		let trees_a = 0;
		scene.effects.addDisplacementToLayer({
			layer: "trees",
			scale: 1,
			texture: "displacement_animation",
			animationStep: 0.25,
			iterate: function() {
				trees_a++; if (trees_a > 360) trees_a = 0;
				this.sprite.x += this.options.animationStep * SG2D.Math.cos(trees_a);
				this.sprite.y += this.options.animationStep * SG2D.Math.sin(trees_a);
			}
		});
		
		// Smooth transitions between different land types (use plugin)
		SG2DTransitions.ready(()=>{
			SG2DTransitions.run(scene.clusters);
		});
		
		// Random curvature of the joints of different types of terrain
		scene.effects.addDisplacementToLayer({
			layer: "grounds",
			scale: 0.1,
			texture: "displacement_static"
		});
		
		return this;
	}
}