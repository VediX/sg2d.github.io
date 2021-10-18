"use strict";

import SG2DUtils from "./sg2d-utils.js";

import SG2DApplication from './sg2d-application.js';

/**
 * Работа с графическими шрифтами
 * @namespace SG2D.Fonts
 */
let SG2DFonts = {
	
	/**
	 * Регистрирует шрифт. Как правило добавление шрифтов выполняется после парсинга графических ресурсов (см. {@link SG2D.Utils.parseTexturePack})
	 * @memberof SG2D.Fonts
	 * @method
	 * @param {object} options
	 * @param {string} options.name - Имя для регистрируемого шрифта
	 * @param {string} options.schema - Набор символов в порядке следования в ассете
	 * @param {string} options.texture - Имя базовой текстуры из которой собирается набор графических символов, например, "metal_yellow_big_48x50h". Размер букв определяется из имени текстуры (48x50).
	 * @example
	 * SG2D.Fonts.addFont({
	 *	name: "metal_yellow_big",
	 *	texture: "fonts/metal_yellow_big_48x50h",
	 *	schema: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!().:"
	 *});
	 */
	addFont: (options)=>{
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

/**
 * Графическая надпись
 * @alias SG2D.Label
 */
class SG2DLabel {
	
	/**
	 * @param {string} text
	 * @param {object} options
	 * @param {object} [options.x=0]
	 * @param {object} [options.y=0]
	 * @param {object} [options.scale=1]
	 * @return {SG2D.Label}
	 */
	constructor(text, options) {
		this.options = options || {};
		options.x = options.x || 0;
		options.y = options.y || 0;
		options.scale = options.scale || 1;
		
		this.setText(text);
	}
	
	/**
	 * Установить текст в надписи
	 * @param {string} text
	 */
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

/**
 * Создаёт CANVAS-элемент с графическим текстом
 * @alias SG2D.LabelCanvas
 */
class SG2DLabelCanvas {
	
	/**
	 * @param {string} text
	 * @param {object} options
	 * @param {HTMLElement} [options.parent] - Контейнер, в который размещается CANVAS-элемент надписи
	 * @return {SG2D.LabelCanvas}
	 * @example
	 * let canvasTitle = new SG2D.LabelCanvas("SG2D DEMO", {
	 *	font: "metal_yellow_big",
	 *	parent: document.querySelector("#title")
	 * });
	 */
	constructor(text, options) {
		this.options = options || {};
		this.canvas = SG2DUtils.createCanvas(1, 1, SG2DUtils.FLAG_CANVAS_ELEMENT);
		if (options.parent) {
			options.parent.append(this.canvas);
		}
		this.setText(text);
	}
	
	/**
	 * Установить текст надписи
	 * @param {string} text
	 */
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

export {SG2DFonts as default, SG2DLabel, SG2DLabelCanvas};