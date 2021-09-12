/**
 * SG2D Utilities
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */

"use strict";

import SG2DConsts from './sg2d-consts.js';
import SG2DMath from './sg2d-math.js';

/**
 * @namespace SG2D.Utils
 */
var SG2DUtils = {
	
	DEFAULT_WIDTH: 32,
	DEFAULT_HEIGHT: 32,
	
	/**
	 * Флаг добавления прозрачной границы в спрайте.
	 * @see SG2D.Utils.createInBetweenTextures
	 * @memberof SG2D.Utils
	 */
	FLAG_ADD_BORDER_ALPHA: 0b00000001,
	
	/**
	 * Получить время с точностью до мс. Распознаёт браузер и платформу NodeJS
	 * @memberof SG2D.Utils
	 * @returns {Number}
	 */
	getTime: function() {
		var sResult;
		if (typeof process !== "undefined" && process.hrtime) {
			var diff = process.hrtime(),
			sResult = diff[0] + '.' + ('00' + Math.round(diff[1]/1e6)).substr(-3,3);
		} else if (typeof performance !== "undefined" && performance.now) {
			sResult = (performance.now() / 1000).toFixed(3);
		} else {
			var d = new Date();
			sResult = (d.getTime()/1000).toFixed(3);
		}
		return +sResult;
	},
	
	/**
	 * Динамическая загрузка и выполнение скриптов
	 * @memberof SG2D.Utils
	 * @param {string} src - Путь
	 * @param {function} [onload] - Вызывается после загрузки скрипта, но перед его выполнением
	 * @return {Promise}
	 */
	loadJS: function(src, onload = void 0) {
		return new Promise((resolve, reject)=>{
			var script = document.createElement('script');
			script.onload = (event)=>{
				onload && onload(event);
				resolve();
			};
			script.onerror = reject;
			script.src = src;
			document.head.append(script);
		});
	},
	
	/**
	 * Получить текстуру в виде отдельного CANVAS с нарисованной в нём текстурой. При повторном вызове возвращается созданный ранее CANVAS для текстуры
	 * @memberof SG2D.Utils
	 * @param {string|PIXI.Texture} mTexture
	 * @return {HTMLCanvasElement}
	 */
	getTextureAsCanvas: function(mTexture) {

		var texture = typeof mTexture === "object" ? mTexture : PIXI.Texture.from(mTexture);

		if (texture.canvas) return texture.canvas;

		var canvas = this.createCanvas(texture.frame.width, texture.frame.height);
		var ctx = canvas.getContext("2d");
		ctx.drawImage(texture.baseTexture.resource.source, texture.frame.x, texture.frame.y, texture.frame.width, texture.frame.height, 0, 0, texture.frame.width, texture.frame.height);

		canvas.texture = texture.textureCacheIds[0] || "error";
		texture.canvas = canvas;

		return canvas;
	},
	
	/**
	 * Получить текстуру как blob-объект
	 * @memberof SG2D.Utils
	 * @async
	 * @param {string|PIXI.Texture} mTexture
	 * @return {Promise<Blob>}
	 */
	getTextureAsBlob: async function(mTexture) {

		if (typeof mTexture === "string" && ! PIXI.utils.TextureCache[mTexture]) {
			console.error("Texture \"" + mTexture + "\" does not exist!");
			return false;
		}

		var texture = typeof mTexture === "object" ? mTexture : PIXI.Texture.from(mTexture);

		if (texture.blob) return texture.blob;

		var canvas = this.createCanvas(texture.frame.width, texture.frame.height);
		var ctx = canvas.getContext("2d");
		ctx.drawImage(texture.baseTexture.resource.source, texture.frame.x, texture.frame.y, texture.frame.width, texture.frame.height, 0, 0, texture.frame.width, texture.frame.height);

		if (canvas.convertToBlob) {
			texture.blob = await canvas.convertToBlob({type: "image/png"});
		} else {
			texture.blob = await new Promise(resolve=>canvas.toBlob(blob=>resolve(blob)));
		}

		return texture.blob;
	},
	
	/**
	 * Получить URL текстуры с base64 кодированием
	 * @memberof SG2D.Utils
	 * @async
	 * @param {string|PIXI.Texture} mTexture
	 * @param {boolean} [flagOpenWindow=false] - Если **true**, то ссылка откроется в новом окне
	 * @return {Promise<string>|false}
	 */
	getTextureUrl: async function(mTexture, flagOpenWindow = false) {
		if (! mTexture) return null;
		var blob = await SG2DUtils.getTextureAsBlob(mTexture);
		if (blob) {
			blob.url = blob.url || URL.createObjectURL(blob);
			if (flagOpenWindow) {
				var win = window.open("", "_blank");
				win.document.write("<html><head><script>window.location = '"+blob.url+"';</script></head></html>");
				win.document.close();
			} else {
				return blob.url;
			}
		} else {
			return false;
		}
	},

	/** @private */
	_options: {x: void 0, y: void 0},
	
	/**
	 * Отрисовка текстуры в произвольный канвас
	 * @memberof SG2D.Utils
	 * @param {string|PIXI.Texture} texture
	 * @param {HTMLElementCanvas} canvas
	 * @param {object} options
	 * @param {Number} [options.x=0]
	 * @param {Number} [options.y=0]
	 */
	drawTextureToCanvas: function(texture, canvas, options) {
		options = options || this._options;
		var ctx = canvas.getContext("2d");
		var canvas = this.getTextureAsCanvas(texture);
		ctx.drawImage(canvas, options.x === void 0 ? 0 : options.x, options.y === void 0 ? 0 : options.y);
	},

	/**
	 * Создать спрайт-маску
	 * @memberof SG2D.Utils
	 * @param {object} config
	 * @param {Number} [config.width=SG2D.Utils.DEFAULT_WIDTH]
	 * @param {Number} [config.height=SG2D.Utils.DEFAULT_HEIGHT]
	 * @param {function} config.iterate - Итератор
	 * @param {function} config.name - Имя текстуры
	 * @return {HTMLCanvasElement}
	 */
	addMask: function(config) {
		var w = config.width || SG2DUtils.DEFAULT_WIDTH;
		var h = config.height || SG2DUtils.DEFAULT_HEIGHT;

		var canvasMask = this.createCanvas(w, h);

		var ctxMask = canvasMask.getContext("2d");
		var imageData = ctxMask.getImageData(0, 0, w, h);
		var p05 = w>>1;
		var l = w * h * 4;
		for (var i = 0; i < l; i+=4) {
			var p = i >> 2,
				y = Math.floor(p / h) - p05,
				x = p - (y + p05) * w - p05,
				r = SG2DMath.distance_d(x + 0.5, y + 0.5);
			var rgba = config.iterate(x, y, r, p);
			imageData.data[i] = rgba.r;
			imageData.data[i+1] = rgba.g;
			imageData.data[i+2] = rgba.b;
			imageData.data[i+3] = rgba.a;
		}
		ctxMask.putImageData(imageData, 0, 0);

		canvasMask._pixiId = config.name;
		var texture = PIXI.Texture.from(canvasMask);
		texture.canvas = canvasMask;
		texture._isFinalTexture = true;

		//(new Image()).src = canvasMask.toDataURL();

		return canvasMask;
	},

	/** @private */
	_optionsBAT: {},

	/**
	 * Сделать границу спрайтов полупрозрачной (чтобы исключить артефакты в виде полос по краям тайлов ландшафта)
	 * @memberof SG2D.Utils
	 * @param {object} options
	 * @param {string[]|PIXI.Texture[]} [options.textures=void 0] Список текстур. Если не задан, то берутся все текстуры с флагом _isFinalTexture=true
	 * @param {number} [options.alpha=0.995] Прозрачность самой внешней границы (1 пиксель от края)
	 * @param {number} [options.alpha2=1] Прозрачность границы 2 пикселя от края
	 */
	setBorderAlphaTextures: function(options={}) {
		options.textures = options.textures || [];
		if (! options.textures.length) {
			this._getFinalTextures(options.textures);
		}
		for (var i = 0; i < options.textures.length; i++) {
			var texture = typeof options.textures[i] === "object" ? options.textures[i] : PIXI.utils.TextureCache[options.textures[i]];
			if (texture) {
				this._optionsBAT.texture = texture;
				this._optionsBAT.alpha = options.alpha;
				this._optionsBAT.alpha2 = options.alpha2;
				this.setBorderAlphaTexture(this._optionsBAT);
			} else {
				console.warn("Texture with name \"" + options.textures[i] + "\" not found!");
			}
		}
	},

	/**
	 * Сделать границу заданного спрайта полупрозрачной (чтобы исключить артефакты в виде полос по краям тайлов ландшафта)
	 * @memberof SG2D.Utils
	 * @param {object} options
	 * @param {PIXI.Texture|string} options.texture
	 * @param {number} [options.alpha=0.995] Прозрачность самой внешней границы (1 пиксель от края)
	 * @param {number} [options.alpha2=1] Прозрачность границы 2 пикселя от края
	 */
	setBorderAlphaTexture: function(options={}) {

		if (options.alpha === void 0) options.alpha = 0.995;
		if (options.alpha2 === void 0) options.alpha2 = 1;

		options.alpha = ~~(options.alpha * 256);
		options.alpha2 = ~~(options.alpha2 * 256);

		let texture_src = typeof options.texture === "object" ? options.texture : PIXI.utils.TextureCache(options.texture);
		let canvas = this.getTextureAsCanvas(texture_src);
		var ctx = canvas.getContext("2d");
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var l = canvas.width * canvas.height * 4;
		for (var i = 0; i < l; i+=4) {
			var p = i >>2;
			var y = Math.floor(p / canvas.width);
			var x = p - y * canvas.width;
			if (x === 0 || y === 0 || x === canvas.width-1 || y === canvas.height-1) {
				imageData.data[i+3] = Math.min(imageData.data[i+3], options.alpha);
			}
			if (options.alpha2 < 255 && (x === 1 || y === 1 || x === canvas.width-2 || y === canvas.height-2)) {
				imageData.data[i+3] = Math.min(imageData.data[i+3], options.alpha2);
			}
		}
		ctx.putImageData(imageData, 0, 0);

		PIXI.Texture.removeFromCache(canvas.texture);
		PIXI.BaseTexture.removeFromCache(canvas.texture);

		canvas._pixiId = canvas.texture;
		var texture_dest = PIXI.Texture.from(canvas);
		texture_dest.canvas = canvas;
		texture_dest._isFinalTexture = texture_src._isFinalTexture;
		texture_dest._qBorderAlpha = texture_src._qBorderAlpha;
	},

	/**
	 * Добавляет прозрачную границу к спрайту в 1 пиксель, благодаря чему PIXI сглаживает края спрайта при его вращении. Ширина и высота спрайта увеличиваются на 2 пикселя!
	 * @memberof SG2D.Utils
	 * @param {object} options
	 * @param {string[]|PIXI.Texture[]} [options.textures=void 0] - Список текстур. Если не задан, то берутся все текстуры с флагом _isFinalTexture=true
	 * @param {number} [options.qborder=1] Ограничитель допустимой толщины прозрачной рамки
	 */
	addBorderAlphaTextures: function(options) {
		options.textures = options.textures || [];
		options.qborder = options.qborder || 1;
		if (! options.textures.length) {
			this._getFinalTextures(options.textures);
		}
		for (var i = 0; i < options.textures.length; i++) {
			var texture = typeof options.textures[i] === "object" ? options.textures[i] : PIXI.utils.TextureCache[options.textures[i]];
			if (texture) {
				if (options.qborder > this.ifUndefined(texture._qBorderAlpha, 0)) {
					var srcCanvas = SG2DUtils.getTextureAsCanvas(texture);
					var destCanvas = SG2DUtils.createCanvas(texture.width + 2, texture.height + 2);
					var destCtx = destCanvas.getContext("2d");
					destCtx.drawImage(srcCanvas, 1, 1);
					destCanvas._pixiId = texture.textureCacheIds[0] || texture.canvas._pixiId;
					PIXI.Texture.removeFromCache(destCanvas._pixiId);
					PIXI.BaseTexture.removeFromCache(destCanvas._pixiId);
					var textureDest = PIXI.Texture.from(destCanvas);
					textureDest.canvas = destCanvas;
					textureDest._isFinalTexture = texture._isFinalTexture;
					textureDest._qBorderAlpha = texture._qBorderAlpha ? texture._qBorderAlpha + 1 : 1;
				}
			} else {
				console.warn("Texture with name \"" + options.textures[i] + "\" not found!");
			}
		}
	},

	/** @private */
	_getFinalTextures: function(textures) {
		for (var name in PIXI.utils.TextureCache) {
			var texture = PIXI.utils.TextureCache[name];
			if (texture._isFinalTexture) {
				textures.push(texture);
			}
		}
	},

	// TODO DEL: (не исп-ся?)
	/*_rgba: {r:0,g:0,b:0,a:0},
	imageDataSetPixel: function(imageData, x, y, r, g, b, a) {
		var index = (x + y * imageData.width) * 4;
		imageData.data[index] = r;
		imageData.data[index + 1] = g;
		imageData.data[index + 2] = b;
		imageData.data[index + 3] = a;
	},
	imageDataGetPixel: function(imageData, x, y) {
		var index = (x + y * imageData.width) * 4;
		this._rgba.r = imageData.data[index];
		this._rgba.g = imageData.data[index+1];
		this._rgba.b = imageData.data[index+2];
		this._rgba.a = imageData.data[index+3];
		return this._rgba;
	},*/
	// /TODO DEL.

	/** @private */
	_ibt: [],

	/**
	 * Создание промежуточных текстур для постепенного перехода одной текстуры в другую (без использования альфа-канала)
	 * @memberof SG2D.Utils
	 * @param {object} config
	 * @param {PIXI.Texture|string} config.start
	 * @param {PIXI.Texture|string} config.end
	 * @param {string} config.name - Имя промежуточной текстуры с подстановкой индекса вместо "%"
	 * @param {Number} [config.count=2]
	 * @param {Number} [config.flags] Флаги: {@link SG2D.Utils.FLAG_ADD_BORDER_ALPHA}
	 */
	createInBetweenTextures: function(config) {
		if (! config.start) throw "Error 7020181!";
		if (! config.end) throw "Error 7020182!";
		config.count = Math.max(2, config.count || 2);
		if (! config.name) throw "Error 7020184!";
		config.flags = config.flags || 0;

		if (config.count <= 2) return;

		let canvasStart = this.getTextureAsCanvas(config.start);
		let canvasEnd = this.getTextureAsCanvas(config.end);
		let w = canvasStart.width, h = canvasStart.height, wh = w * h;

		for (var i = 0; i < wh; i++) this._ibt[i] = false;

		let dataStart = canvasStart.getContext("2d").getImageData(0,0,w,h).data;
		let dataEnd = canvasEnd.getContext("2d").getImageData(0,0,w,h).data;

		let blocksize = config.count - 1; // 5-1=4
		// count	     blocks
		// 2-1=1	S-...	e-...
		// 3-1=2	S-S-...	S-e- S-e- S-e- S-e- S-e- S-e-...	e-e-...
		// 4-1=3	S-S-S-...	S-S-e- S-S-e- S-S-e- S-S-e-...		S-e-e- S-e-e- S-e-e- S-e-e-...		e-e-e-...
		// 5-1=4	S-S-S-S-...	S-S-S-e- S-S-S-e- S-S-S-e-...		S-S-e-e- S-S-e-e- S-S-e-e-...		S-e-e-e- S-e-e-e- S-e-e-e-...		e-e-e-e-...
		// +random within one block (S-S-x-S)

		let qblocks = Math.ceil(wh / blocksize);
		let dataPrev = null;

		let texturesCreated = [];
		
		for (var j = 2; j < config.count; j++) {

			var jc = (j-1)/(config.count-1);
			var m = config.count - j + 1; // number of remaining unreplaced pixels

			var imageData = new ImageData(Uint8ClampedArray.from(dataPrev || dataStart), w, h);
			var data = imageData.data;

			for (var b = 0; b < qblocks; b++) {
				var pm = Math.floor(Math.random() * m); // Random position in the remaining unreplaced pixels
				var p0 = b * blocksize;
				for (var p = p0; p < p0 + blocksize; p++) {
					if (this._ibt[p]) continue;
					if (pm === 0) {
						this._ibt[p] = true;
						var index = p<<2;

						var brightnessStart = dataStart[index]+dataStart[index+1]+dataStart[index+2];
						var brightnessEnd = dataEnd[index]+dataEnd[index+1]+dataEnd[index+2];
						var brightnessDelta = (brightnessEnd - brightnessStart) * jc / 3 / 256;
						for (var c = 0; c < 3; c++) {
							var ic = index+c;
							data[ic] = dataEnd[ic];
							if (brightnessDelta < 0) {
								data[ic] = ~~(data[ic] * (1 + brightnessDelta));
							} else {
								data[ic] = ~~(data[ic] + (256 - data[ic]) * brightnessDelta);
							}
						}

						var ic = index+3;
						var alphaDelta = (dataEnd[ic] - dataStart[ic]) * jc / 256;
						data[ic] = dataEnd[ic];
						if (alphaDelta) {
							if (alphaDelta < 0) {
								data[ic] = ~~(data[ic] * (1 + alphaDelta));
							} else {
								data[ic] = ~~(data[ic] + (256 - data[ic]) * alphaDelta);
							}
						}

						break;
					}
					pm--;
				}
			}

			var canvas = this.createCanvas(w, h);
			var ctx = canvas.getContext("2d");
			ctx.putImageData(imageData, 0, 0);
			
			canvas._pixiId = config.name.replace("%", j);
			var texture = PIXI.Texture.from(canvas);
			texture.canvas = canvas;
			texture._isFinalTexture = true;
			
			texturesCreated.push(texture);

			dataPrev = data;
		}
		
		if (config.flags & this.FLAG_ADD_BORDER_ALPHA) {
			this.addBorderAlphaTextures({
				textures: texturesCreated
			});
		}

		var nameStart = config.name.replace("%", 1);
		if (! PIXI.utils.TextureCache[nameStart]) {
			canvasStart._pixiId = nameStart;
			var texture = PIXI.Texture.from(canvasStart);
			texture._isFinalTexture = true;
		}

		var nameEnd = config.name.replace("%", config.count);
		if (! PIXI.utils.TextureCache[nameEnd]) {
			canvasEnd._pixiId = nameEnd;
			var texture = PIXI.Texture.from(canvasEnd);
			texture._isFinalTexture = true;
		}
	},

	/**
	 * Текстуры, в названии которых указан размер по шаблону "_%x%", автоматически распиливаются на составные текстуры с добавлением индекса.
	 * @memberof SG2D.Utils
	 * @param {object} resources - Объект, выдаваемый движком PIXI при загрузке ресурсов (см. PIXI.Loader.load(loader, resources)=>{...})
	 */
	parseTexturePack: function(resources) {
		for (var r in resources) {
			if (r.substr(-6, 6) === "_image") continue;
			var resource = resources[r];
			for (var code in resource.textures) {

				var baseTexture = resource.textures[code];

				var m = code.match(/(.+)_(\d+)x(\d+)(\w)?(\.\w+)?$/); // Search for pictures with a specific name, for example: "explosion_64x64.png"
				if (m) {
					baseTexture._isFinalTexture = false;
					//SG2DUtils.getTextureUrl(code).then((res)=>{ (new Image()).src = res; }); // debugging

					var name = m[1];
					var w = +m[2];
					var h = +m[3];
					var dir = m[4] || "h";
					var sizex = Math.floor(baseTexture.width / w);
					var sizey = Math.floor(baseTexture.height / h);

					if (dir === "h") {
						var index = 0;
						for (var y = 0; y < sizey; y++) {
							for (var x = 0; x < sizex; x++) {
								var texture_name = name + "_" + (++index);
								if (PIXI.utils.TextureCache[texture_name]) {
									console.error("Texture \"" + texture_name + "\" already exists!");
									continue;
								}
								var px = x * w, py = y * h;
								var rect = new PIXI.Rectangle(0, 0, 0, 0);
								rect.width = w;
								rect.height = h;
								rect.x = baseTexture.frame.x + px;
								rect.y = baseTexture.frame.y + py;
								var texture = new PIXI.Texture(baseTexture, rect);
								PIXI.Texture.addToCache(texture, texture_name);
								texture._isFinalTexture = true;
								//SG2DUtils.getTextureUrl(name + "_" + index).then((res)=>{ (new Image()).src = res; }); // debugging
							}
						}
					} else {
						throw "dir vertical no supported! (TODO)";
					}

					PIXI.Texture.removeFromCache(baseTexture);
					PIXI.BaseTexture.removeFromCache(baseTexture);
				} else {
					baseTexture._isFinalTexture = true;
				}
			}
		}
	},

	/** @private */
	_loadSystemTextures: function() {
		let promise = new Promise((resolve, failed)=>{
			if (typeof PIXI === "undefined") {
				resolve("PIXI is undefined! Perhaps we are working in server mode!");
			} else {
				const loader = new PIXI.Loader()
				loader.add(SG2DConsts.SYSTEM_TILES).load((loader, resources)=>{
					for (var i = 0; i < SG2DConsts.SYSTEM_TILES.length; i++) {
						PIXI.Texture.removeFromCache( SG2DConsts.SYSTEM_TILES[i].url );
						PIXI.BaseTexture.removeFromCache( SG2DConsts.SYSTEM_TILES[i].url );
						PIXI.utils.TextureCache[ SG2DConsts.SYSTEM_TILES[i].name ]._isFinalTexture = true;
					}
					resolve();
				});
			}
		});
		return promise;
	},

	FLAG_CANVAS_OFFSCREEN: 0,
	FLAG_CANVAS_ELEMENT: 1,

	/**
	 * Создаёт новый канвас. По умолчанию создаёт OffscreenCanvas
	 * @memberof SG2D.Utils
	 * @param {Number} [width=SG2D.Utils.DEFAULT_WIDTH]
	 * @param {Number} [height=SG2D.Utils.DEFAULT_HEIGHT]
	 * @param {Number} [flag=0] **SG2D.Utils.FLAG_CANVAS_OFFSCREEN** | **SG2D.Utils.FLAG_CANVAS_ELEMENT**
	 */
	createCanvas: function(width = void 0, height = void 0, flag = 0) {
		//flag = this.FLAG_CANVAS_ELEMENT; // FOR DEBUGGING
		if (flag === this.FLAG_CANVAS_ELEMENT || typeof OffscreenCanvas === "undefined") {
			var canvas = document.createElement("CANVAS");
			canvas.width = width || SG2DUtils.DEFAULT_WIDTH;
			canvas.height = height || SG2DUtils.DEFAULT_HEIGHT;
			return canvas;
		} else {
			return new OffscreenCanvas(width || SG2DUtils.DEFAULT_WIDTH, height || SG2DUtils.DEFAULT_HEIGHT);
		}
	},
	
	drawCircle: function(x, y, r, c) {
		var graphics = new PIXI.Graphics();
		graphics.beginFill(c || 0xff2222);
		graphics.drawCircle(x || 0, y || 0, r || 3);
		graphics.endFill();
		graphics.zIndex = 99999;
		SG2D.Application.drawSprite(graphics);
	},

	/**
	 * Преобразовать пиксели в кластеры (единица измерения)
	 * @memberof SG2D.Utils
	 * @param {Number} x_or_y
	 * @returns {Number}
	 */
	PXtoCX: function(x_or_y) {
		return 1 + (x_or_y >> SG2DConsts.CELLSIZELOG2);
	},

	/**
	 * Вернёт функцию, которая выполнится только после истечения заданного промежутка времени за который не было обращений к ней
	 * @memberof SG2D.Utils
	 * @param {function} func
	 * @param {Number} delay
	 * @returns {function}
	 */
	debounce: function(func, delay) {
		let clearTimer;
		return function() {
			const context = this;
			const args = arguments;
			clearTimeout(clearTimer);
			clearTimer = setTimeout(() => func.apply(context, args), delay);
		}
	},

	/**
	 * Вернёт функцию, которая будет выполнятся не чаще одного раза в заданный промежуток времени
	 * @memberof SG2D.Utils
	 * @param {function} func
	 * @param {type} limit - Время задержки
	 * @param {object} [_context=this]
	 * @returns {function}
	 */
	throttle: function(func, limit, _context) {
		let lastFunc;
		let lastRan;
		return function() {
			const context = _context || this;
			const args = arguments;
			if (!lastRan) {
				func.apply(context, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(function() {
					if ((Date.now() - lastRan) >= limit) {
						func.apply(context, args);
						lastRan = Date.now();
					}
				}, limit - (Date.now() - lastRan));
			}
		}
	},

	/** @private */
	_p: void 0,

	/**
	 * Проверить - объект пустой или нет
	 * @memberof SG2D.Utils
	 * @param {object} o
	 * @returns {Boolean}
	 */
	isEmpty: function(o) {
		for (this._p in o) return false;
		return true;
	},

	/**
	 * forEach для объекта
	 * @memberof SG2D.Utils
	 * @param {object} obj
	 * @param {function} callback
	 * @param {object} context
	 * @returns {undefined}
	 */
	objectForEach: function(obj, callback, context = this) {
		for (var name in obj) {
			if (callback.call(context, obj[name])===false) break;
		}
	},
	
	/**
	 * Количество собственных свойст в объекте
	 * @memberof SG2D.Utils
	 * @param {object} o
	 * @returns {Number}
	 */
	propertiesCount: function(o) {
		let q = 0;
		for (var p in o) q++;
		return q;
	},

	/**
	 * Вернёт valueIfUndefined, если value===undefined
	 * @memberof SG2D.Utils
	 * @param {mixed} value
	 * @param {mixed} valueIfUndefined
	 * @returns {value|valueIfUndefined}
	 */
	ifUndefined: function(value, valueIfUndefined) {
		return (value === void 0 ? valueIfUndefined : value);
	}
};

export default SG2DUtils;