/**
 * SG2DFonts
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya
 */

"use strict";

import SG2DUtils from "./sg2d-utils.js";

import SG2DApplication from './sg2d-application.js';

export default class SG2DFonts {
	static addFont(options) {
		var font = SG2DFonts[options.name] = {};
		font.symbols = {};
		font.schema = options.schema;
		
		var m = options.texture.match(/(.+)_(\d+)x(\d+)(\w)?(\.\w+)?$/);
		if (m) {
			font.base_name = m[1];
			font.w = +m[2];
			font.h = +m[3];
			for (var index = 0; index < options.schema.length; index++) {
				font.symbols[options.schema[index]] = PIXI.Texture.from(font.base_name + "_" + (1+index));
			}
		}
	}
}

export class SG2DLabel {
	constructor(text, options) {
		this.options = options || {};
		options.x = options.x || 0;
		options.y = options.y || 0;
		options.scale = options.scale || 1;
		
		this.setText(text);
	}
	setText(text) {
		if (this.container) {
			this.container.removeChildren();
		} else {
			this.container = new PIXI.Container();
		}
		
		var font = SG2DFonts[this.options.font];
		if (! font) { console.warn("Error: font \"" + this.options.font + "\" not founded!"); return false; }
		
		this.container.x = this.options.x;
		this.container.y = this.options.y;
		
		var px = 0;
		var py = 0;
		text = '' + text;
		for (var i = 0; i < text.length; i++) {
			var c = text[i];
			var texture = font.symbols[c];
			if (texture) {
				var sprite = new PIXI.Sprite(texture);
				sprite.position.x = this.options.x + px;
				sprite.position.y = this.options.y;
				sprite.scale.set(this.options.scale);
				if (this.options.tint) sprite.tint = this.options.tint;
				this.container.addChild(sprite);
			} else {
				if (c !== " ") {
					console.warn("Error! The symbol \"" + c + "\" is missing in the font \"" + this.options.font + "\"!");
				}
			}
			px += font.w * this.options.scale;
		}
		
		var sg2d = this.options.sg2d || SG2DApplication.getInstance();
		var container = (this.options.layer ? sg2d.layers[this.options.layer].container : sg2d.viewport);
		container.addChild(this.container);
	}
}

export class SG2DLabelCanvas {
	constructor(text, options) {
		this.options = options || {};
		this.canvas = SG2DUtils.createCanvas(1, 1, SG2DUtils.FLAG_CANVAS_ELEMENT);
		if (options.parent) {
			options.parent.append(this.canvas);
		}
		this.setText(text);
	}
	setText(text) {
		
		var font = SG2DFonts[this.options.font];
		if (! font) { console.warn("Error: font \"" + this.options.font + "\" not founded!"); return false; }
		
		var px = 0;
		var py = 0;
		text = '' + text;
		
		this.canvas.width = font.w * text.length;
		this.canvas.height = font.h;
		
		for (var i = 0; i < text.length; i++) {
			var c = text[i];
			var texture = font.symbols[c];
			if (texture) {
				SG2DUtils.drawTextureToCanvas(texture, this.canvas, {x: px, y: 0});
			} else {
				if (c !== " ") {
					console.warn("Error! The symbol \"" + c + "\" is missing in the font \"" + this.options.font + "\"!");
				}
			}
			px += font.w;
		}
	}
}