import SG2DTransitions from "./../../plugins/sg2d-transitions.js";

export default class SceneEffects {
	static toApply(scene) {
		
		// 1. Graphic shaders
		
		// Add shadows - shader on the layer with bodies
		var container = scene.layers["bodies"].container;
		container.filters = [];
		this.bodyShadows = new PIXI.filters.DropShadowFilter({rotation: 135, distance: 8, alpha: 0.6});
		container.filters.push(this.bodyShadows);
		
		// Elevated Roads Effect
		var container = scene.layers["roads"].container;
		container.filters = [];
		this.roadBevel = new PIXI.filters.BevelFilter({rotation: 135, thickness: 2, lightAlpha: 0.8, shadowAlpha: 0.8});
		this.roadBevel.padding = 1;
		container.filters.push(this.roadBevel);
		
		// Random curvature of the joints of different types of terrain
		var container = scene.layers["grounds"].container;
		container.filters = [];
		this.landFilterSprite = PIXI.Sprite.from("displacement_animation");
		this.landFilterScale = 0.4;
		this.landFilterSprite.scale.x = this.landFilterSprite.scale.y = this.landFilterScale;
		this.landFilterSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		container.addChild(this.landFilterSprite);
		this.landDisplacement = new PIXI.filters.DisplacementFilter(this.landFilterSprite);
		this.landDisplacement.padding = 1;
		container.filters.push(this.landDisplacement);
		
		scene.camera.on("scale", (scale, scale_prev)=>{
			this.bodyShadows.distance *= scale / scale_prev;
			this.roadBevel.thickness *= scale / scale_prev;
			this.landFilterScale /= scale / scale_prev;
			this.landFilterSprite.scale.x = this.landFilterSprite.scale.y = this.landFilterScale;
		}, void 0, void 0, true);
		scene.camera.on("rotate", (rotate, rotate_prev)=>{
			this.bodyShadows.rotation = 135 - rotate;
			this.roadBevel.rotation = 135 - rotate;
		}, void 0, void 0, true);
		
		// 2. Smooth transitions between different soil types
		SG2DTransitions.ready(()=>{
			SG2DTransitions.run(scene.clusters);
		});
		
		return this;
	}
}