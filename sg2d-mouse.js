/**
 * SG2DMouse
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

import SGModel from './libs/sg-model.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DUtils from './sg2d-utils.js';
import SG2DCamera from './sg2d-camera.js';

export default class SG2DMouse extends SGModel {
	
	static typeProperties = {
		global: SGModel.TYPE_OBJECT_NUMBERS,
		camera: SGModel.TYPE_OBJECT_NUMBERS,
		pxy: SGModel.TYPE_OBJECT_NUMBERS,
		cxy: SGModel.TYPE_OBJECT_NUMBERS
	};
	
	static POINTER_LEFT = 0;
	static POINTER_MIDDLE = 1;
	static POINTER_RIGHT = 2;
	
	static CAMERA_MOVEMENT_SHIFT = 10; // pixels
	
	/** @private */
	static _newPosition= void 0;
	
	static target = { cluster: void 0, tile: void 0, sprite: void 0, pxy: void 0, cxy: void 0 }; //, pxy_local: void 0 };
	static options = { type: void 0, button: void 0 };
	
	static defaultProperties = {
		global: void 0, // relative to the screen
		pxy: { x: 0, y: 0 }, // in the coordinates of the game world: PX
		cxy: { x: 0, y: 0 }, // in the coordinates of the game world: Cluster
		cursors: { default: "", hover: "", move: "", /*...*/} // cursor icons
	}
	
	initialize(properties, thisProps, options) {
		
		// passed to thisProps: { sg2d: this }
		
		this.camera = this.sg2d.camera;
		
		if (! SG2DMouse._newPosition) SG2DMouse._newPosition = new PIXI.Point();
		
		this.target = this.constructor.target;
		this.options = this.constructor.options;
		
		this.on("pxy", ()=>{
			this.set("cxy", [Math.floor( 1 + this.properties.pxy.x / SG2DConsts.CELLSIZEPIX ), Math.floor( 1 + this.properties.pxy.y / SG2DConsts.CELLSIZEPIX )]);
		});
		
		this.target.pxy = this.properties.pxy;
		this.target.cxy = this.properties.cxy;
		this.target.pxy_local = {x: void 0, y: void 0};
	}
	
	/** private */
	_sg2dconnect(sg2d) {
		
		this.sg2d = sg2d;
		
		this.properties.global = this.sg2d.pixi.renderer.plugins.interaction.mouse.global;
		
		this.sg2d.viewport.interactive = true;
		
		this.sg2d.viewport.on("pointerdown", this.pointerdown.bind(this));
		this.sg2d.viewport.on("pointerup", this.pointerup.bind(this));
		this.sg2d.viewport.on("mousemove", this.pointermove.bind(this));
		//this.sg2d.viewport.on("mouseover", this.mouseover.bind(this));
		//this.sg2d.canvas.addEventListener("mouseup", (e)=>{ debugger; });
		
		// Css style for icons
		for (var p in this.properties.cursors) {
			var s = this.properties.cursors[p];
			if (s) {
				this.sg2d.pixi.renderer.plugins.interaction.cursorStyles[p] = s;
			}
		}
	}
	
	/*getTileByPXY(pxy, bClick) {
		SG2DMouse._target.cluster = this.sg2d.clusters.getCluster(pxy.x, pxy.y);
		SG2DMouse._target.tile = null;
		SG2DMouse._target.sprite = null;
		SG2DMouse._target.pxy_local.x = void 0;
		SG2DMouse._target.pxy_local.y = void 0;
		for (var tile of SG2DMouse._target.cluster.bodies) {
			if (bClick && ! tile.click) continue;
			for (var sprite of tile.sprites) {
				//var mousePos = e.data.getLocalPosition(sprite);
				var mousePos = this.sg2d.pixi.renderer.plugins.interaction.mouse.getLocalPosition(sprite);
				if (sprite.getLocalBounds().contains(mousePos.x, mousePos.y)) {
					if (! SG2DMouse._target.sprite || SG2DMouse._target.sprite.zIndex > sprite.zIndex) {
						SG2DMouse._target.sprite = sprite;
						SG2DMouse._target.tile = tile;
					}
				}
			}
		}
		return SG2DMouse._target;
	}*/
	
	/** @private */
	static _startPointMouse = { x: 0, y: 0 };
	
	/** @private */
	static _startPointPXY = { x: 0, y: 0 };
	
	pointerdown(e) {
		
		if (! this.sg2d.clusters) return;
		
		let target = this.target;
		let options = this.options;
		
		options.button = e.data.button;
		options.type = e.type;
		
		target.cluster = this.sg2d.clusters.getCluster(this.properties.cxy.x, this.properties.cxy.y);
		target.tile = null;
		target.sprite = null;
		//target.pxy_local.x = void 0;
		//target.pxy_local.y = void 0;
		
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
					SG2DMouse._startPointMouse.x = SG2DMouse._newPosition.x;
					SG2DMouse._startPointMouse.y = SG2DMouse._newPosition.y;
					this.camera.set("movement_state", SG2DCamera.STATE_MOVEMENT_WAITING_SHIFT);
				}
			}
		}
	}
	
	static _position = {x: 0, y: 0};
	
	pointermove(e) {
		if (this.camera.properties.movement_by_pointer) {
			if (this.camera.properties.movement_state === SG2DCamera.STATE_MOVEMENT_WAITING_SHIFT) {
				this.sg2d.viewport.cursor = "move";
				let d = SG2DMath.distance_p(SG2DMouse._startPointMouse, SG2DMouse._newPosition);
				if (d >= SG2DMouse.CAMERA_MOVEMENT_SHIFT) {
					SG2DMouse._startPointMouse.x =  this.properties.global.x;
					SG2DMouse._startPointMouse.y =  this.properties.global.y;
					SG2DMouse._startPointPXY.x = this.camera.properties.offset.x;
					SG2DMouse._startPointPXY.y = this.camera.properties.offset.y;
					this.camera.set("movement_state", SG2DCamera.STATE_MOVING);
				}
			} else if (this.camera.properties.movement_state === SG2DCamera.STATE_MOVING) {
				let k = this.camera.scales_k[this.camera.properties.scale];
				let dx = (this.properties.global.x - SG2DMouse._startPointMouse.x) / k;
				let dy = (this.properties.global.y - SG2DMouse._startPointMouse.y) / k;
				let rotate = this.camera.properties.rotate - this.camera.rotate_adjustment;
				SG2DMouse._position.x = SG2DMouse._startPointPXY.x - dx * SG2DMath.cos(rotate, 1) + dy * SG2DMath.sin(rotate, 1);
				SG2DMouse._position.y = SG2DMouse._startPointPXY.y - dy * SG2DMath.cos(rotate, 1) - dx * SG2DMath.sin(rotate, 1);
				this.camera.set("offset", SG2DMouse._position, SGModel.OPTIONS_PRECISION_5);
			}
		}
	}
	
	pointerup(e) {
		
		if (! this.sg2d.clusters) return;
		
		let target = this.target;
		let options = this.options;
		
		if (target.tile) {
			if (target.tile.constructor.click) target.tile.constructor.click(target, options);
			if (target.tile.click) target.tile.click(target, options);
		}
		
		if (this.camera.properties.movement_by_pointer) {
			if (this.camera.properties.movement_state) {
				this.sg2d.viewport.cursor = "default";
				let k = this.camera.scales_k[this.camera.properties.scale];
				let dx = (this.properties.global.x - SG2DMouse._startPointMouse.x) / k;
				let dy = (this.properties.global.y - SG2DMouse._startPointMouse.y) / k;
				this.camera.set("movement_state", SG2DCamera.STATE_NO_MOVEMENT);
			}
		}
		
		this.pointerclick(target, options);
	}
	
	pointerclick(e) {} // override
	
	iterate() {
		this.sg2d.pixi.renderer.plugins.interaction.mouse.getLocalPosition(this.sg2d.viewport, SG2DMouse._newPosition);
		SG2DMouse._newPosition.x = ~~SG2DMouse._newPosition.x;
		SG2DMouse._newPosition.y = ~~SG2DMouse._newPosition.y;
		this.set("pxy", [SG2DMouse._newPosition.x, SG2DMouse._newPosition.y]);
	}
}

if (typeof window !== "undefined") window.SG2DMouse = SG2DMouse;
if (typeof _root === "object") _root.SG2DMouse = SG2DMouse;