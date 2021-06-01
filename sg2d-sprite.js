/**
 * SG2DSprite 1.0.0
 * https://github.com/VediX/SG2D
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

import SG2D from './sg2d.js';

/**
 * SG2DSprite - custom sprite, for example, an icon opposite the resource counter
 */
export default class SG2DSprite {
	static _options = {};
	/**
	 * @param {string|object} texture
	 * @param {object} options
	 * @param {number}			[options.x=0]
	 * @param {number}			[options.y=0]
	 * @param {(number|object)}	[options.scale=1]
	 * @param {(number|object)}	[options.anchor=1]
	 * @param {number}			[options.angle=0]
	 * @param {number}			[options.alpha=1]
	 * @param {boolean}		[options.visible=true]
	 * @param {boolean}		[options.interactive=false]
	 * @param {boolean}		[options.buttonMode=false]
	 * @param {function}		[options.pointerdown=void 0]
	 * @param {function}		[options.pointerup=void 0]
	 * @param {function}		[options.pointerupoutside=void 0]
	 * @param {function}		[options.pointerover=void 0]
	 * @param {function}		[options.pointerout=void 0]
	 * @param {object} [data=void 0]  Object properties go to this context
	 */
	constructor(texture, options, data = void 0) {
		options = options || SG2DSprite._options;
		this.sprite = new PIXI.Sprite(typeof texture === "string" ? PIXI.Texture.from(texture) : texture);
		this.sprite.x = options.x || 0;
		this.sprite.y = options.y || 0;
		options.scale = options.scale || {};
		if (typeof options.scale === "number") options.scale = {x: options.scale, y: options.scale};
		this.sprite.scale.x = options.scale.x === void 0 ? 1 : options.scale.x;
		this.sprite.scale.y = options.scale.y === void 0 ? 1 : options.scale.y;
		options.anchor = options.anchor || {};
		if (typeof options.anchor === "number") options.anchor = {x: options.anchor || 0, y: options.anchor || 0};
		this.sprite.anchor.set(options.anchor.x, options.anchor.y);
		this.sprite.angle = options.angle === void 0 ? 0 : options.angle;
		this.sprite.alpha = options.alpha === void 0 ? 1 : options.alpha;
		this.sprite.visible = options.visible === void 0 ? true : options.visible;
		this.sprite.interactive = options.interactive ? true : false;
		this.sprite.buttonMode = options.buttonMode ? true : false;
		
		if (options.pointerdown) this.sprite.on("pointerdown", options.pointerdown);
		if (options.pointerup) this.sprite.on("pointerup", options.pointerup);
		if (options.pointerupoutside) this.sprite.on("pointerupoutside", options.pointerupoutside);
		if (options.pointerover) this.sprite.on("pointerover", options.pointerover);
		if (options.pointerout) this.sprite.on("pointerout", options.pointerout);
		
		var container = (options.layer ? SG2D.getInstance().layers[options.layer].container : SG2D.getInstance().viewport);
		container.addChild(this.sprite);
		
		if (typeof data === "object") Object.assign(this, data);
		this.sprite.sg2dSprite = this;
	}
}