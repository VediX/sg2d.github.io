/**
 * SG2DCamera
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

import SGModel from './libs/sg-model.js';
import SG2D from './sg2d.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DMath from './sg2d-math.js';
import SG2DDebugging from './sg2d-debugging.js';

export default class SG2DCamera extends SGModel {
		
	static singleInstance = true;
	
	static ROTATE_ADJUSTMENT = 0; // default
	
	static SCALE_MIN = 2;
	static SCALE_NORMAL = 8;
	static SCALE_MAX = 10;
	
	static MOVEMENT_BY_POINTER = 0b00000001;
	static MOVEMENT_BY_POINTER_LEFT = 0b00000001;
	static MOVEMENT_BY_POINTER_RIGHT = 0b00000010;
	static MOVEMENT_BY_POINTER_MIDDLE = 0b00000100;
	
	static STATE_NO_MOVEMENT = 0;
	static STATE_MOVEMENT_WAITING_SHIFT = 1;
	static STATE_MOVING = 2;
	
	/**
	 * Camera smoothness factor
	 * @public
	 */
	static SMOOTHNESS_FACTOR = 0.25;
	
	static typeProperties = {
		rotate: SGModel.TYPE_NUMBER,
		rotation: SGModel.TYPE_BOOLEAN,
		position: SGModel.TYPE_OBJECT_NUMBERS,
		target: SGModel.TYPE_OBJECT_NUMBERS,
		offset: SGModel.TYPE_OBJECT_NUMBERS,
		wh: SGModel.TYPE_OBJECT_NUMBERS,
		wh05: SGModel.TYPE_OBJECT_NUMBERS,
		boundsPX: SGModel.TYPE_OBJECT_NUMBERS,
		boundsCluster: SGModel.TYPE_OBJECT_NUMBERS
	};
	
	static ownSetters = {
		rotate: true,
		position: true
	};
	
	/** @public */
	static moveTo(...args) {
		SG2DCamera.getInstance().moveTo.apply(SG2DCamera.getInstance(), ...args);
	}
	
	static scaling(params) {
		if (SG2DCamera.getInstance().properties.scale_wheel) {
			SG2DCamera.getInstance().onWheelScale({deltaY: params.action === "-" ? 1 : -1});
		}
	}
	
	/** @private */
	static _point = {x: void 0, y: void 0};
	
	defaults() {
		return {
			scale: SG2DCamera.SCALE_NORMAL, // Scaling, for example: 16 -> 128px (200%), ..., 9 -> 72px (112%),  8 -> 64px (100%), 7 -> 56px, 6 -> 48px, 5 -> 40px, 4 -> 32px, 3 -> 24px, 2 -> 16px, 1-> 8px (12.5%)
			rotation: false,
			rotate: 0, // grad
			position: {x: 0, y: 0}, // current camera position
			target: {x: 0, y: 0}, // camera movement target
			offset: {x: 0, y: 0},
			wh: {w: 0, h: 0},
			wh05: {w: 0, h: 0},
			boundsPX: { left: 0, top: 0, right: 0, bottom: 0 },
			boundsCluster: { left: 0, top: 0, right: 0, bottom: 0 },
			frameCVC: 0, // frameChangeVisibleClusters - Changing this property means that some new clusters have appeared in the camera view, or some have disappeared
			scale_wheel: true, // scale with scrolling
			scale_min: SG2DCamera.SCALE_MIN,
			scale_max: SG2DCamera.SCALE_MAX,
			mouse_over_canvas: true,
			movement_by_pointer: 0,
			movement_state: 0
		};
	}
	
	/**
	 * Config parameters and default values:
	 * @param {object} properties
	 * @param {boolean}	[properties.scale_wheel=true] Allow camera zoom
	 * @param {number}		[scale=8] Start scale
	 * @param {boolean}	[rotation=true] Allow camera rotation
	 * @param {number}		[rotate=0] Start camera rotation
	 * @param {object}		[start_position={ x: 0, y: 0}] Start position
	 * @param {number}		[rotate_adjustment=0] Basic offset of the camera angle in degrees
	 * @param {boolean}	[movement_by_pointer=0] Allow free movement of the camera with the right mouse button
	 */
	initialize(properties) {
		
		let config = properties || {};
		config.scale_wheel = typeof config.scale_wheel !== "undefined" ? config.scale_wheel : true;
		config.scale = +config.scale || SG2DCamera.SCALE_NORMAL;
		config.rotation = !!config.rotation || false;
		config.rotate = +config.rotate || 0;
		config.position = config.position || null;
		config.rotate_adjustment = +config.rotate_adjustment || SG2DCamera.ROTATE_ADJUSTMENT;
		config.movement_by_pointer = +config.movement_by_pointer;
		
		this.rotate_adjustment = config.rotate_adjustment;
		this.browser_scale_start = window.devicePixelRatio ? window.devicePixelRatio : window.outerWidth/window.innerWidth;
		this.set("scale_min", +config.scale_min || SG2DCamera.SCALE_MIN);
		this.set("scale_max", +config.scale_max || SG2DCamera.SCALE_MAX);
		
		this.scales_k = [];
		this.scales_per = [];
		var k = 1, p = 100, k_step = 1.00;
		for (var i = SG2DCamera.SCALE_NORMAL; i <= this.properties.scale_max; i++) {
			this.scales_k[i] = k;
			this.scales_per[i] = ~~p;
			k += 0.125 * k_step;
			p += 12.5 * k_step;
		}
		var k = 1, p = 100;
		for (var i = SG2DCamera.SCALE_NORMAL; i >= this.properties.scale_min; i--) {
			this.scales_k[i] = k;
			this.scales_per[i] = ~~p;
			k -= 0.125 * k_step;
			p -= 12.5 * k_step;
		}
		
		this.positionPrev = {
			x: this.properties.position.x,
			y: this.properties.position.y
		};
		this.frame_lighting = 1;
		this.boundsClusterPrev = null;
		this.clustersInCamera = new Set();
		
		// Visible part of the area in PX units
		this.boundsPXTops = { // The vertices of the rectangle are calculated with camera rotation and scaling
			leftTop: {x:0,y:0},
			rightTop: {x:0,y:0},
			rightBottom: {x:0,y:0},
			leftBottom: {x:0,y:0}
		};
		// Visible part of the area in Cells units
		this.boundsClusterTops = { // The vertices of the rectangle are calculated with camera rotation and scaling
			leftTop: {x:0,y:0},
			rightTop: {x:0,y:0},
			rightBottom: {x:0,y:0},
			leftBottom: {x:0,y:0}
		};
		
		this.clustersOut = []; // Clusters that disappeared from the camera view
		this.clustersIn = []; // Clusters that appeared in the camera view
		
		this._addLinePoint = this._addLinePoint.bind(this);
		
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		
		this.onWheelScale = this.onWheelScale.bind(this);
		if (this.properties.scale_wheel) {
			this._onwheel(this.onWheelScale);
		}
		
		// Boundaries of the visible part in Cells units (all points of 4 solid lines formed by boundsCluster vertices)
		this.boundsPoint = [];
		this.on("wh", (wh)=>{
			var q = ~~((wh.w + wh.h) / SG2DConsts.CELLSIZEPIX * 4);
			for (var i = 0; i < q; i++) this.boundsPoint[i] = {x: 0, y: 0}; // so as not to spawn objects every time!
		});
		
		this.set("scale_wheel", config.scale_wheel);
		this.set("scale", config.scale);
		this.set("rotation", config.rotation);
		
		this.on("frameCVC", SG2DDebugging.drawDebug2);
		
		this.set("movement_by_pointer", config.movement_by_pointer);
		
		this._followToTile = null;
	}
	
	/** private */
	_sg2dconnect(sg2d) {
		this.sg2d = sg2d;
		this.onResize();
		this.sg2d.pixi.view.addEventListener("mouseenter", this.onMouseEnter);
		this.sg2d.pixi.view.addEventListener("mouseleave", this.onMouseLeave);
		this.set("rotate", this.properties.rotate);
		this.sg2d.viewport.angle = -this.properties.rotate + this.rotate_adjustment;
		this.startPosition(this.properties.position || null);
		this._calc();
	}
	
	/** Own setter for rotate property*/
	setRotate(newRotate, options, flags = 0) {
		if (! this.properties.rotation && ! (flags & SGModel.FLAG_FORCE_CALLBACKS)) return; //?
		newRotate = SG2DMath.normalize_a(newRotate);
		let prevRotate = this.properties.rotate;
		if (this.set("rotate", newRotate, options, flags | SGModel.FLAG_IGNORE_OWN_SETTER)) {
			this.sg2d.viewport.angle = -this.properties.rotate + this.rotate_adjustment;
			let da = SG2DMath.normalize_a(newRotate - prevRotate);
			let dx = this.properties.offset.x;
			let dy = this.properties.offset.y;
			SG2DCamera._point.x = dx * SG2DMath.cos(da, 1) - dy * SG2DMath.sin(da, 1);
			SG2DCamera._point.y = dy * SG2DMath.cos(da, 1) + dx * SG2DMath.sin(da, 1);
			this.set("offset", SG2DCamera._point);
			this._calc();
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Set the starting position of the camera
	 */
	startPosition(position) {
		this.moveTo(position, true);
	}
	
	/** @private */
	static _boundsPX = {};
	
	/** @private */
	static _boundsCluster = {};
	
	/** Own setter for position property*/
	setPosition(value, options = SGModel.OBJECT_EMPTY, flags = 0) {
		value = value || this.positionPrev;
		options = ! options ||  options === SGModel.OBJECT_EMPTY ? SGModel.OPTIONS_PRECISION_5 : options;
		options.precision = options.precision || 5;
		
		if (! this.set("position", value, options, flags | SGModel.FLAG_IGNORE_OWN_SETTER)) return false;
		
		this._calc();
		
		return true;
	}
	
	/** @private */
	_calc() {
		
		this.sg2d.viewport.x = this.sg2d.pixi.screen.width / 2;
		this.sg2d.viewport.y = this.sg2d.pixi.screen.height / 2;
		this.sg2d.viewport.pivot.x = this.properties.position.x;
		this.sg2d.viewport.pivot.y = this.properties.position.y;
		
		var x = this.properties.position.x
		var y = this.properties.position.y
		var acos = SG2DMath.cos(this.properties.rotate, 1), asin = SG2DMath.sin(this.properties.rotate, 1);
		var w05 = this.properties.wh05.w * SG2DConsts.DEBUGGING.CAMERA.WIDTH_HEIGHT_K;
		var h05 = this.properties.wh05.h * SG2DConsts.DEBUGGING.CAMERA.WIDTH_HEIGHT_K;
		var bpx = this.boundsPXTops;
		var bc = this.boundsClusterTops;
		
		// boundsPXTops calc
		bpx.leftTop.x = Math.round(x - w05 * acos + h05 * asin);
		bpx.leftTop.y = Math.round(y - w05 * asin - h05 * acos);
		bpx.rightTop.x = Math.round(x + w05 * acos + h05 * asin);
		bpx.rightTop.y = Math.round(y + w05 * asin - h05 * acos);
		bpx.rightBottom.x = Math.round(x + w05 * acos - h05 * asin);
		bpx.rightBottom.y = Math.round(y + w05 * asin + h05 * acos);
		bpx.leftBottom.x = Math.round(x - w05 * acos - h05 * asin);
		bpx.leftBottom.y = Math.round(y - w05 * asin + h05 * acos);
		
		// boundsPX calc
		var boundsPX = SG2DCamera._boundsPX;
		boundsPX.left = boundsPX.top = boundsPX.right = boundsPX.bottom = void 0;
		for (var p in bpx) {
			var o = bpx[p];
			if (boundsPX.left === void 0) boundsPX.left = o.x; else if (boundsPX.left > o.x) boundsPX.left = o.x;
			if (boundsPX.top === void 0) boundsPX.top = o.y; else if (boundsPX.top > o.y) boundsPX.top = o.y;
			if (boundsPX.right === void 0) boundsPX.right = o.x; else if (boundsPX.right < o.x) boundsPX.right = o.x;
			if (boundsPX.bottom === void 0) boundsPX.bottom = o.y; else if (boundsPX.bottom < o.y) boundsPX.bottom = o.y;
		}
		var bChangeBoundsPX = false;
		for (var p in this.properties.boundsPX) {
			if (boundsPX[p] !== this.properties.boundsPX[p]) bChangeBoundsPX = true;
			this.properties.boundsPX[p] = boundsPX[p];
		}
		
		// boundsCluster calc
		var boundsCluster = SG2DCamera._boundsCluster;
		boundsCluster.left = Math.floor( 1 + boundsPX.left / SG2DConsts.CELLSIZEPIX );
		boundsCluster.top = Math.floor( 1 + boundsPX.top / SG2DConsts.CELLSIZEPIX );
		boundsCluster.right = Math.floor( 1 + boundsPX.right / SG2DConsts.CELLSIZEPIX );
		boundsCluster.bottom = Math.floor( 1 + boundsPX.bottom / SG2DConsts.CELLSIZEPIX );
		var bChangeBoundsCluster = false;
		for (var p in boundsCluster) {
			if (boundsCluster[p] !== this.properties.boundsCluster[p]) bChangeBoundsCluster = true;
			this.properties.boundsCluster[p] = boundsCluster[p];
		}
		
		if (! this.boundsClusterPrev) {
			this.boundsClusterPrev = {
				left: this.properties.boundsCluster.left,
				top: this.properties.boundsCluster.top,
				right: this.properties.boundsCluster.right,
				bottom: this.properties.boundsCluster.bottom
			}
		}
		
		// boundsClusterTops calc - step 1
		bc.leftTop.x = 0.5 + bpx.leftTop.x / SG2DConsts.CELLSIZEPIX;
		bc.leftTop.y = 0.5 + bpx.leftTop.y / SG2DConsts.CELLSIZEPIX;
		bc.rightTop.x = 0.5 + bpx.rightTop.x / SG2DConsts.CELLSIZEPIX;
		bc.rightTop.y = 0.5 + bpx.rightTop.y / SG2DConsts.CELLSIZEPIX;
		bc.rightBottom.x = 0.5 + bpx.rightBottom.x / SG2DConsts.CELLSIZEPIX;
		bc.rightBottom.y = 0.5 + bpx.rightBottom.y / SG2DConsts.CELLSIZEPIX;
		bc.leftBottom.x = 0.5 + bpx.leftBottom.x / SG2DConsts.CELLSIZEPIX;
		bc.leftBottom.y = 0.5 + bpx.leftBottom.y / SG2DConsts.CELLSIZEPIX;
		
		// Calc line points
		this.boundsPoint._length = -1;
		SG2DMath.getLinePoints(bc.leftTop, bc.rightTop, this._addLinePoint);
		SG2DMath.getLinePoints(bc.rightTop, bc.rightBottom, this._addLinePoint);
		SG2DMath.getLinePoints(bc.rightBottom, bc.leftBottom, this._addLinePoint);
		SG2DMath.getLinePoints(bc.leftBottom, bc.leftTop, this._addLinePoint);
		this.boundsPoint._length++;
		
		// calculate visible clusters
		var cluster, x ,y, x1, x2, state;
		var frame_lighting_prev = this.frame_lighting++;
		var frame_lighting = this.frame_lighting;
		this.clustersOut.length = 0;
		this.clustersIn.length = 0;

		for (var i = 0; i < this.boundsPoint._length; i++) {
			var p = this.boundsPoint[i];
			if (cluster = this.sg2d.clusters.getCluster(p.x, p.y)) {
				if (cluster.lighting_frame === 0) {
					this.clustersIn.push(cluster);
					this.clustersInCamera.add(cluster);
				}
				cluster.lighting_frame = frame_lighting;
			}
		}
		
		var x_min = Math.min(this.boundsClusterPrev.left, this.properties.boundsCluster.left);
		var y_min = Math.min(this.boundsClusterPrev.top, this.properties.boundsCluster.top);
		var x_max = Math.max(this.boundsClusterPrev.right, this.properties.boundsCluster.right);
		var y_max = Math.max(this.boundsClusterPrev.bottom, this.properties.boundsCluster.bottom);
		
		for (y = y_min; y <= y_max; y++) {
			state = 0;
			x1 = 0;
			x2 = 0;
			for (x = x_min; x <= x_max; x++) {
				if (cluster = this.sg2d.clusters.getCluster(x, y)) {
					switch (state) {
						case 0: { // Finding the first cluster with frame_lighting
							switch (cluster.lighting_frame) {
								case 0: break;
								case frame_lighting_prev: {
									this.clustersOut.push(cluster);
									this.clustersInCamera.delete(cluster);
									cluster.lighting_frame = 0;
									break;
								}
								case frame_lighting: {
									state = 1;
									x1 = x;
									x2 = x1;
									break;
								}
								default:
									debugger; throw "Error!";
							}
							break;
						}
						case 1: { // Finding the last cluster with frame lighting
							switch (cluster.lighting_frame) {
								case 0: case frame_lighting_prev: {
									break;
								}
								case frame_lighting: {
									x2 = x;
									break;
								}
								default: 
									console.log("cluster.lighting_frame=" + cluster.lighting_frame);
									debugger; throw "Error!";
							}
							break;
						}
					}
				}
			}
			if (x1 && x2) {
				for (var x = x1; x <= x2; x++) {
					if (cluster = this.sg2d.clusters.getCluster(x, y)) {
						if (cluster.lighting_frame === 0) {
							this.clustersIn.push(cluster);
							this.clustersInCamera.add(cluster);
						}
						cluster.lighting_frame = frame_lighting;
					}
				}
				for (var x = x2 + 1; x <= x_max; x++) {
					if (cluster = this.sg2d.clusters.getCluster(x, y)) {
						if (cluster.lighting_frame === frame_lighting_prev) {
							this.clustersOut.push(cluster);
							this.clustersInCamera.delete(cluster);
						} //else break; // if left, sometimes the error in state=1 => cluster.lighting_frame is older than it could be!
						cluster.lighting_frame = 0;
					}
				}
			}
		}
		if (this.clustersOut.length || this.clustersIn.length) {
			this.set("frameCVC", this.properties.frameCVC+1);
			for (var i = 0; i < this.clustersOut.length; i++) {
				this.clustersOut[i].outCamera();
			}
			for (var i = 0; i < this.clustersIn.length; i++) {
				this.clustersIn[i].inCamera();
			}
		}
		
		// boundsClusterTops calc - step 2
		for (var p in bc) {
			bc[p].x = Math.floor(0.5 + bc[p].x);
			bc[p].y = Math.floor(0.5 + bc[p].y);
		}
		
		SG2DDebugging.drawDebug();
		
		this.positionPrev.x = this.properties.position.x;
		this.positionPrev.y = this.properties.position.y;
		
		this.boundsClusterPrev.left = this.properties.boundsCluster.left;
		this.boundsClusterPrev.top = this.properties.boundsCluster.top;
		this.boundsClusterPrev.right = this.properties.boundsCluster.right;
		this.boundsClusterPrev.bottom = this.properties.boundsCluster.bottom;
		
		if (bChangeBoundsPX) this.trigger("boundsPX");
		if (bChangeBoundsCluster) this.trigger("boundsCluster");
	}
	
	/** @private */
	static _moveToTarget = {x: 0, y: 0};
	
	/**
	 * Tile that the camera will follow
	 */
	followTo(tile) {
		this._followToTile = tile;
	}
	
	stopFollow() {
		this._followToTile = null;
	}
	
	getFollow() {
		return this._followToTile;
	}
	
	/**
	 * Smoothly move the camera to position
	 * @param {object|number, number} point
	 * @param {boolean} [flag=false] Move instantly (true) or smoothly (false)
	 */
	moveTo(...args) {
		if (typeof arguments[0] === "object") {
			this.set("target", arguments[0], SGModel.OPTIONS_PRECISION_5);
			if (arguments[1] === true) {
				this.set("position", arguments[0], SGModel.OPTIONS_PRECISION_5);
			}
		} else {
			SG2DCamera._moveToTarget.x = arguments[0];
			SG2DCamera._moveToTarget.y = arguments[1];
			this.set("target", SG2DCamera._moveToTarget, SGModel.OPTIONS_PRECISION_5);
			if (arguments[2] === true) {
				this.set("position", SG2DCamera._moveToTarget, SGModel.OPTIONS_PRECISION_5);
			}
		}
	}
											
	moveOffset(step = SG2DConsts.CELLSIZEPIX, rotate = 0) {
		let k = this.scales_k[this.properties.scale];
		let d = step / k;
		rotate = rotate - this.properties.rotate + this.rotate_adjustment;
		SG2DCamera._point.x = this.properties.offset.x + d * SG2DMath.cos(rotate, 1);
		SG2DCamera._point.y = this.properties.offset.y - d * SG2DMath.sin(rotate, 1);
		this.set("offset", SG2DCamera._point);
	}
	
	onResize() {
		var browser_scale = window.devicePixelRatio ? window.devicePixelRatio : window.outerWidth/window.innerWidth; // ignoring browser scaling
		var k = this.scales_k[this.properties.scale] * this.browser_scale_start / browser_scale;
		this.sg2d.viewport.scale.set(k);
		if (this.rotate_adjustment === 0 || this.rotate_adjustment === 180 || this.rotate_adjustment === -180) {
			this.set("wh", {w: this.sg2d.pixi.screen.width / k, h: this.sg2d.pixi.screen.height / k});
		} else {
			this.set("wh", {w: this.sg2d.pixi.screen.height / k, h: this.sg2d.pixi.screen.width / k});
		}
		this.set("wh05", {w: this.properties.wh.w>>1, h: this.properties.wh.h>>1});
		
		this.set("position", void 0, void 0, SG2DCamera.FLAG_FORCE_CALLBACKS);
	}
	
	/** private */
	_iterate() {
		if (this._followToTile) {
			SG2DCamera._point.x = this._followToTile.properties.position.x + this.properties.offset.x;
			SG2DCamera._point.y = this._followToTile.properties.position.y + this.properties.offset.y;
			this.set("target", SG2DCamera._point);
		}	
		if (this.properties.target.x !== this.properties.position.x || this.properties.target.y !== this.properties.position.y) {
			SG2DCamera._point.x = this.properties.position.x + SG2DCamera.SMOOTHNESS_FACTOR * (this.properties.target.x - this.properties.position.x);
			SG2DCamera._point.y = this.properties.position.y + SG2DCamera.SMOOTHNESS_FACTOR * (this.properties.target.y - this.properties.position.y);
			//SG2DCamera._point.x = this.properties.target.x; SG2DCamera._point.y = this.properties.target.y; // TODO DEL DEBUG
			this.set("position", SG2DCamera._point);
		}
	}
	
	onMouseEnter(e) {
		this.set("mouse_over_canvas", true);
	}
	
	onMouseLeave(e) {
		this.set("mouse_over_canvas", false);
	}
	
	onWheelScale(e) {
		if (! this.properties.mouse_over_canvas) return;
		var delta = e.deltaY || e.detail || e.wheelDelta;
		this.zoomInc(delta < 0 ? 1 : -1);
	}
	
	zoom(scale = SG2DCamera.SCALE_NORMAL) {
		scale = Math.max(this.properties.scale_min, scale);
		scale = Math.min(this.properties.scale_max, scale);
		this.set("scale", scale);
		this.onResize();
	}
	
	zoomInc(scaleIncrement = 1) {
		var scale_next = this.properties.scale + scaleIncrement;
		scale_next = Math.max(this.properties.scale_min, scale_next);
		scale_next = Math.min(this.properties.scale_max, scale_next);
		this.set("scale", scale_next);
		this.onResize();
	}
	
	/** @public */
	getScale() {
		return {
			value: this.properties.scale,
			percent: this.scales_per[this.properties.scale],
			k: this.scales_k[this.properties.scale]
		};
	}
	
	/** @private */
	_addLinePoint(x, y) { // Used in Math.GetLinePoints (..) as a callback
		var p = this.boundsPoint[++this.boundsPoint._length];
		p.x = (x < 1 ? 1 : (x > SG2DConsts.AREASIZE ? SG2DConsts.AREASIZE : x));
		p.y = (y < 1 ? 1 : (y > SG2DConsts.AREASIZE ? SG2DConsts.AREASIZE : y));
	}
	
	_onwheel(fCallback, e) {
		if (! e) e = window;
		if ("onwheel" in document) {
			e.addEventListener("wheel", fCallback); // IE9+, FF17+, Ch31+
		} else if ("onmousewheel" in document) {
			e.addEventListener("mousewheel", fCallback); // obsolete version of the event
		} else {
			e.addEventListener("MozMousePixelScroll", fCallback); // Firefox < 17
		}
	}
	_offwheel(fCallback, e) {
		if (! e) e = window;
		e.removeEventListener("wheel", fCallback);
		e.removeEventListener("onmousewheel", fCallback);
		e.removeEventListener("mousewheel", fCallback);
		e.removeEventListener("MozMousePixelScroll", fCallback);
	}
	
	destroy() {
		this.sg2d.pixi.view.removeEventListener("mouseenter", this.onMouseEnter);
		this.sg2d.pixi.view.removeEventListener("mouseleave", this.onMouseLeave);
		this._offwheel(this.onWheelScale);
		super.destroy();
	}
}

if (typeof window !== "undefined") window.SG2DCamera = SG2DCamera;
if (typeof _root === "object") _root.SG2DCamera = SG2DCamera;