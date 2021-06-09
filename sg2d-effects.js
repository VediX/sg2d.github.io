/**
 * SG2DEffects
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

export default class SG2DEffects {
	
	static TYPE_SHADOWS = 1;
	static TYPE_BEVELS = 2;
	static TYPE_DISPLACEMENT = 3;
		
	constructor() {
		this.effects = new Set();
	}
	
	/** @private */
	_sg2dconnect(sg2d) {	
		this.sg2d = sg2d;
		
		this.sg2d.camera.on("scale", this._onCameraScale.bind(this), void 0, void 0, true);
		this.sg2d.camera.on("rotate", this._onCameraRotate.bind(this), void 0, void 0, true);
	}
	
	_onCameraScale(scale, scale_prev) {
		for (var effect of this.effects) {
			switch (effect.type) {
				case SG2DEffects.TYPE_SHADOWS:
					effect.filter.distance *= scale / scale_prev;
					break;
				case SG2DEffects.TYPE_BEVELS:
					effect.filter.thickness *= scale / scale_prev;
					break;
				case SG2DEffects.TYPE_DISPLACEMENT:
					effect.options.scale /= scale / scale_prev;
					effect.sprite.scale.set(effect.options.scale);
					break;
			}
		}
	}
	
	_onCameraRotate(rotate) {
		for (var effect of this.effects) {
			switch (effect.type) {
				case SG2DEffects.TYPE_SHADOWS: case SG2DEffects.TYPE_BEVELS:
					effect.filter.rotation = effect.options.rotation - rotate;
					break;
			}
		}
	}
	
	addShadowsToLayer(config) {
		var container = this.sg2d.layers[config.layer].container;
		container.filters = container.filters || [];
		var rotation = SG2DUtils.ifUndefined(config.rotation, 135);
		var effect = {
			type: SG2DEffects.TYPE_SHADOWS,
			layer: config.layer,
			filter: new PIXI.filters.DropShadowFilter({
				rotation: rotation - this.sg2d.camera.properties.rotate,
				distance: SG2DUtils.ifUndefined(config.distance, 8),
				alpha: SG2DUtils.ifUndefined(config.alpha, 0.6)
			}),
			options: {
				rotation: rotation
			}
		};
		container.filters.push(effect.filter);
		
		this.effects.add(effect);
		return effect;
	}
	
	addBevelsToLayer(config) {
		var container = this.sg2d.layers[config.layer].container;
		container.filters = container.filters || [];
		var rotation = SG2DUtils.ifUndefined(config.rotation, 135);
		var effect = {
			type: SG2DEffects.TYPE_BEVELS,
			layer: config.layer,
			filter: new PIXI.filters.BevelFilter({
				rotation: rotation - this.sg2d.camera.properties.rotate,
				thickness: SG2DUtils.ifUndefined(config.thickness, 2),
				lightAlpha: SG2DUtils.ifUndefined(config.lightAlpha, 0.8),
				shadowAlpha: SG2DUtils.ifUndefined(config.shadowAlpha, 0.8)
			}),
			options: {
				rotation: rotation
			}
		};
		effect.filter.padding = 1;
		container.filters.push(effect.filter);
		
		this.effects.add(effect);
		return effect;
	}
	
	addDisplacementToLayer(config) {
		var container = this.sg2d.layers[config.layer].container;
		container.filters = container.filters || [];
		
		var effect = {
			type: SG2DEffects.TYPE_DISPLACEMENT,
			layer: config.layer,
			options: {
				texture: config.texture || SG2DConsts.TILE_OVERRIDE,
				scale: config.scale || 1
			}
		};
		
		if (typeof config.iterate === "function") {
			effect.iterate = config.iterate.bind(effect);
			effect.options.animationStep = config.animationStep || 1;
		}
		
		effect.sprite = PIXI.Sprite.from(effect.options.texture);
		effect.sprite.scale.set(effect.options.scale);
		effect.sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		container.addChild(effect.sprite);
		
		effect.filter = new PIXI.filters.DisplacementFilter(effect.sprite);
		container.filters.push(effect.filter);
		
		this.effects.add(effect);
		return effect;
	}
}

if (typeof window === "object") window.SG2DEffects = SG2DEffects;
if (typeof _root === "object") _root.SG2DEffects = SG2DEffects;