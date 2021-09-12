"use strict";

import SGModel from './libs/sg-model/sg-model.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DUtils from './sg2d-utils.js';
import SG2DMath from "./sg2d-math.js";
import SG2DCamera from './sg2d-camera.js';

/**
 * Класс для управления указателем (мышь, тачпад)
 * @TODO To prevent the browser from creating a new request every time you change cursor url, you need to display cursor using PixiJS
 * @alias SG2D.Pointer
 */
class SG2DPointer extends SGModel {
	
	initialize(properties, thisProps, options) {
		
		// passed to thisProps: { sg2d: this }
		
		//this.camera = this.sg2d.camera;
		
		if (! SG2DPointer._newPosition) SG2DPointer._newPosition = new PIXI.Point();
		
		this.identifiers = [];
		for (var i = 0; i < SG2DPointer._maxIdentifiers; i++) {
			this.identifiers[i] = {
				target: { cluster: void 0, tile: void 0, sprite: void 0, pxy: this.properties.pxy, cxy: this.properties.cxy, pxy_local: {x: void 0, y: void 0} },
				options: { type: void 0, button: void 0 }
			}
		}
		
		this.on("pxy", ()=>{
			this.set("cxy", [Math.floor( 1 + this.properties.pxy.x / SG2DConsts.CELLSIZEPIX ), Math.floor( 1 + this.properties.pxy.y / SG2DConsts.CELLSIZEPIX )]);
		});
	}
	
	/** @private */
	_sg2dconnect(sg2d) {
		
		this.sg2d = sg2d;
		this.camera = this.sg2d.camera;
		
		this.properties.global = this.sg2d.pixi.renderer.plugins.interaction.mouse.global;
		
		this.sg2d.viewport.interactive = true;
		
		this.sg2d.viewport.on("pointerdown", this.pointerdown.bind(this));
		this.sg2d.viewport.on("pointerup", this.pointerup.bind(this));
		this.sg2d.viewport.on("pointermove", this.pointermove.bind(this));
		//this.sg2d.viewport.on("pointerover", this.pointerover.bind(this));
		//this.sg2d.canvas.addEventListener("pointerup", (e)=>{ debugger; });
		
		this.cursors = {}; // { default: "", hover: "", move: "", /*...*/}; // cursor icons
		for (var p in this.properties.cursors) {
			var s = this.properties.cursors[p];
			this.cursors[p] = s;
			this.sg2d.pixi.renderer.plugins.interaction.cursorStyles[p] = s;
		}
		this.properties.cursors;
		
		this.tCursorUpdater = setInterval(()=>{
			this.set("cursor", this.sg2d.pixi.renderer.plugins.interaction.currentCursorMode);
		}, 100);
	}
	
	/*getTileByPXY(pxy, bClick) {
		SG2DPointer._target.cluster = this.sg2d.clusters.getCluster(pxy.x, pxy.y);
		SG2DPointer._target.tile = null;
		SG2DPointer._target.sprite = null;
		SG2DPointer._target.pxy_local.x = void 0;
		SG2DPointer._target.pxy_local.y = void 0;
		for (var tile of SG2DPointer._target.cluster.bodies) {
			if (bClick && ! tile.click) continue;
			for (var sprite of tile.sprites) {
				//var mousePos = e.data.getLocalPosition(sprite);
				var mousePos = this.sg2d.pixi.renderer.plugins.interaction.mouse.getLocalPosition(sprite);
				if (sprite.getLocalBounds().contains(mousePos.x, mousePos.y)) {
					if (! SG2DPointer._target.sprite || SG2DPointer._target.sprite.zIndex > sprite.zIndex) {
						SG2DPointer._target.sprite = sprite;
						SG2DPointer._target.tile = tile;
					}
				}
			}
		}
		return SG2DPointer._target;
	}*/
	
	pointerdown(event) {
		
		if (! this.sg2d.clusters) return;
		if (event.data.identifier >= SG2DPointer._maxIdentifiers) return;
		
		let target = this.identifiers[event.data.identifier].target;
		let options = this.identifiers[event.data.identifier].options;
		
		options.button = event.data.button;
		options.type = event.type;
		
		target.cluster = this.sg2d.clusters.getCluster(this.properties.cxy.x, this.properties.cxy.y);
		target.tile = null;
		target.sprite = null;
		
		if (target.cluster) {
			for (var tile of target.cluster.bodies) {
				SG2DUtils.objectForEach(tile.sprites, sprite=>{
					if (! sprite.pixiSprites) return;
					this.sg2d.pixi.renderer.plugins.interaction.mouse.getLocalPosition(sprite.pixiSprite, target.pxy_local); // or e.data.getLocalPosition(..)
					if (sprite.getLocalBounds().contains(target.pxy_local.x, target.pxy_local.y)) {
						if (! target.sprite.pixiSprite || target.sprite.pixiSprite.zIndex > sprite.pixiSprite.zIndex) {
							target.sprite = sprite;
							target.tile = tile;
						}
					}
				});
			}
		}
		
		if (this.camera.properties.movement_by_pointer) {
			if (this.camera.properties.movement_state === SG2DCamera.STATE_NO_MOVEMENT) {
				if (
					(options.button === 0 && (this.camera.properties.movement_by_pointer & SG2DCamera.MOVEMENT_BY_POINTER_LEFT)) ||
					(options.button === 2 && (this.camera.properties.movement_by_pointer & SG2DCamera.MOVEMENT_BY_POINTER_RIGHT)) ||
					(options.button === 1 && (this.camera.properties.movement_by_pointer & SG2DCamera.MOVEMENT_BY_POINTER_MIDDLE))
				) {
					SG2DPointer._startPoint.x = SG2DPointer._newPosition.x;
					SG2DPointer._startPoint.y = SG2DPointer._newPosition.y;
					this.camera.set("movement_state", SG2DCamera.STATE_MOVEMENT_WAITING_SHIFT);
				}
			}
		}
	}
	
	pointermove(e) {
		if (this.camera.properties.movement_by_pointer) {
			if (this.camera.properties.movement_state === SG2DCamera.STATE_MOVEMENT_WAITING_SHIFT) {
				this.sg2d.viewport.cursor = "move";
				let d = SG2DMath.distance_p(SG2DPointer._startPoint, SG2DPointer._newPosition);
				if (d >= SG2DPointer.CAMERA_MOVEMENT_SHIFT) {
					SG2DPointer._startPoint.x =  this.properties.global.x;
					SG2DPointer._startPoint.y =  this.properties.global.y;
					SG2DPointer._startPointPXY.x = this.camera.properties.offset.x;
					SG2DPointer._startPointPXY.y = this.camera.properties.offset.y;
					this.camera.set("movement_state", SG2DCamera.STATE_MOVING);
				}
			} else if (this.camera.properties.movement_state === SG2DCamera.STATE_MOVING) {
				let k = this.camera.scales_k[this.camera.properties.scale];
				let dx = (this.properties.global.x - SG2DPointer._startPoint.x) / k;
				let dy = (this.properties.global.y - SG2DPointer._startPoint.y) / k;
				let rotate = this.camera.properties.rotate - this.camera.rotate_adjustment;
				SG2DPointer._position.x = SG2DPointer._startPointPXY.x - dx * SG2DMath.cos(rotate, 1) + dy * SG2DMath.sin(rotate, 1);
				SG2DPointer._position.y = SG2DPointer._startPointPXY.y - dy * SG2DMath.cos(rotate, 1) - dx * SG2DMath.sin(rotate, 1);
				this.camera.set("offset", SG2DPointer._position, SGModel.OPTIONS_PRECISION_5);
			}
		}
	}
	
	pointerup(event) {
		
		if (! this.sg2d.clusters) return;
		if (event.data.identifier >= SG2DPointer._maxIdentifiers) return;
		
		let target = this.identifiers[event.data.identifier].target;
		let options = this.identifiers[event.data.identifier].options;
		
		if (target.tile) {
			if (target.tile.constructor.click) target.tile.constructor.click(target, options);
			if (target.tile.click) target.tile.click(target, options);
		}
		
		if (this.camera.properties.movement_by_pointer) {
			if (this.camera.properties.movement_state) {
				this.sg2d.viewport.cursor = "default";
				let k = this.camera.scales_k[this.camera.properties.scale];
				let dx = (this.properties.global.x - SG2DPointer._startPoint.x) / k;
				let dy = (this.properties.global.y - SG2DPointer._startPoint.y) / k;
				this.camera.set("movement_state", SG2DCamera.STATE_NO_MOVEMENT);
			}
		}
		
		this.pointerclick(target, options);
	}
	
	pointerclick(e) {} // override
	
	iterate() {
		this.sg2d.pixi.renderer.plugins.interaction.mouse.getLocalPosition(this.sg2d.viewport, SG2DPointer._newPosition);
		SG2DPointer._newPosition.x = ~~SG2DPointer._newPosition.x;
		SG2DPointer._newPosition.y = ~~SG2DPointer._newPosition.y;
		this.set("pxy", [SG2DPointer._newPosition.x, SG2DPointer._newPosition.y]);
	}
	
	destroy() {
		this.tCursorUpdater && clearInterval(this.tCursorUpdater);
		super.destroy();
	}
}

SG2DPointer.typeProperties = {
	global: SGModel.TYPE_OBJECT_NUMBERS,
	camera: SGModel.TYPE_OBJECT_NUMBERS,
	pxy: SGModel.TYPE_OBJECT_NUMBERS,
	cxy: SGModel.TYPE_OBJECT_NUMBERS
};

SG2DPointer.POINTER_LEFT = 0;
SG2DPointer.POINTER_MIDDLE = 1;
SG2DPointer.POINTER_RIGHT = 2;

SG2DPointer.CAMERA_MOVEMENT_SHIFT = 10; // pixels

/** @private */
SG2DPointer._newPosition= void 0;

/** @private */
SG2DPointer._maxIdentifiers = 10;

SG2DPointer.defaultProperties = {
	global: void 0, // relative to the screen
	pxy: { x: 0, y: 0 }, // in the coordinates of the game world: PX
	cxy: { x: 0, y: 0 }, // in the coordinates of the game world: Cluster
	cursor: "default" // current cursor
};

/** @private */
SG2DPointer._position = {x: 0, y: 0};

/** @private */
SG2DPointer._startPoint = { x: 0, y: 0 };

/** @private */
SG2DPointer._startPointPXY = { x: 0, y: 0 };

export default SG2DPointer;