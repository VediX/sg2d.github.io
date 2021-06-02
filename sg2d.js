/**
 * SG2D 1.0.0
 * 2D graphics engine based on PixiJS and optimized by tile clustering
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 * SG2D may be freely distributed under the MIT license
 */

"use strict";

import SGModel from './libs/sg-model.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DClusters from './sg2d-clusters.js';
import SG2DTile from './sg2d-tile.js';
import SG2DCamera from './sg2d-camera.js';
import SG2DMouse from './sg2d-mouse.js';
import SG2DMath from './sg2d-math.js';
import SG2DUtils from './sg2d-utils.js';
import SG2DPlugins from './sg2d-plugins.js';
import SG2DPluginBase from './sg2d-plugin-base.js';
import SG2DDebugging from './sg2d-debugging.js';

export default class SG2D {
	
	/** @private */
	static _instance = null;
	static getInstance(bIgnoreEmpty) {
		if (this._instance) {
			return this._instance;
		} else if (! bIgnoreEmpty) {
			throw "Error! SG2D._instance is empty!";
		}
		return null;
	}
	
	/** @public */
	static STATE_IDLE = 0;
	static STATE_RUN = 1;
	static STATE_PAUSE = 2;
	static STATE_DESTROY = 1<<31; // leftmost bit
	
	/** @public */
	static plugins = null;
	
	/** @private */
	static _pluginsPromise = null;
	
	/** @private */
	static _initialized = false;
	
	/** @private */
	static _initializationPromise = null;
	
	/** @private */
	static _initialize() {
		SG2D.plugins = SG2DPlugins;
		SG2DPluginBase.SGModel = SGModel;
		SG2DPluginBase.SG2DConsts = SG2DConsts;
		SG2DPluginBase.SG2DUtils = SG2DUtils;
		SG2DPluginBase.SG2DClusters = SG2DClusters;
		SG2DPluginBase.SG2DTile = SG2DTile;
		SG2DPluginBase.SG2DCamera = SG2DCamera;
		this._initializationPromise.then(()=>{
			SG2D._initialized = true;
		});
	}
	
	/** @public */
	static LAYER_POSITION_ABSOLUTE = 0;
	static LAYER_POSITION_FIXED = 1;
	
	/** @readonly */
	static spritesCount = 0;
	
	/** @private */
	static _drawSprite(sprite, layer) {
		if (layer === void 0 || ! SG2D._instance.layers[layer]) {
			SG2D._instance.viewport.addChild(sprite);
		} else {
			SG2D._instance.layers[layer].container.addChild(sprite);
		}
		SG2D.spritesCount++;
		
		if (SG2DConsts.DRAW_BODY_LINES) SG2DDebugging.drawSG2DBodyLines(sprite.tile);
	}
	
	/** @private */
	static _removeSprite(sprite) {
		if (! sprite || ! sprite.parent) debugger; // TODO DEL
		sprite.parent.removeChild(sprite);
		//sprite.destroy();
		SG2D.spritesCount--;
		
		if (SG2DConsts.DRAW_BODY_LINES) SG2DDebugging.undrawSG2DBodyLines(sprite.tile);
	}
	
	/** @public */
	static setCellSizePix(v) {
		SG2DConsts.CELLSIZEPIX = +v;
		SG2DConsts.CELLSIZEPIX05 = (+v)>>1;
		SG2DConsts.CELLSIZELOG2 = Math.ceil(Math.log2(SG2DConsts.CELLSIZEPIX));
	}
	
	/**
	 * SG2D constructor
	 * @param {object} config
	 * @param {string}		[config.canvasId]
	 * @param {number}		[config.cellsizepix=32]
	 * @param {object}		[config.camera] - Config or instanceof SG2DCamera
	 * @param {boolean}		[config.camera.rotation=true]
	 * @param {number}			[config.camera.rotate=0]
	 * @param {object}			[config.camera.position={x: 0, y: 0}]
	 * @param {number}			[config.camera.scale_min=1]
	 * @param {number}			[config.camera.scale_max=16]
	 * @param {flag}			[config.camera.movement_by_pointer=0]
	 * @param {number}			[config.camera.rotate_adjustment=0
	 * @param {object}		[config.clusters] - Config or instanceof SG2DClusters
	 * @param {number}			[config.clusters.areasize=128]
	 * @param {object}		[config.mouse] - Config or instanceof SG2DMouse
	 * @param {function}	[config.iterate]
	 * @param {function}	[config.resize]
	 * @param {boolean}	[config.layers_enabled=true]
	 * @param {object}		[config.layers={main: {}}]
	 * @param {object}		[config.pixi] - Config for PIXI.Application constructor
	 * @param {HTMLElement}	[config.pixi.resizeTo=canvas.parentElement]
	 * @param {number}			[config.pixi.backgroundColor=0x000000]
	 * @param {boolean}		[config.pixi.antialias=false]
	 * @param {boolean}		[config.pixi.autoStart=true]
	 * @param {number}			[config.pixi.width=100]
	 * @param {number}			[config.pixi.height=100]
	 */
	constructor(config) {
		
		if (SG2D._instance) throw "SG2D Error! There is an instance of the class! You must execute .destroy() on the previous instance!";
		SG2D._instance = this;
		
		SG2D._initialized ? Promise.resolve() : SG2D._initialize();
		
		if (! config) throw "SG2D Error! config is empty!";
		
		if (+config.cellsizepix) SG2D.setCellSizePix(config.cellsizepix);
		
		let pixi = config.pixi = config.pixi || {};
		this.canvas = pixi.view = pixi.view || document.getElementById(config.canvasId) || document.querySelector("CANVAS");
		pixi.width = pixi.width !== void 0 ? pixi.width : 100;
		pixi.height = pixi.height !== void 0 ? pixi.height : 100;
		pixi.backgroundColor = pixi.backgroundColor !== void 0 ? pixi.backgroundColor : 0x000000;
		pixi.resizeTo = pixi.resizeTo !== void 0 ? pixi.resizeTo : this.canvas.parentElement;
		let autoStart = pixi.autoStart !== void 0 ? pixi.autoStart : true;
		pixi.autoStart = false;

		SG2D.drawSprite = SG2D._drawSprite.bind(this);
		SG2D.removeSprite = SG2D._removeSprite.bind(this);
		this.iterate = this.iterate.bind(this);
		this.iterate_out = config.iterate || function(){};
		this.resize_out = config.resize || function(){};
		this.canvas.oncontextmenu = function() { return false; };
		this.canvas.onselectstart = function() { return false; };

		this.pixi = new PIXI.Application(pixi);

		this.frame_index = 0;
		
		// Layers:
		
		this.layers_enabled = config.layers_enabled = (config.layers_enabled === void 0 ? true : config.layers_enabled);
		
		if (! config.layers) config.layers = { main: {} };
		
		var bNumbers = false;
		if (typeof config.layers === "number") {
			bNumbers = true;
			var _layers = [];
			for (var i = 0; i < config.layers; i++) _layers[i] = {};
			config.layers = _layers;
		}
		
		var bAbsContainer = false;
		for (var l in config.layers) {
			if (bNumbers) l = +l;
			var layer_cfg = config.layers[l];
			if (layer_cfg.position === SG2D.LAYER_POSITION_FIXED) { bAbsContainer = true; break; }
		}
		
		if (bAbsContainer) {
			this.viewport = new PIXI.Container();
			this.pixi.stage.addChild(this.viewport);
		} else {
			this.viewport = this.pixi.stage;
		}
		this.viewport.sortableChildren = true;
		
		this.layers = {};
		
		var zindex = 0;
		for (var l in config.layers) {
			if (bNumbers) l = +l;
			var layer_cfg = config.layers[l];
			var layer = this.layers[l] = {
				position: layer_cfg.position || SG2D.LAYER_POSITION_ABSOLUTE,
				zindex: layer_cfg.zindex || ++zindex,
				sortableChildren: layer_cfg.sortableChildren === void 0 ? true : layer_cfg.sortableChildren
			};
			var container = layer.container = (l === "main" ? this.viewport : (config.layers_enabled || layer.position === SG2D.LAYER_POSITION_FIXED ? new PIXI.Container() : this.viewport));
			if (config.layers_enabled || layer.position === SG2D.LAYER_POSITION_FIXED) {
				container.sortableChildren = layer.sortableChildren;
				container.zIndex = layer.zindex;
			}
			if (l !== "main") {
				if (layer.position === SG2D.LAYER_POSITION_FIXED) {
					this.pixi.stage.addChild(container);
				} else {
					if (config.layers_enabled) {
						this.viewport.addChild(container);
					}
				}
			}
		}
		
		// /Layer.
		
		this.pixi.ticker.add(this.iterate); // TODO BUG: on focusout the tab is disabled until the tab is focusin
		
		this.clusters = config.clusters instanceof SG2DClusters ? config.clusters : new SG2DClusters(config.clusters);
		
		this.camera = config.camera instanceof SG2DCamera ? config.camera : new SG2DCamera(config.camera);
		this.camera._sg2dconnect && this.camera._sg2dconnect(this);
		
		this.mouse = config.mouse instanceof SG2DMouse ? config.mouse : new SG2DMouse(config.mouse, { sg2d: this });
		this.mouse._sg2dconnect && this.mouse._sg2dconnect(this);
		
		this.resize = SG2DUtils.debounce(this.resize, 100).bind(this);
		addEventListener("resize", this.resize);
		
		SG2D._pluginsPromise = SG2DPlugins.load(config.plugins);
		
		this.state = SG2D.STATE_IDLE;
		if (autoStart) this.run();
	}
	
	run() {
		Promise.all([
			SG2D._initializationPromise,
			SG2D._pluginsPromise
		]).then(()=>{
			this.initClustersInCamera();
			this.pixi.start();
			this.state = SG2D.STATE_RUN;
		}, (e)=>{
			throw "Error 50713888! Message: " + e;
		});
	}
	
	initClustersInCamera() {
		let q = 0; // TODO DEL
		this.clusters.each((cluster)=>{
			if (cluster.drawed) {
				cluster.inCamera(true);
				q++;
			}
		});
	}

	iterate(t) {
		
		if (this.state !== SG2D.STATE_RUN) return;
		
		var tStart = SG2DUtils.getTime();

		this.frame_index++;
		
		this.camera._iterate();
		if (SG2DConsts.DRAW_BODY_LINES) SG2DDebugging.redrawSG2DBodiesLines();
		
		this.mouse.iterate();
		
		if (this.camera.properties.scale > 2) {
			for (var cluster of this.camera.clustersInCamera) {
				for (var tile of cluster.tiles) {
					if (tile.iterateAnimations) tile.iterateAnimations(this.frame_index);
				}
			}
		}
		
		this.iterate_out();

		var t = SG2DUtils.getTime();

		this.tUsed0 = t - tStart; // How long did the iteration calculation take without taking into account the rendering time of the web page along with the canvases
		this.tRequestAnimationFrame = (this.tPrevious ? t - this.tPrevious : 1); // Frame duration
		this.tPrevious = t;
	}

	pause() {
		this.pixi.stop();
		this.state = SG2D.STATE_PAUSE;
	}

	destroy() {
		
		this.state = SG2D.STATE_DESTROY;
		
		removeEventListener("resize", this.resize);
		this.mouse.destroy();
		this.mouse = null;
		this.camera.destroy();
		this.camera = null;
		this.clusters.destroy();
		this.clusters = null;
		
		SG2DDebugging.clear();
		
		 // To apply removeChild, you need to execute at least one iteration of this.pixi.render (), otherwise a bug - old pictures will flash on the canvas when the scene is restarted!
		for (var i = 0; i < this.viewport.children.length; i++) this.viewport.removeChild(this.viewport.children[i]);
		this.pixi.render();
		this.pixi.stop();
		setTimeout(()=>{
			this.pixi.destroy(void 0, {children: true});
			this.pixi = null;
		}, 500);
		
		SG2D.drawSprite = null
		SG2D.removeSprite = null
		SG2D.spritesCount = 0;
		SG2D._instance = null;
	}
	
	resize() {
		this.camera.onResize();
		this.resize_out();
	}
	
	static drawCircle(x, y, r, c) {
		var graphics = new PIXI.Graphics();
		graphics.beginFill(c || 0xff2222);
		graphics.drawCircle(x || 0, y || 0, r || 3);
		graphics.endFill();
		graphics.zIndex = 99999;
		SG2D.drawSprite(graphics);
	}
}

SG2D._initializationPromise = SG2DUtils._loadSystemTextures();

if (typeof window !== "undefined") window.SG2D = SG2D;
if (typeof _root === "object") _root.SG2D = SG2D;