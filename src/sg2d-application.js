"use strict";

import SGModel from './libs/sg-model/sg-model.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DClusters from './sg2d-clusters.js';
import SG2DTile from './sg2d-tile.js';
import SG2DCamera from './sg2d-camera.js';
import SG2DPointer from './sg2d-pointer.js';
import SG2DMath from './sg2d-math.js';
import SG2DUtils from './sg2d-utils.js';
import SG2DEffects from './sg2d-effects.js';
import SG2DPlugins from './sg2d-plugins.js';
import SG2DPluginBase from './sg2d-plugin-base.js';
import SG2DSound from './sg2d-sound.js';
import SG2DDebugging from './sg2d-debugging.js';

/**
 * Сцена
 * @alias SG2D.Application
 */
class SG2DApplication {
	
	/**
	 * Создает экземпляр сцены
	 * @param {object}			config
	 * @param {string}			[config.canvasId] По умолчанию ищется первый CANVAS
	 * @param {number}				[config.cellsizepix] - Ширина (и длина) кластера в пикселях. По умолчанию равны 32.
	 * @param {object|SG2D.Camera}	[config.camera] - Конфиг камеры или созданный отдельно экземпляр на основе {@link SG2D.Camera}
	 * @param {object|SG2D.Clusters}	[config.clusters] - Конфиг карты или созданный отдельно экземпляр на основе {@link SG2D.Clusters}
	 * @param {object|SG2D.Pointer}	[config.pointer] - Конфиг мыши/тача или созданный отдельно экземпляр на основе {@link SG2D.Pointer}
	 * @param {function}			[config.iterate] - Пользовательский итератор, запускается в каждый кадр отрисовки
	 * @param {function}			[config.resize] - Пользовательский обработчки события resize
	 * @param {object}				[config.layers] - Список графический слоёв (например, слой для ландшафта, слой для зданий, слой для движущихся объектов и анимаций и т.п.)
	 * @param {object}				[config.pixi] - Конфигурация для PIXI при выполнении: new PIXI.Application(config.pixi). Пример параметров, которые можно передать: resizeTo, backgroundColor, antialias, autoStart, width, height
	 * @param {object}				[config.matter] - Конфиг для конструктора Matter.Engine. Чтобы MatterJS подключился, нужно передать хотя бы пустой объект или true! Пример параметров, которые можно передать:  gravity: { x: 0, y: 0 }, broadphase: { bucketWidth: 64, bucketHeight: 64 }
	 * @param {object|SG2D.Effects} [config.effects] - Конфиг эффектов или созданный отдельно экземпляр {@link SG2D.Effects}
	 * @param {String[]}		[config.plugins] - Список подключаемых плагинов, например: ["sg2d-transitions"]
	 * @param {object|string}	[config.sound] - Путь к json-файлу с настройками звука или сам конфиг. Описание параметров см. здесь: {@link SG2D.Sound#load}
	 * @param {object}			[config.promise] - Промис, который будет выполнен после создания и запуска сцены
	 */
	constructor(config) {
		
		if (SG2DApplication._instance) throw "SG2D.Application Error! There is an instance of the class! You must execute .destroy() on the previous instance!";
		SG2DApplication._instance = this;
		
		SG2DApplication._initialized ? Promise.resolve() : SG2DApplication._initialize();
		
		if (! config) throw "SG2D.Application Error! config is empty!";
		
		if (+config.cellsizepix) SG2DApplication.setCellSizePix(config.cellsizepix);
		
		this.id = config.id ? config.id : ++SG2DApplication._uid;
		
		let pixi = config.pixi = config.pixi || {};
		this.canvas = pixi.view = pixi.view || document.getElementById(config.canvasId) || document.querySelector("CANVAS");
		pixi.width = pixi.width !== void 0 ? pixi.width : 100;
		pixi.height = pixi.height !== void 0 ? pixi.height : 100;
		pixi.backgroundColor = pixi.backgroundColor !== void 0 ? pixi.backgroundColor : 0x000000;
		pixi.resizeTo = pixi.resizeTo !== void 0 ? pixi.resizeTo : this.canvas.parentElement;
		let autoStart = pixi.autoStart !== void 0 ? pixi.autoStart : true;
		pixi.autoStart = false;

		SG2DApplication.drawSprite = SG2DApplication._drawSprite.bind(this);
		SG2DApplication.removeSprite = SG2DApplication._removeSprite.bind(this);
		this.iterate = this.iterate.bind(this);
		this.iterate_out = config.iterate || function(){};
		this.resize_out = config.resize || function(){};
		this.canvas.oncontextmenu = function() { return false; };
		this.canvas.onselectstart = function() { return false; };
		
		SG2D.pixi = this.pixi = new PIXI.Application(pixi);
		
		if (config.matter) {
			if (config.matter === true) config.matter = {};
			SG2D.matter = this.matter = Matter.Engine.create(config.matter);
			
			Matter.Events.on(this.matter, "collisionStart", function(event) {
				for (var i = 0; i < event.pairs.length; i++) {
					var pair = event.pairs[i];
					if (pair.bodyA.parent.tile && pair.bodyB.parent.tile) {
						pair.bodyA.parent.tile.collision && pair.bodyA.parent.tile.collision(pair.bodyB.parent.tile, pair, event.pairs);
						pair.bodyB.parent.tile.collision && pair.bodyB.parent.tile.collision(pair.bodyA.parent.tile, pair, event.pairs);
					}
				}
			});
		}

		this.frame_index = 0;
		
		// Layers:
		
		if (! config.layers) config.layers = { main: {} };
		
		if (typeof config.layers === "number") {
			var _layers = [];
			for (var i = 0; i < config.layers; i++) _layers[i] = {};
			config.layers = _layers;
		}
		
		let bContainerFixedExists = false;
		for (var l in config.layers) {
			var layer_cfg = config.layers[l];
			if (layer_cfg.position === SG2DConsts.LAYER_POSITION_FIXED) {
				bContainerFixedExists = true;
				break;
			}
		}
		
		if (bContainerFixedExists) {
			this.viewport = new PIXI.Container();
			this.pixi.stage.addChild(this.viewport);
		} else {
			this.viewport = this.pixi.stage;
		}
		this.viewport.sortableChildren = true;
		
		this.layers = {};
		
		let zIndex = 0;
		for (var l in config.layers) {
			var layer_cfg = config.layers[l];
			var layer = this.layers[l] = {
				position: layer_cfg.position || SG2DConsts.LAYER_POSITION_ABSOLUTE,
				zIndex: layer_cfg.zIndex || ++zIndex,
				sortableChildren: layer_cfg.sortableChildren === void 0 ? true : layer_cfg.sortableChildren
			};
			var container = layer.container = (l === "main" ? this.viewport : new PIXI.Container());
			if (layer.sortableChildren !== void 0) container.sortableChildren = layer.sortableChildren;
			if (layer.zIndex !== void 0) container.zIndex = layer.zIndex;
			if (l !== "main") {
				if (layer.position === SG2DConsts.LAYER_POSITION_FIXED) {
					this.pixi.stage.addChild(container);
				} else {
					this.viewport.addChild(container);
				}
			}
		}
		
		// /Layer.
		
		this.pixi.ticker.add(this.iterate); // TODO BUG: on focusout the tab is disabled until the tab is focusin
		
		this.clusters = config.clusters instanceof SG2DClusters ? config.clusters : new SG2DClusters(config.clusters);
		
		this.camera = config.camera instanceof SG2DCamera ? config.camera : new SG2DCamera(config.camera);
		this.camera._sg2dconnect && this.camera._sg2dconnect(this);
		
		this.pointer = config.pointer instanceof SG2DPointer ? config.pointer : new SG2DPointer(config.pointer);
		this.pointer._sg2dconnect && this.pointer._sg2dconnect(this);
		
		this.resize = SG2DUtils.debounce(this.resize, 100).bind(this);
		addEventListener("resize", this.resize);
		
		SG2DApplication._pluginsPromise = SG2DPlugins.load(config.plugins);
		
		this.effects = config.effects instanceof SG2DEffects ? config.effects : new SG2DEffects(config.effects);
		this.effects._sg2dconnect && this.effects._sg2dconnect(this);
		
		if (typeof config.sound === "string") {
			config.sound = { options: { config: config.sound } };
		}
		if (typeof config.sound === "object") {
			SG2DApplication._soundConfigPromise = SG2DSound.load(config.sound.options, config.sound.properties);
		} else {
			SG2DApplication._soundConfigPromise = Promise.resolve();
		}
		SG2DSound._sg2dconnect(this);
		
		if (config.promise) {
			this.promise = config.promise;
		} else {
			this.promise = new Promise((resolve, reject)=>{
				this._resolve = resolve;
				this._reject = reject;
			});
			if (! this.promise.resolve) this.promise.resolve = this._resolve;
			if (! this.promise.reject) this.promise.reject = this._reject;
		}
		
		this.state = SG2DApplication.STATE_IDLE;
		if (autoStart) this.run();
	}
	
	/**
	 * Запустить сцену
	 */
	run() {
		Promise.all([
			SG2DApplication._initializationPromise,
			SG2DApplication._pluginsPromise,
			SG2DApplication._soundConfigPromise
		]).then(()=>{
			this.promise.resolve(this);
			window.dispatchEvent(new Event('resize'));
			this._initClustersInCamera();
			this.pixi.start();
			this.state = SG2DApplication.STATE_RUN;
		}, (e)=>{
			throw "Error 50713888! Message: " + e;
		});
	}
	
	/** @private */
	_initClustersInCamera() {
		this.clusters.each((cluster)=>{
			if (cluster.drawed) {
				cluster.inCamera(true);
			}
		});
	}
	
	/**
	 * Итерация сцены
	 */
	iterate(t) {
		
		if (this.state !== SG2DApplication.STATE_RUN) return;
		
		var tStart = SG2DUtils.getTime();

		this.frame_index++;
		
		if (this.matter) {
			this.matterIterate();
		}
		
		this.camera._iterate();
		if (SG2DConsts.DRAW_BODY_LINES) SG2DDebugging.redrawSG2DBodiesLines();
		
		this.pointer.iterate();
		
		for (var cluster of this.camera.clustersInCamera) {
			for (var tile of cluster.tiles) {
				if (tile.iterateAnimations) tile.iterateAnimations(this.frame_index);
			}
		}
		
		for (var effect of this.effects.effects) {
			effect.iterate && effect.iterate();
		}
		
		for (var tile of this.clusters.tilesset) {
			tile.iterate && tile.iterate();
		}
		
		this.iterate_out();

		var t = SG2DUtils.getTime();

		this.tUsed0 = t - tStart; // How long did the iteration calculation take without taking into account the rendering time of the web page along with the canvases
		this.tRequestAnimationFrame = (this.tPrevious ? t - this.tPrevious : 1); // Frame duration
		this.tPrevious = t;
	}
	
	/**
	 * Итерация физического движка
	 */
	matterIterate() {
		
		Matter.Engine.update(this.matter);
		
		this.aBodies = Matter.Composite.allBodies(this.matter.world);
		for (var i = 0; i < this.aBodies.length; i++) {
			var body = this.aBodies[i];
			if (body.isStatic) continue;
			
			var tile = body.tile;
			if (! tile) continue; // global border
			
			// TODO ON
			/*if (body.position.x < this.boundsDestroy.min.x || body.position.y < this.boundsDestroy.min.y || body.position.x > this.boundsDestroy.max.x || body.position.y > this.boundsDestroy.max.y) {
				tile.destroy();
				continue;
			}*/
			
			if (body.angle >= SG2DMath.PI2) { Matter.Body.setAngle(body, body.angle - SG2DMath.PI2); body.anglePrev = body.angle; }
			if (body.angle < 0) { Matter.Body.setAngle(body, body.angle + SG2DMath.PI2); body.anglePrev = body.angle; }
			
			// use SGModel-setter to detect changes
			tile.set("position", body.position, SGModel.OPTIONS_PRECISION_5);
			tile.set("angle", body.angle / SG2DMath.PI180, SGModel.OPTIONS_PRECISION_5);
			tile.set("velocity", body.velocity, SGModel.OPTIONS_PRECISION_5);
			tile.set("angularVelocity", body.angularVelocity, SGModel.OPTIONS_PRECISION_5);
			if (tile.changed) {
				tile.bounds.set(body.bounds);
				if (body.velocity) { // при движении тел bounds вытягивается в сторону движения!
					if (body.velocity.x > 0) tile.bounds.max.x -= body.velocity.x; else tile.bounds.min.x -= body.velocity.x;
					if (body.velocity.y > 0) tile.bounds.max.y -= body.velocity.y; else tile.bounds.min.y -= body.velocity.y;
				}
			} else {
				Matter.Body.setAngularVelocity(body, 0);
				Matter.Body.setVelocity(body, {x: 0, y:0});
				Matter.Body.setPosition(body, tile.properties.position);
				Matter.Body.setAngle(body, tile.properties.angle * SG2DMath.PI180);
			}
		}
	}

	/**
	 * Поставить на паузу сцену
	 */
	pause() {
		this.pixi.stop();
		this.state = SG2DApplication.STATE_PAUSE;
	}

	/**
	 * Удалить сцену
	 */
	destroy() {
		
		this.state = SG2DApplication.STATE_DESTROY;
		
		removeEventListener("resize", this.resize);
		this.pointer.destroy();
		this.pointer = null;
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
			SG2D.pixi = null;
		}, 500);
		
		if (SG2D.matter) {
			Matter.World.clear(this.matter.world); // ?
			Matter.Engine.clear(this.matter);
			SG2D.matter = null;
		}
		
		SG2DApplication.drawSprite = null
		SG2DApplication.removeSprite = null
		SG2DApplication.spritesCount = 0;
		SG2DApplication._instance = null;
	}
	
	/**
	 * Обработчик события на изменение размера экрана, в т.ч. поворот экрана для мобильных устройств
	 */
	resize() {
		this.camera.onResize();
		this.resize_out();
	}
}

/** @private */
SG2DApplication._initializationPromise = SG2DUtils._loadSystemTextures();

/** @private */
SG2DApplication._instance = null;

/**
 * Получить singleton-экземпляр сцены
 * @static
 * @param {boolean} [bIgnoreEmpty=false] true - не генерировать ошибку при отсутствующем singleton-экземпляре
 * @returns {object}
 */
SG2DApplication.getInstance = function(bIgnoreEmpty) {
	if (this._instance) {
		return this._instance;
	} else if (! bIgnoreEmpty) {
		throw "Error! SG2D.Application._instance is empty!";
	}
	return null;
}

SG2DApplication.STATE_IDLE = 0;
SG2DApplication.STATE_RUN = 1;
SG2DApplication.STATE_PAUSE = 2;
SG2DApplication.STATE_DESTROY = 1<<31; // leftmost bit

/** @private */
SG2DApplication._uid = 0;

SG2DApplication.plugins = null;

/** @private */
SG2DApplication._pluginsPromise = null;

/** @private */
SG2DApplication._soundConfigPromise = null;

/** @private */
SG2DApplication._initialized = false;

/** @private */
SG2DApplication._initialize = function() {
	SG2DApplication.plugins = SG2DPlugins;
	SG2DPluginBase.SGModel = SGModel;
	SG2DPluginBase.SG2DConsts = SG2DConsts;
	SG2DPluginBase.SG2DUtils = SG2DUtils;
	SG2DPluginBase.SG2DClusters = SG2DClusters;
	SG2DPluginBase.SG2DTile = SG2DTile;
	SG2DPluginBase.SG2DCamera = SG2DCamera;
	PIXI.utils.skipHello();
	this._initializationPromise.then(()=>{
		SG2DApplication._initialized = true;
	});
}

/**
 * Количество обрабатываемых спрайтов
 * @readonly
 */
SG2DApplication.spritesCount = 0;

/** @private */
SG2DApplication._drawSprite = function(sprite, layer) {
	if (layer === void 0 || ! SG2DApplication._instance.layers[layer]) {
		SG2DApplication._instance.viewport.addChild(sprite);
	} else {
		SG2DApplication._instance.layers[layer].container.addChild(sprite);
	}
	SG2DApplication.spritesCount++;

	if (SG2DConsts.DRAW_BODY_LINES) SG2DDebugging.drawSG2DBodyLines(sprite.tile);
}

/** @private */
SG2DApplication._removeSprite = function(sprite) {
	if (! sprite || ! sprite.parent) debugger; // TODO DEL
	sprite.parent.removeChild(sprite);
	//sprite.destroy();
	SG2DApplication.spritesCount--;

	if (SG2DConsts.DRAW_BODY_LINES) SG2DDebugging.undrawSG2DBodyLines(sprite.tile);
}

/**
 * Задать размер кластера в пикселях (ширина и длина)
 * @param {number} v
 */
SG2DApplication.setCellSizePix = function(v) {
	SG2DConsts.CELLSIZEPIX = +v;
	SG2DConsts.CELLSIZEPIX05 = (+v)>>1;
	SG2DConsts.CELLSIZELOG2 = Math.ceil(Math.log2(SG2DConsts.CELLSIZEPIX));
}

export default SG2DApplication;