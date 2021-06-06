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
		
		var container = scene.layers["grounds"].container;
		container.filters = [];
		
		// Raised terrain above the water
		this.landBevel = new PIXI.filters.BevelFilter({rotation: 135, thickness: 3, lightAlpha: 0.8, shadowAlpha: 0.8, lightColor: 0xffffff, shadowColor: 0x000000});
		this.landBevel.padding = 1;
		container.filters.push(this.landBevel);
		
		// Random curvature of the joints of different types of terrain
		this.landFilterSprite = PIXI.Sprite.from("displacement_animation");
		this.landFilterScale = 0.4;
		this.landFilterSprite.scale.x = this.landFilterSprite.scale.y = this.landFilterScale;
		this.landFilterSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		container.addChild(this.landFilterSprite);
		this.landDisplacement = new PIXI.filters.DisplacementFilter(this.landFilterSprite);
		this.landDisplacement.padding = 1;
		container.filters.push(this.landDisplacement);
		
		var container = scene.layers["fluids"].container;
		container.filters = [];
		
		// Water tiling sprite
		var bounds = new SG2DBounds();
		bounds.min.x = bounds.min.y = 0;
		bounds.max.x = bounds.max.y = scene.clusters.areasize * SG2DConsts.CELLSIZEPIX;
		this.waterTiling = PIXI.TilingSprite.from("lands/water", { width: bounds.dx(), height: bounds.dy() });
		this.waterTiling.position.x = bounds.min.x;
		this.waterTiling.position.y = bounds.min.y;
		container.addChild(this.waterTiling);
		
		// Water animation
		this.waterAnimationSprite = PIXI.Sprite.from("displacement_animation");
		this.waterAnimationStep = 1;
		this.waterAnimationScale = 0.2;
		this.waterAnimationSprite.scale.x = this.waterAnimationSprite.scale.y = this.waterAnimationScale;
		this.waterAnimationSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		container.addChild(this.waterAnimationSprite);
		this.waterFluctuations = new PIXI.filters.DisplacementFilter(this.waterAnimationSprite);
		this.waterFluctuations.padding = 1;
		this.waterFluctuations.iterate = ()=>{
			this.waterAnimationSprite.x += Math.random() * this.waterAnimationStep;
			this.waterAnimationSprite.y += Math.random() * this.waterAnimationStep;
		};
		container.filters.push(this.waterFluctuations);
		
		// event scale
		scene.camera.on("scale", (scale, scale_prev)=>{
			this.bodyShadows.distance *= scale / scale_prev;
			this.roadBevel.thickness *= scale / scale_prev;
			this.landBevel.thickness *= scale / scale_prev;
			this.landFilterScale /= scale / scale_prev;
			this.landFilterSprite.scale.x = this.landFilterSprite.scale.y = this.landFilterScale;
		}, void 0, void 0, true);
		
		// event rotate
		scene.camera.on("rotate", (rotate, rotate_prev)=>{
			this.bodyShadows.rotation = 135 - rotate;
			this.roadBevel.rotation = 135 - rotate;
			this.landBevel.rotation = 135 - rotate;
		}, void 0, void 0, true);
		
		// 2. Smooth transitions between different soil types
		SG2DTransitions.ready(()=>{
			SG2DTransitions.run(scene.clusters);
		});
		
		return this;
	}
}