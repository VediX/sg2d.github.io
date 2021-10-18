"use strict";

import SGModel from './libs/sg-model/sg-model.js';
import SG2DApplication from './sg2d-application.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DUtils from './sg2d-utils.js';
import SG2DMath from './sg2d-math.js';
import SG2DClusters from './sg2d-clusters.js';
import SG2DBounds from './sg2d-bounds.js';
import SG2DSound from './sg2d-sound.js';
import SG2DDebugging from './sg2d-debugging.js';

/**
 * Тайл со спрайтами. Базовый класс: {@link SGModel}
 * @alias SG2D.Tile
 */
class SG2DTile extends SGModel {
	
	/**
	 * Конструктор
	 * @param {object} properties
	 * @param {object} [properties.texture] - Задаётся для основного спрайта
	 * @param {object} [properties.angle=0] - Задаётся для основного спрайта
	 * @param {object} [properties.anchor=0.5] - Задаётся для основного спрайта
	 * @param {object} [properties.scale=1] - Задаётся для основного спрайта
	 * @param {object} [properties.alpha=1] - Задаётся для основного спрайта
	 * @param {object} [properties.visible=true] - Задаётся для основного спрайта
	 * @param {object} [properties.zindex=0] - Задаётся для основного спрайта
	 * @param {object} [properties.layer] - Задаётся для основного спрайта
	 * @returns {SG2D.Tile}
	 */
	constructor(properties, thisProps, options) {
		super(...arguments);
	}
	
	initialize(properties, thisProps, options) {
		
		// Костыль, поскольку в JS нет возможности выполнить код в дочернем классе во время наследования от родительского класса
		this.constructor._prepareStaticConfigSprites();
		
		options = options || SGModel.OBJECT_EMPTY;
		
		this.bounds = (this.body && this.body.bounds ? new SG2DBounds(this.body.bounds) : new SG2DBounds());
		this.boundsCXY = new SG2DBounds();
		this.clusters = new Set();
		this.centerCluster = null;
		this.sprite = void 0; // основной спрайт, может быть не задан!
		this.sprites = void 0; // список спрайтов
		this.hasAnimations = false;
		
		if (! this.constructor.sprites) throw "Error 82423704! this.constructor.sprites must be filled!";
		
		this.sprites = SGModel.clone(this.constructor.sprites);
		if (this.sprites.main) this.sprite = this.sprites.main;
		if (this.sprite) {
			this.sprite.texture = this.properties.texture !== void 0 ? this.properties.texture : this.constructor.sprites.main.texture;
			for (var p in SG2DTile._defaultSpriteValues) {
				if (properties[p] !== void 0) this.sprite[p] = properties[p];
			}
			if (this.properties.layer !== void 0) {
				this.sprite.layer = this.properties.layer;
			}
		}
		
		SG2DUtils.objectForEach(this.sprites, sprite=>{
			sprite._texture = sprite.texture;
			if (sprite.animation) {
				sprite.animation._count = sprite.animation.start || 1;
				sprite.animation._sleep = 1;
				if (sprite.animation.onComplete) sprite.animation.onComplete = sprite.animation.onComplete.bind(this);
				this.hasAnimations = true;
				this._animationIndex = 0; // плитка может быть в нескольких кластерах
			}
		});
		
		SG2DClusters.tiles[this.properties.id] = this;
		SG2DClusters.tilesset.add(this);
		
		this._onGeometric();
		this.drawUndraw();
	}
	
	/**
	 * Own setter for texture property
	 * @private
	 */
	setTexture(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		if (SG2DConsts.ONLY_LOGIC) return;
		this._setTileProperty("texture", value, options, flags);
	}
	
	/**
	 * Own setter for position property
	 * @private
	 */
	setPosition(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		if (this.set("position", value, options, flags | SGModel.FLAG_IGNORE_OWN_SETTER)) {
			this._onGeometric();
			this.drawUndraw();
		}
	}
	
	/**
	 * Own setter for angle property
	 * @private
	 */
	setAngle(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		if (value !== void 0) value = SG2DMath.normalize_a(value, SG2DUtils.ifUndefined(options.precision, 1));
		if (this._setTileProperty("angle", value, options, flags)) {
			//this._onGeometric();
		}
	}
	
	/**
	 * Own setter for angle property
	 * @private
	 */
	setAnchor(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("anchor", value, options, flags);
	}
	
	/**
	 * Own setter for scale property
	 * @private
	 */
	setScale(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("scale", value, options, flags);
	}
	
	/**
	 * Own setter for visible property
	 * @private
	 */
	setAlpha(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("alpha", value, options, flags);
	}
	
	/**
	 * Own setter for visible property
	 * @private
	 */
	setVisible(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("visible", value, options, flags);
	}
	
	/**
	 * Own setter for visible property
	 * @private
	 */
	setZindex(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("zindex", value, options, flags);
	}
	
	/** @private */
	_setTileProperty(name, value, options = SGModel.OBJECT_EMPTY, flags = 0) {
		this._spritesFromOptions(options);
		if (SG2DTile._spritesFromOptions.size) {
			let changed = false;
			for (var sprite of SG2DTile._spritesFromOptions) {
				if (! sprite) continue;
				if (sprite[name] !== value) {
					sprite[name] = value;
					changed = true;
					this.drawUndraw(sprite);
				}
			}
			return changed;
		} else {
			if (this.set(name, value, options, flags | SGModel.FLAG_IGNORE_OWN_SETTER)) {
				SG2DUtils.objectForEach(this.sprites, sprite=>{
					if (sprite.setter_flag !== SG2DTile.FLAG_ONLY_OPTIONS_SPRITE) sprite[name] = value;
				});
				this.drawUndraw();
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Для движущихся спрайтов проверяет, требуется ли рисование при попадании в камеру.
	 * @param {object} [sprite]
	 */
	drawUndraw(sprite = void 0) {
		if (! SG2DConsts.ONLY_LOGIC && SG2DApplication._initialized) {
			if (this.isInCamera()) {
				if (sprite) {
					this._pixiSprite(sprite);
				} else {
					for (var name in this.sprites) {
						this._pixiSprite(this.sprites[name]);
					}
					this.set("drawed", true);
				}
				return true;
			} else {
				this.removeSprites();
				return false;
			}
		}
		return void 0;
	}
	
	/**
	 * Проверить находится ли тайл в камере
	 * @returns {Boolean}
	 */
	isInCamera() {
		if (! this.clusters) debugger; // TODO DEL DEBUG
		for (var cluster of this.clusters) {
			if (cluster.drawed) return true;
		}
		return false;
	}
	
	// Чтобы обработать щелчок по экземпляру тайла, задайте этот метод
	// click(target, options) {...}
	
	/** @private */
	_pixiSprite(sprite) {
		if (SG2DApplication._initialized && this.constructor.noDraw === false) {
			var pixiSprite = sprite.pixiSprite;
			if (sprite.visible) {
				if (! pixiSprite) {
					let texture = this.updateSpriteTexture(sprite, sprite.animation && sprite.animation.running ? this.getAnimationTexture(sprite) : sprite.texture);
					pixiSprite = sprite.pixiSprite = new PIXI.Sprite(texture);
					pixiSprite.tile = this;
					SG2DApplication.drawSprite(pixiSprite, sprite.layer);
				}
			} else {
				if (pixiSprite) {
					SG2DApplication.removeSprite(sprite.pixiSprite);//, {children: true}); // TODO? Bush transform=null!!!=>Error in pixi.js
					delete sprite.pixiSprite;
				}
			}
			if (sprite.pixiSprite) {
				if (! sprite.animation || sprite.animation && ! sprite.animation.running) {
					this.updateSpriteTexture(sprite, sprite.texture);
				}
				pixiSprite.position.x = ~~this.properties.position.x;
				pixiSprite.position.y = ~~this.properties.position.y;
				if (typeof sprite.anchor === "number") pixiSprite.anchor.set(sprite.anchor); else pixiSprite.anchor.set(sprite.anchor.x, sprite.anchor.y);
				if (typeof sprite.scale === "number") pixiSprite.scale.set(sprite.scale); else pixiSprite.scale.set(sprite.scale.x, sprite.scale.y);
				pixiSprite.angle = sprite.angle;
				pixiSprite.zIndex = sprite.zindex;
				pixiSprite.alpha = sprite.alpha;
				pixiSprite.visible = sprite.visible;
			}
		}
	}
	
	/**
	 * @protected
	 */
	removeSprites() { // Переопределить, если есть сложный рендеринг
		if (this.properties.drawed) {
			for (var name in this.sprites) {
				var sprite = this.sprites[name];
				if (sprite.pixiSprite) {
					SG2DApplication.removeSprite(sprite.pixiSprite);//, {children: true}); // TODO? Bush transform=null!!!=>Error in pixi.js
					delete sprite.pixiSprite;
				}
				if (sprite.animation) {
					sprite.animation._count = 1;
					sprite.animation._sleep = 1;
					if (! sprite.animation.loop) {
						sprite._texture = sprite.texture;
						sprite.animation.running = false;
					}
				}
			}
			this.set("drawed", false);
		}
	}
	
	/**
	 * Начать анимацию
	 * @param {string|SG2D.Sprite} [name_or_sprite=void 0] Если не задано, то берётся спрайт по умолчанию (основной)
	 */
	startAnimation(name_or_sprite = void 0) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			sprite.animation.running = true;
			sprite.visible = true;
			sprite.animation._count = 1;
			sprite.animation._sleep = 1;
			if (this.isInCamera()) {
				this._pixiSprite(sprite);
			}
			this.updateSpriteTexture(sprite, this.getAnimationTexture(sprite));
		}
	}
	
	/**
	 * Прервать анимацию
	 * @param {string|SG2D.Sprite} [name_or_sprite=void 0] Если не задано, то берётся спрайт по умолчанию (основной)
	 */
	breakAnimation(name_or_sprite = void 0) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			sprite.animation.running = false;
			sprite.animation.visible = false;
			sprite.animation._count = 1;
			sprite.animation._sleep = 1;
			this.updateSpriteTexture(sprite, sprite.texture || sprite._texture);
			if (this.isInCamera()) {
				this._pixiSprite(sprite);
			}
		}
	}
	
	/**
	 * Приостановить анимацию
	 * @param {string|SG2D.Sprite} [name_or_sprite=void 0] Если не задано, то берётся спрайт по умолчанию (основной)
	 * @param {object} [options=void 0]
	 * @param {boolean}	[options.visible=void 0] Если значение задано, то спрайт отображается/скрывается
	 */
	stopAnimation(name_or_sprite = void 0, options = void 0) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			sprite.animation.running = false;
		}
		if (options && options.visible !== void 0) this.set("visible", options.visible, { sprite: sprite });
	}
	
	/**
	 * Возобновить анимацию
	 * @param {string|SG2D.Sprite} [name_or_sprite=void 0] Если не задано, то берётся спрайт по умолчанию (основной)
	 * @param {object} [options=void 0]
	 * @param {boolean}	[options.visible=void 0] Если значение задано, то спрайт отображается/скрывается
	 */
	resumeAnimation(name_or_sprite = void 0, options = void 0) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			sprite.animation.running = true;
		}
		if (options && options.visible !== void 0) this.set("visible", options.visible, { sprite: sprite });
	}
	
	/**
	 * Одна итерация анимации
	 * @param {string|SG2D.Sprite} [name_or_sprite=void 0] Если не задано, то берётся спрайт по умолчанию (основной)
	 * @param {number} [count=1]
	 */
	stepAnimation(name_or_sprite = void 0, count = 1) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			for (var i = 0; i < count; i++) {
				this.iterateAnimations(true, sprite);
			}
		}
	}
	
	/** @private */
	_checkSpriteAnimation(name_or_sprite) {
		if (this.hasAnimations) {
			name_or_sprite = name_or_sprite || this.sprite;
			let sprite = typeof name_or_sprite === "object" ? name_or_sprite : this.sprites[name_or_sprite];
			if (! sprite) throw "Error 730002! Animation sprite \"" + name_or_sprite + "\" not found!";
			let animation = sprite.animation;
			if (! animation) throw "Error 908720! Sprite \"" + sprite.name + "\" does not contain animation description!";
			return sprite;
		}
		return false;
	}
	
	getAnimationTexture(sprite) {
		return sprite.animation.basetexture + sprite.animation._count;
	}
	
	/** @protected */
	iterateAnimations(frame_index = true, sprite = void 0) {
		if (this.hasAnimations && (this._animationIndex < frame_index || frame_index === true)) {
			if (frame_index !== true) this._animationIndex = frame_index;
			if (sprite) {
				this._iterateAnimation(sprite);
			} else {
				SG2DUtils.objectForEach(this.sprites, this._iterateAnimation, this);
			}
		}
	}
	
	/** @private */
	_iterateAnimation(sprite) {
		var animation = sprite.animation;
		if (animation && animation.running) {
			animation._sleep++;
			if (animation._sleep > animation.sleep) {
				animation._sleep = 1;
				animation._count++;
				if (animation._count > animation.count) {
					animation._count = 1;
					if (! animation.loop) {
						sprite._texture = sprite.texture || sprite._texture;
						sprite.visible = false;
						animation.running = false;
						if (animation.onComplete) animation.onComplete(sprite);
						this._pixiSprite(sprite);
					}
				} else {
					sprite._texture = this.getAnimationTexture(sprite);
				}
				this.updateSpriteTexture(sprite);
			}
		}
	}
	
	/**
	 * @return {PIXI.Texture}
	 */
	updateSpriteTexture(sprite, _texture = void 0) {
		if (_texture !== void 0) sprite._texture = _texture;
		let sTexture = this.checkTexture(sprite._texture);
		let texture = PIXI.Texture.from(sTexture, {}, SG2DConsts.PIXI_TEXTURE_STRICT);
		if (sprite.pixiSprite) {
			if (sprite.pixiSprite.texture.textureCacheIds[0] !== sTexture) sprite.pixiSprite.texture = texture;
		}
		return texture;
	}
	
	/**
	 * @param {string} sTexture
	 * @return {string}
	 */
	checkTexture(sTexture) {
		if (! SG2DConsts.PIXI_TEXTURE_STRICT && ! PIXI.utils.TextureCache[sTexture]) {
			if (SG2DTile._textures_not_founded.indexOf(sTexture) === -1) {
				SG2DTile._textures_not_founded.push(sTexture);
				console.warn("Texture with the name \"" + sTexture + "\" was not found!"); debugger;
				if (! sTexture) debugger;
			}
			sTexture = SG2DConsts.TILE_404;
		}
		return sTexture;
	}
	
	/** @private */
	_spritesFromOptions(options = SGModel.OBJECT_EMPTY) {
		SG2DTile._spritesFromOptions.clear();
		if (options.sprite) {
			SG2DTile._spritesFromOptions.add(options.sprite);
		}
		if (options.sprites) {
			SG2DUtils.objectForEach(options.sprites, sprite=>SG2DTile._spritesFromOptions.add(sprite));
		}
	}
	
	/** @private */
	_onGeometric() {
		this._calcBoundsPX();
		this._calcCXY();
		this._calcClustersBody();
	}
	
	/** @private */
	_calcBoundsPX() {
		this.bounds.set(
			this.properties.position.x - SG2DConsts.CELLSIZEPIX05 + 0.5,
			this.properties.position.y - SG2DConsts.CELLSIZEPIX05 + 0.5,
			this.properties.position.x + SG2DConsts.CELLSIZEPIX05 - 0.5,
			this.properties.position.y + SG2DConsts.CELLSIZEPIX05 - 0.5
		);
	}
	
	/** @private */
	_calcCXY() {
		
		SG2DTile._point.x = SG2DUtils.PXtoCX(this.properties.position.x);
		SG2DTile._point.y = SG2DUtils.PXtoCX(this.properties.position.y);
		this.centerCluster = SG2DClusters.getClusterCXY(SG2DTile._point); // before this.set("cxy", ...) !
		
		this.set("cxy", SG2DTile._point, void 0, SGModel.FLAG_PREV_VALUE_CLONE);
		
		this.boundsCXY.set(
			SG2DUtils.PXtoCX(this.bounds.min.x),
			SG2DUtils.PXtoCX(this.bounds.min.y),
			SG2DUtils.PXtoCX(this.bounds.max.x),
			SG2DUtils.PXtoCX(this.bounds.max.y)
		);
	}
	
	/** @private */
	_calcClustersBody() {
		var cluster;
		// TODO: учесть то что объект может быть повернут и тогда некоторые кластера (угловые) можно выкинуть из расчетов, т.к. тело объекта не будет присутствовать там!
		for (cluster of this.clusters) {
			if (cluster.x < this.boundsCXY.min.x || cluster.x > this.boundsCXY.max.x || cluster.y < this.boundsCXY.min.y || cluster.y > this.boundsCXY.max.y) {
				this.clusters.delete(cluster);
				cluster.tiles.delete(this);
				if (this.constructor.isBody) cluster.bodies.delete(this);
			}
		}
		for (var y = this.boundsCXY.min.y; y <= this.boundsCXY.max.y; y++) {
			for (var x = this.boundsCXY.min.x; x <= this.boundsCXY.max.x; x++) {
				if (cluster = SG2DClusters.getCluster(x, y)) { // MatterJS позволяет микропроваливание объектов друг в друга, т.е. на границе карты объекты могут быть!
					this.clusters.add(cluster);
					cluster.tiles.add(this);
					if (this.constructor.isBody) cluster.bodies.add(this);
				}
			}
		}
	}
	
	/**
	 * Проиграть звук к тайлу, учитывается 2D-окружение и расстояние
	 * @param {string} code
	 */
	sound(code) {
		SG2DSound.play(code, this);
	}
	
	destroy() {
		if (SG2DConsts.ONLY_LOGIC) {
			// no code
		} else {
			this.removeSprites();
			if (SG2DConsts.DRAW_BODY_LINES) SG2DDebugging.undrawSG2DBodyLines(this);
		}
		
		for (var cluster of this.clusters) {
			cluster.tiles.delete(this);
			cluster.bodies.delete(this);
		}
		this.clusters.clear();
		SG2DClusters.tiles[this.properties.id] = null;
		SG2DClusters.tilesset.delete(this);
		super.destroy();
	}
}

SG2DTile.typeProperties = { // overriden with Object.assign(...)
	texture: SGModel.TYPE_STRING,
	position: SGModel.TYPE_OBJECT_NUMBERS,
	angle: SGModel.TYPE_NUMBER,
	anchor: SGModel.TYPE_VECTOR,
	scale: SGModel.TYPE_VECTOR,
	alpha: SGModel.TYPE_NUMBER,
	visible: SGModel.TYPE_BOOLEAN,
	zindex: SGModel.TYPE_NUMBER,
	cxy: SGModel.TYPE_OBJECT_NUMBERS
};

/**
 * Слой, в котором идёт отрисовка основного спрайта. Если равно undefined, используется слой по умолчанию (PIXI.Container).
 * @type {string}
 */
SG2DTile.layer = void 0;

/**
 * Текстура основного спрайта.
 * @type {string}
 * @example
// Пример описания простейшего тайла, где будет только один спрайт (основной), задействована только одна текстура и не будет анимаций
export class BlockSteel extends SG2D.TileBody {
	static texture = "elements/block-steel";
	static layer = "bodies";
	static zindex = 20;
}

// Пример описание тайла, где будет один спрайт (основной), но текстура задаётся при инициализации
export class Tree extends SG2D.Tile {
	static texture = "elements/trees/tree_";
	static layer = "trees";
	static zindex = 20;
	initialize(...args) {
		super.initialize(...args);
		let n = Math.floor(1 + Math.random() * 41);
		this.set("texture", Tree.texture + (n<10?"0":"") + n);
	}
}
 */
SG2DTile.texture = SG2DConsts.TILE_OVERRIDE; // overriden 

/**
 * Угол поворота основного спрайта.
 * @type {number} */
SG2DTile.angle = 0;

/**
 * Смещение основного спрайта.
 * @type {number} */
SG2DTile.anchor = 0.5;

/**
 * Масштабирование основного спрайта.
 * @type {number} */
SG2DTile.scale = 1;

/**
 * Прозрачность основного спрайта.
 * @type {number} */
SG2DTile.alpha = 1;

/**
 * Видимость основного спрайта.
 * @type {boolean} */
SG2DTile.visible = true;

/**
 * Основной z-index добавляется к z-index спрайтов, кроме спрайта с именем = "main"
 * @type {number}
 */
SG2DTile.zindex = 0;

/**
 * Конфиг спрайта в тайле.
* @typedef SG2D.Tile.SpriteConfig
* @type {object}
* @property {string} texture
* @property {(number|object)} [anchor=0.5]
* @property {number} [angle=0] - В градусах
* @property {(number|object)} [scale=1]
* @property {number} [zindex=0]
* @property {boolean} [visible=true]
* @property {string} [layer] - Код слоя
* @property {SG2D.Tile.AnimationConfig} [animation]
* @property {number} [setter_flag=0] - Флаг. Если задано SG2D.Tile.FLAG_ONLY_OPTIONS_SPRITE, то нужно передавать в options код или сам объект спрайта, например: this.set("angle", a, { sprite: this.sprites.smoke_shot });
*/

/**
 * Конфиг анимации для спрайта.
* @typedef SG2D.Tile.AnimationConfig
* @type {object}
* @property {string} basetexture
* @property {number} [start=1]
* @property {number} count
* @property {number} [sleep=1]
* @property {boolean} [running=false]
* @property {boolean} [loop=false]
* @property {function} [onComplete=void 0]
*/

/**
 * Описание спрайтов и анимаций в тайле в виде дерева.
 * @alias SG2D.Tile.sprites
 * @static
 * @type {Object.<string, SG2D.Tile.SpriteConfig>}
 * @example
// Базовый класс для тайлов с lifeband-полоской
export default class ObjectBaseLifeBand extends SG2D.TileBody {
	static layer = "bodies";
	static sprites = {
		lifeband_base: {
			texture: "ui/lifeband_base",
			anchor: { x: 0.5, y: -5 },
			zindex: 10,
			angle: 90,
			layer: "animations",
			setter_flag: SG2D.Tile.FLAG_ONLY_OPTIONS_SPRITE
		},
		lifeband_value: {
			textures: { friend: "ui/lifeband_green", enemy: "ui/lifeband_red" },
			texture: "ui/lifeband_green",
			scale: { x: 1, y: 1 },
			anchor: { x: 0.5, y: -5 },
			zindex: 11,
			angle: 90,
			layer: "animations",
			setter_flag: SG2D.Tile.FLAG_ONLY_OPTIONS_SPRITE
		}
	}
	//...
}

// Базовый класс для игроков
export default class Player extends ObjectBaseLifeBand {
	static sprites = SG2D.Model.defaults({
		platform: {
			texture: "objects/player-platform",
			zindex: 0,
			sprites: {
				turret: {
					texture: "objects/player-turret",
					anchor: { x: 0.15, y: 0.5 },
					zindex: 2,
					sprites: {
						smoke_shot: {
							texture: "objects/player-smoke-shot_1",
							layer: "animations",
							anchor: { x: -3.4, y: 0.5 },
							zindex: 1,
							visible: false,
							animation: {
								count: 6,
								sleep: 3,
								running: false,
								basetexture: "objects/player-smoke-shot_"
							},
							setter_flag: SG2D.Tile.FLAG_ONLY_OPTIONS_SPRITE
						}
					}
				}
			}
		},
		accelerator: {
			texture: "animations/accelerator_1",
			layer: "animations",
			anchor: { x: 2.7, y: 0.45 },
			zindex: 0,
			visible: false,
			animation: {
				count: 3,
				sleep: 3,
				running: false,
				basetexture: "animations/accelerator_"
			}
		},
		track_left: {
			texture: "objects/player-track_1",
			anchor: { x: -4, y: 2.7 },
			zindex: 1,
			animation: {
				count: 8,
				sleep: 2,
				running: false,
				basetexture: "objects/player-track_",
				loop: true
			}
		},
		track_right: {
			texture: "objects/player-track_1",
			anchor: { x: -4, y: -1.6 },
			zindex: 1,
			animation: {
				count: 8,
				sleep: 2,
				running: false,
				basetexture: "objects/player-track_",
				loop: true
			}
		}
	}, ObjectBaseLifeBand.sprites);
	//...
 }
 */
let SG2DTile_sprites = {};

/**
 * Описание анимации для основного спрайта
 * @alias SG2D.Tile.animation
 * @static
 * @type {SG2D.Tile.AnimationConfig}
 * @example
// Пример описания анимации для основного спрайта
export class Medikit extends SG2D.Tile {
	static texture = "objects/medikit100_1";
	static layer = "bodies";
	static animation = {
		count: 8,
		sleep: 3,
		running: false,
		basetexture: "objects/medikit100_",
		onComplete: function(sprite) {
			sprite.visible = true; // После выполнения анимации оставляем её видимой
		},
		loop: false
	};
	
	initialize(...args) {
		super.initialize(...args);
		this.scaleDir = 1;
	}
	
	iterateAnimations(...args) {
		this.set("angle", this.properties.angle + 1);
		this.set("scale", this.properties.scale +0.002 * this.scaleDir);
		if (this.properties.scale <= 0.6) this.scaleDir = 1;
		if (this.properties.scale >= 0.8) this.scaleDir = -1;
		
		if (! this.sprite.animation.running && Math.random() < 0.01) {
			this.startAnimation();
		}
		
		super.iterateAnimations(...args);
	}
}
 */
let SG2DTile_animation = {};

/**
 * @type {boolean}
 * @readonly
 */
SG2DTile.isTile = true;

/** @type {boolean} */
SG2DTile.isBody = false;

/** @type {boolean} */
SG2DTile.noDraw = false;

/**
 * Флаг для игнорирования спрайтом сеттера без указания спрайта в *options.<sprite|sprites>*. Флаг актуален для тайлов состоящих из нескольких спрайтов.
 * Например, для спрайта *this.sprites.platform* сеттер *this.set("angle", 125)* не применится, а *this.set("angle", 125, { sprite: this.sprites.platform })* применится!
 */
SG2DTile.FLAG_ONLY_OPTIONS_SPRITE = true;

// Чтобы обработать щелчок по тайлу, определите этот метод в классе тайла
// SG2DTile.click(target, options) {...}

SG2DTile._initPrevPosition = {x: -1, y: -1};

SG2DTile._point = {x: void 0, y: void 0};

SG2DTile.ownSetters = { // overriden with Object.assign(...)
	position: true,
	angle: true,
	anchor: true,
	scale: true,
	alpha: true,
	visible: true,
	zindex: true,
	texture: true
};

SG2DTile.defaultProperties = {
	id: void 0,
	position: {x: 0, y: 0},
	angle: 0,
	anchor: 0.5,
	scale: 1,
	alpha: 1,
	visible: true,
	zindex: 0,
	layer: void 0,
	cxy: {x: 0, y: 0},
	drawed: false
}

SG2DTile._defaultSpriteValues = {
	angle: 0,
	anchor: 0.5,
	scale: 1,
	alpha: 1,
	visible: true,
	zindex: 0
};

SG2DTile._prepareStaticConfigSprites = function() {

	if (this.hasOwnProperty("_spritesPrepared")) {
		return;
	} else {
		this._spritesPrepared = true;
	}

	if (this.hasOwnProperty("sprites")) {
		this.sprites = this._prepareMultipleSprites(this.sprites);
	} else {
		this.sprites = { main: this._prepareSpriteProperties({ name: "main" }, this) };
	}

	if (this.sprites.main) this.sprite = this.sprites.main;
	if (this.sprite) {
		if (this.animation !== void 0) {
			this.sprite.animation = SGModel.clone(this.animation);
		}
	}

	if (this.zindex !== void 0) {
		SG2DUtils.objectForEach(this.sprites, sprite=>{
			if (sprite.name !== "main") {
				sprite.zindex += this.zindex;
			}
		});
	}
}

SG2DTile. _prepareMultipleSprites = function(sprites, parentSprite = void 0) {
	for (var name in sprites) {
		const sprite = sprites[name];
		sprite.name = name;
		if (parentSprite) {
			sprite.parent = parentSprite.name;
			sprite.setter_flag = SG2DTile.FLAG_ONLY_OPTIONS_SPRITE;
		}
		this._prepareSpriteProperties(sprite);
		if (sprite.sprites) {
			sprites = {...sprites, ...this._prepareMultipleSprites(sprite.sprites, sprite)};
		}
	}
	return sprites;
}

SG2DTile._prepareSpriteProperties = function(dest, src = void 0) {
	if (! src) src = dest;
	dest.texture = typeof src.texture !== void 0 ? src.texture : SG2DConsts.TILE_OVERRIDE;
	for (var p in SG2DTile._defaultSpriteValues) {
		dest[p] = SG2DUtils.ifUndefined(src[p], SG2DTile._defaultSpriteValues[p]);
	}
	dest.layer = src.layer || this.layer;
	return dest;
}

SG2DTile._textures_not_founded = [];

SG2DTile._spritesFromOptions = new Set();

export default SG2DTile;