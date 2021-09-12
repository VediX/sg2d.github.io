"use strict";

/**
 * SG2DTransitions v1.0.0.
 * Генератор плавных переходов между разными типами местности.
 * В тайлах или их конструкторе (класс тайла) можно задать индекс слоя (от 0 до 31) и тип перехода (TRANSITIONS_STANDARD, ...).
 * Плагин обрабатывает плитки только со статическим свойством **useTransition=true** и использует текстуру из статического свойства плитки!
 * @see https://github.com/VediX/sg2d.github.io
 * @license SG2DTransitions may be freely distributed under the MIT license
 * @copyright Kalashnikov Ilya
 */
class SG2DTransitions extends SG2D.PluginBase {
		
	static code = "transitions";
	
	static TRANSITIONS_STANDARD = 1;
	static TRANSITIONS_STRICT = 2;
	
	static K_STRICT = 1.1875;
	
	/**
	 * Конструктор выполняется автоматически движком SG2D при подключении плагина
	 * @protected
	 */
	constructor(...args) {
		
		super(...args);
		
		class VirtualTransitionsTile extends SG2D.PluginBase.SG2DTile {
			static char = " ";
			static texture = "vtt";
			static useTransitions = true;
			static altitude = -999;
			static _uid = 900000000;
			static isVirtualTransitionTile = true;
		}
		
		SG2DTransitions.VirtualTransitionsTile = VirtualTransitionsTile;
		
		SG2DTransitions.createMask();
		
		SG2DTransitions.success();
		//SG2DTransitions.failed("Test error: message error!");
	}
	
	/**
	 * Генерация графических масок
	 * @protected
	 */
	static createMask() {
		this.masks = [];
		this.masks[this.TRANSITIONS_STANDARD] = SG2D.PluginBase.SG2DUtils.addMask({
			name: "mask_transitions_" + this.TRANSITIONS_STANDARD,
			iterate: (x, y, radius, p_index)=>{
				return { r: 0, g: 0, b: 0, a: (radius >= SG2D.PluginBase.SG2DConsts.CELLSIZEPIX05 ? 255 : 0) };
			},
			width: SG2D.PluginBase.SG2DConsts.CELLSIZEPIX,
			height: SG2D.PluginBase.SG2DConsts.CELLSIZEPIX
		});
		
		var rStrict = this.K_STRICT * SG2D.PluginBase.SG2DConsts.CELLSIZEPIX05;
		this.masks[this.TRANSITIONS_STRICT] = SG2D.PluginBase.SG2DUtils.addMask({
			name: "mask_transitions_" + this.TRANSITIONS_STRICT,
			iterate: (x, y, radius, p_index)=>{
				return { r: 0, g: 0, b: 0, a: (radius >= rStrict ? 255 : 0) };
			},
			width: SG2D.PluginBase.SG2DConsts.CELLSIZEPIX,
			height: SG2D.PluginBase.SG2DConsts.CELLSIZEPIX
		});
		
		SG2D.PluginBase.SG2DUtils.addMask({
			name: this.VirtualTransitionsTile.texture,
			iterate: (x, y, radius, p_index)=>{
				return { r: 0, g: 0, b: 0, a: 0 };
			},
			width: SG2D.PluginBase.SG2DConsts.CELLSIZEPIX,
			height: SG2D.PluginBase.SG2DConsts.CELLSIZEPIX
		}).virtualTile = true;
	}
	
	static transitionsCoord = [
		[{dx:0,dy:-1},{dx:1,dy:-1},{dx:1,dy:0}], // 45
		[{dx:-1,dy:0},{dx:-1,dy:-1},{dx:0,dy:-1}], // 135
		[{dx:0,dy:1},{dx:-1,dy:1},{dx:-1,dy:0}], // 225
		[{dx:1,dy:0},{dx:1,dy:1},{dx:0,dy:1}] // 315
	];
	
	static nsca = [[],[],[],[]]; // Nearest Sprites Class for 45 corners
	
	/**
	 * Просканировать карту и создать переходные тайлы
	 * @param {SG2D.Clusters} area
	 */
	static run(area) {
		
		this.area = area;
		
		this.canvasTemp = this.canvasTemp || SG2D.PluginBase.SG2DUtils.createCanvas(
			SG2D.PluginBase.SG2DConsts.CELLSIZEPIX05,
			SG2D.PluginBase.SG2DConsts.CELLSIZEPIX05
		);
		this.ctxTemp = this.canvasTemp.getContext("2d");
		
		var tile, layer;
		
		// 1. Automatic detection of layers where there are tiles with transitions
		var layers = {};
		this.area.each((cluster)=>{
			for (tile of cluster.tiles) {
				if (tile.constructor.useTransitions) {
					layers[ tile.properties.layer === void 0 ? tile.constructor.layer : tile.properties.layer ] = true;
				}
			}
		});
		
		// 2. Creating virtual tiles around real tiles
		var tiles = [];
		this.area.each((cluster)=>{
			for (layer in layers) {
				cluster.getTilesInLayer(layer, tiles);
				if (tiles.length === 0 && SG2D.PluginBase.SG2DClusters.nearestClusters45(cluster, (nc)=>{
					nc.getTilesInLayer(layer, tiles);
					for (var i = 0; i < tiles.length; i++) {
						if (tiles[i].constructor !== this.VirtualTransitionsTile) return true;
					}
				})) {
					tile = new this.VirtualTransitionsTile({id: ++this.VirtualTransitionsTile._uid, position: SG2D.PluginBase.SGModel.clone(cluster.position), layer: layer });
				}
			}
		});
		
		// 3. Detect transitions
		var nc, nsc;
		this.area.each((cluster)=>{
			for (var tileMain of cluster.tiles) {
				if (! tileMain.constructor.texture || ! tileMain.constructor.useTransitions) continue;
				layer = tileMain.properties.layer === void 0 ? tileMain.constructor.layer : tileMain.properties.layer;
				var texture_name = tileMain.constructor.texture;
				for (var a = 0; a < 4; a++) {
					nsc = this.nsca[a];
					nsc[0] = void 0;
					nsc[1] = void 0;
					nsc[2] = void 0;
					for (var i = 0; i < 3; i++) {
						if (nc = this.area.getCluster(cluster.x + this.transitionsCoord[a][i].dx, cluster.y + this.transitionsCoord[a][i].dy)) {
							nc.getTilesInLayer(layer, tiles);
							for (var tile of tiles) {
								if (tile.constructor.useTransitions) {
									nsc[i] = tile.constructor;
									nsc[i].altitude = nsc[i].altitude || 0;
									nsc[i].transitionsMask = nsc[i].transitionsMask || this.TRANSITIONS_STANDARD;
									nsc[i].char = nsc[i].char || nsc[i].name[0];
								}
							}
						}
					}

					if (! nsc[0] || ! nsc[1] || ! nsc[2]) continue;

					if (
						tileMain.constructor !== nsc[0] && nsc[0] === nsc[2] && nsc[0] === nsc[1] || // самый распростарненный случай
						tileMain.constructor !== nsc[0] && nsc[0] === nsc[2] && nsc[1] !== nsc[0] && tileMain.constructor.altitude <= nsc[0].altitude || // пример: песчанная коса идет по диагонали
						tileMain.constructor !== nsc[0] && nsc[0] === nsc[2] && nsc[1] !== nsc[0] && tileMain.constructor.altitude > nsc[1].altitude
					) {
						if (! tileMain.transitions) tileMain.transitions = [];
						tileMain.transitions[a] = nsc[0];
						texture_name += "_"+nsc[0].char[0]+a;
					}
				}

				if (tileMain.transitions && tileMain.transitions.length) {
					var texture = PIXI.utils.TextureCache[texture_name];
					if (! texture) {
						texture = this.genTransitions(tileMain, texture_name);
					}
					tileMain.set("texture", texture_name);

					// For simple cases when the tile does not have transitions with different alpha landscape!
					if (tileMain.constructor === this.VirtualTransitionsTile) {
						for (var a = 0; a < 4; a++) {
							if (tileMain.transitions[a] && tileMain.transitions[a].alpha !== void 0) {
								tileMain.alpha = tileMain.transitions[a].alpha;
								break;
							}
						}
					}
				}
			}
		});
		
		// 4. Destroy unnecessary virtual tiles
		this.area.each((cluster)=>{
			for (tile of cluster.tiles) {
				if (tile.constructor === SG2DTransitions.VirtualTransitionsTile && tile.texture_current === "vtt") {
					tile.destroy();
				}
			}
		});
	}
	
	static quarters = [[0.5,0],[0,0],[0,0.5],[0.5,0.5]];
	
	/**
	 * Генератор переходных спрайтов
	 * @param {SG2D.Tile} tileMain
	 * @param {string} texture_name
	 * @returns {PIXI.Texture}
	 * @protected
	 */
	static genTransitions(tileMain, texture_name) {
	
		var mainClass = tileMain.constructor;
		var imgMain = SG2D.PluginBase.SG2DUtils.getTextureAsCanvas(mainClass.texture);
		var w = imgMain.width, h = imgMain.height;
		var w05 = Math.round(w/2), h05 = Math.round(h/2);
		var outClass;
		var canvasResult = SG2D.PluginBase.SG2DUtils.createCanvas(w, h);
		var ctxResult = canvasResult.getContext("2d");

		ctxResult.drawImage(imgMain, 0, 0);
		
		for (var a = 0; a < 4; a++) {
			if ((outClass = tileMain.transitions[a]) && outClass.texture) {
				var smx = Math.round(w * this.quarters[a][0]);
				var smy = Math.round(h * this.quarters[a][1]);
				var outCanvas = SG2D.PluginBase.SG2DUtils.getTextureAsCanvas(outClass.texture);
				var transitionsMask = (outClass.altitude > mainClass.altitude ? outClass.transitionsMask : mainClass.transitionsMask) || this.TRANSITIONS_STANDARD;
				if (outClass === this.VirtualTransitionsTile) {
					transitionsMask = mainClass.transitionsMask;
				}
				var mask = this.masks[transitionsMask];
				
				if (outClass === this.VirtualTransitionsTile) {
					ctxResult.globalCompositeOperation = "destination-out";
					ctxResult.drawImage(mask, smx, smy, w05, h05, smx, smy, w05, h05);
				} else if (mainClass === this.VirtualTransitionsTile) {
					this.canvasTemp.width = w05;
					this.canvasTemp.height = w05;
					this.ctxTemp.globalCompositeOperation = "source-over";
					this.ctxTemp.drawImage(outCanvas, smx, smy, w05, h05, 0, 0, w05, h05);
					this.ctxTemp.globalCompositeOperation = "destination-in";
					this.ctxTemp.drawImage(mask, smx, smy, w05, h05, 0, 0, w05, h05);
					ctxResult.drawImage(this.canvasTemp, 0, 0, w05, h05, smx, smy, w05, h05);
				} else {
					
					ctxResult.globalCompositeOperation = "destination-out";
					try {
					ctxResult.drawImage(mask, smx, smy, w05, h05, smx, smy, w05, h05);
					} catch(e) {
						debugger;
					}
					
					//(new Image()).src = canvasResult.toDataURL();
					
					// We work pixel by pixel due to alpha channel support, because standard modes (destination-out, destination-in, etc.) do not work with the alpha channel as required!
					var len = w05 * h05 * 4;
					var mainData = ctxResult.getImageData(smx, smy, w05, h05);
					var outData = (outCanvas.getContext("2d")).getImageData(smx, smy, w05, h05);
					for (var i = 0; i < len; i+=4) { // TODO: сделать через WebGL
						if (mainData.data[i+3]===0) {
							mainData.data[i] = outData.data[i];
							mainData.data[i+1] = outData.data[i+1];
							mainData.data[i+2] = outData.data[i+2];
							mainData.data[i+3] = outData.data[i+3];
						}
					}
					ctxResult.putImageData(mainData, smx, smy);
				}
			}
		}

		//(new Image()).src = canvasResult.toDataURL();
		
		var texture = PIXI.Texture.from((canvasResult._pixiId = texture_name, canvasResult));

		return texture;
	}
}

export default SG2DTransitions;