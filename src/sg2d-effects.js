"use strict";

import SG2DConsts from "./sg2d-consts.js";
import SG2DUtils from "./sg2d-utils.js";

/**
 * Эффект
 * @typedef SG2D.Effects.Effect
 * @type {object}
 * @property {Number} type - Тип фильтра: SG2D.Effects.TYPE_SHADOWS | SG2D.Effects.TYPE_BEVELS | SG2D.Effects.TYPE_DISPLACEMENT
 * @property {string|Number} layer
 * @property {PIXI.Filter} filter
 * @property {object} options - Специфические настройки фильтра
 */

/**
 * Эффекты, в том числе графические шейдеры
 * @alias SG2D.Effects
 */
class SG2DEffects {
	
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
	
	/**
	 * Добавляет тени
	 * @param {object} config
	 * @param {string|Number} config.layer
	 * @param {Number} [config.rotation=135]
	 * @param {Number} [config.distance=8]
	 * @param {Number} [config.alpha=0.6]
	 * @return {SG2D.Effects.Effect}
	 */
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
	
	/**
	 * Добавляет эффект приподнятости
	 * @param {object} config
	 * @param {string|Number} config.layer
	 * @param {Number} [config.rotation=135]
	 * @param {Number} [config.thickness=2]
	 * @param {Number} [config.lightAlpha=0.8]
	 * @param {Number} [config.shadowAlpha=0.8]
	 * @return {SG2D.Effects.Effect}
	 */
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
	
	/**
	 * Добавляет эффект искажения
	 * @param {object} config
	 * @param {string|Number} config.layer
	 * @param {string|PIXI.Texture} config.texture
	 * @param {Number} [config.scale=1]
	 * @param {function} [config.iterate] - Колбэк, выполняемый в каждую итерацию (кадр)
	 * @param {Number} [config.animationStep=1] - Параметр доступен в iterate() в this.options
	 * @return {SG2D.Effects.Effect}
	 */
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

SG2DEffects.TYPE_SHADOWS = 1;
SG2DEffects.TYPE_BEVELS = 2;
SG2DEffects.TYPE_DISPLACEMENT = 3;

export default SG2DEffects;