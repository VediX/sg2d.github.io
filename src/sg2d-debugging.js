/**
 * SG2DDebugging
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */

"use strict";

import SG2DApplication from './sg2d-application.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DMath from "./sg2d-math.js";

var SG2DDebugging = {
	drawDebug: function() {
		
		let sg2d = SG2DApplication.getInstance();
		let clusters = sg2d.clusters;
		let camera = sg2d.camera;
		
		// Grid
		if (SG2DConsts.CAMERA.DEBUGGING.SHOW.GRID) {
			if (! this._temp116) {
				this._temp116 = [];
				for (var x = 0; x <= clusters.width; x++) {
					var line = new PIXI.Graphics();
					line.lineStyle(2, 0xffffff).moveTo(x * SG2DConsts.CELLSIZEPIX, 0).lineTo(x * SG2DConsts.CELLSIZEPIX, clusters.height * SG2DConsts.CELLSIZEPIX);
					line.zIndex = 9999;
					this._temp116.push(line);
					sg2d.viewport.addChild(line);
				}
				for (var y = 0; y <= clusters.height; y++) {
					var line = new PIXI.Graphics();
					line.lineStyle(2, 0xffffff).moveTo(0, y * SG2DConsts.CELLSIZEPIX).lineTo(clusters.width * SG2DConsts.CELLSIZEPIX, y * SG2DConsts.CELLSIZEPIX);
					line.zIndex = 9999;
					this._temp116.push(line);
					sg2d.viewport.addChild(line);
				}
			}
		} else {
			if (this._temp116) {
				for (var p in this._temp116) {
					sg2d.viewport.removeChild(this._temp116[p]);
				}
			}
			this._temp116 = void 0;
		}
		
		// bounds cluster line
		if (SG2DConsts.CAMERA.DEBUGGING.SHOW.BOUNDS_PXY) {
			if (this._temp110) sg2d.viewport.removeChild(this._temp110);
			var graphics = this._temp110 = new PIXI.Graphics();
			var bpx = camera.boundsPXTops;
			graphics.moveTo(bpx.leftTop.x, bpx.leftTop.y);
			graphics.lineStyle(3, 0xFFFF00, 1);
			graphics.lineTo(bpx.rightTop.x, bpx.rightTop.y);
			graphics.lineStyle(3, 0xFF0000, 1);
			graphics.lineTo(bpx.rightBottom.x, bpx.rightBottom.y);
			graphics.lineStyle(3, 0x00FF00, 1);
			graphics.lineTo(bpx.leftBottom.x, bpx.leftBottom.y);
			graphics.lineStyle(3, 0x0000FF, 1);
			graphics.lineTo(bpx.leftTop.x, bpx.leftTop.y);
			graphics.endFill();
			graphics.zIndex = 9999;
			sg2d.viewport.addChild(graphics);
		} else {
			if (this._temp110) {
				sg2d.viewport.removeChild(this._temp110);
				this._temp110 = void 0;
			}
		}
		
		// bounds cluster top points
		if (SG2DConsts.CAMERA.DEBUGGING.SHOW.BOUNDS_TOP_CLUSTERS) {
			if (! this._temp111) this._temp111 = {};
			var i = 0; var colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xAA00AA];
			for (var p in camera.boundsClusterTops) {
				var point = camera.boundsClusterTops[p];
				if (! this._temp111[p]) {
					var graphics = this._temp111[p] = new PIXI.Graphics();
					graphics.lineStyle(3, colors[i++], 1);
					graphics.moveTo(0, 0);
					graphics.lineTo(63, 0);
					graphics.lineTo(63, 63);
					graphics.lineTo(0, 63);
					graphics.lineTo(0, 0);
					graphics.endFill();
					graphics.zIndex = 9999;
					sg2d.viewport.addChild(graphics);
				}
				this._temp111[p].position.set(point.x * 64 - 64, point.y * 64 - 64);
			}
		} else {
			if (this._temp111) {
				for (var p in this._temp111) {
					sg2d.viewport.removeChild(this._temp111[p]);
				}
			}
			this._temp111 = void 0;
		}
		
		// bounds cluster line points
		if (SG2DConsts.CAMERA.DEBUGGING.SHOW.CLUSTER_LINE_BOUNDS) {
			if (! this._temp112) this._temp112 = [];
			for (var i = 0; i < this._temp112.length; i++) sg2d.viewport.removeChild(this._temp112[i]);
			this._temp112.length = 0;
			for (var i = 0; i < camera.boundsPoint._length; i++) {
				var graphics = this._temp112[i] = new PIXI.Graphics();
				graphics.lineStyle(2, 0xFFFFFF, 2);
				var point = camera.boundsPoint[i];
				graphics.moveTo(0, 0);
				graphics.lineTo(63, 0);
				graphics.lineTo(63, 63);
				graphics.lineTo(0, 63);
				graphics.lineTo(0, 0);
				graphics.endFill();
				graphics.zIndex = 9998;
				graphics.position.set(point.x * 64 - 64, point.y * 64 - 64);
				sg2d.viewport.addChild(graphics);
			}
		} else {
			if (this._temp112) {
				for (var p in this._temp112) {
					sg2d.viewport.removeChild(this._temp112[p]);
				}
			}
			this._temp112 = void 0;
		}

		// Static coordinate labels along the axes
		// TODO: сделать динамический перерасчет position существующих Text-объектов, что бы координаты всегда были на виду по краям камеры?
		if (SG2DConsts.CAMERA.DEBUGGING.SHOW.AXIS_LABELS) {
			if (! this._temp115) {
				this._temp115 = [];
				for (var x = 1; x <= clusters.width; x++) {
					var cluster = clusters.getCluster(x, 1);
					if (! cluster) continue;
					var text = new PIXI.Text(x, {fontFamily : 'Arial', fontSize: 12, fill : 0xffffff, align : 'center'});
					text.position.x = cluster.position.x;
					text.position.y = cluster.position.y - SG2DConsts.CELLSIZEPIX;
					text.angle = -camera.rotate_adjustment;
					text.zIndex = 9999;
					this._temp115.push(text);
					sg2d.viewport.addChild(text);
				}
				for (var y = 1; y <= clusters.height; y++) {
					var cluster = clusters.getCluster(1, y);
					if (! cluster) continue;
					var text = new PIXI.Text(y, {fontFamily : 'Arial', fontSize: 12, fill : 0xffffff, align : 'center'});
					text.position.x = cluster.position.x - SG2DConsts.CELLSIZEPIX;
					text.position.y = cluster.position.y;
					text.angle = -camera.rotate_adjustment;
					text.zIndex = 9999;
					this._temp115.push(text);
					sg2d.viewport.addChild(text);
				}
			} else {
				var rotate = camera.properties.rotate - camera.rotate_adjustment;
				for (var i = 0; i < this._temp115.length; i++) {
					this._temp115[i].angle = rotate;
				}
			}
		} else {
			if (this._temp115) {
				for (var p in this._temp115) {
					sg2d.viewport.removeChild(this._temp115[p]);
				}
			}
			this._temp115 = void 0;
		}
	},
	
	drawDebug2: function() {
		
		let sg2d = SG2DApplication.getInstance();
		let camera = sg2d.camera;
		
		if (SG2DConsts.CAMERA.DEBUGGING.SHOW.CLUSTERS_IN_OUT) {
			if (! this._temp113) this._temp113 = [];
			for (var i = 0; i < this._temp113.length; i++) sg2d.viewport.removeChild(this._temp113[i]);
			this._temp113.length = 0;
			for (var i = 0; i < camera.clustersIn.length; i++) {
				var graphics = new PIXI.Graphics();
				graphics.lineStyle(2, 0xFF0000, 1);
				var cluster = camera.clustersIn[i];
				graphics.moveTo(0, 0);
				graphics.lineTo(63, 0);
				graphics.lineTo(63, 63);
				graphics.lineTo(0, 63);
				graphics.lineTo(0, 0);
				graphics.endFill();
				graphics.zIndex = 9998;
				graphics.position.set(cluster.x * 64 - 64, cluster.y * 64 - 64);
				sg2d.viewport.addChild(graphics);
				this._temp113.push(graphics);
			}
			for (var i = 0; i < camera.clustersOut.length; i++) {
				var graphics = new PIXI.Graphics();
				graphics.lineStyle(2, 0x4466FF, 1);
				var cluster = camera.clustersOut[i];
				graphics.moveTo(0, 0);
				graphics.lineTo(63, 0);
				graphics.lineTo(63, 63);
				graphics.lineTo(0, 63);
				graphics.lineTo(0, 0);
				graphics.endFill();
				graphics.zIndex = 9998;
				graphics.position.set(cluster.x * 64 - 64, cluster.y * 64 - 64);
				sg2d.viewport.addChild(graphics);
				this._temp113.push(graphics);
			}
		} else {
			if (this._temp113) {
				for (var p in this._temp113) {
					sg2d.viewport.removeChild(this._temp113[p]);
				}
			}
			this._temp113 = void 0;
		}
	},
	
	/** @private */
	_bodiesDrawed: new Set(),
	
	drawSG2DBodyLines: function(tile) {
		if (tile && tile.body && tile.body.vertices && tile.body.vertices.length) {
			if (! this._bodiesDrawed.has(tile.body)) {
				this._bodiesDrawed.add(tile.body);
				
				var parts = tile.body.parts;
				var graphics = tile.body._sg2dLines = (parts.length === 1 ? new PIXI.Graphics() : new PIXI.Container());
				
				for (var i = parts.length === 1 ? 0 : 1; i < parts.length; i++) {
					var body = parts[i];
					var g = (parts.length === 1 ? graphics : (g = new PIXI.Graphics(), graphics.addChild(g), g));
					g.lineStyle(2, 0xffffff, 1);
					g.moveTo(body.vertices[0].x - body.position.x, body.vertices[0].y - body.position.y);
					for (var j = 0; j < body.vertices.length; j++) g.lineTo(body.vertices[j].x - body.position.x, body.vertices[j].y - body.position.y);
					g.lineTo(body.vertices[0].x - body.position.x, body.vertices[0].y - body.position.y);
					g.endFill();
					g.x = body.position.x - tile.body.position.x;
					g.y = body.position.y - tile.body.position.y;
				}
				graphics.x = tile.body.position.x;
				graphics.y = tile.body.position.y;
				graphics.angle_init = tile.body.angle;
				graphics.zIndex = 9998;
				let sg2d = SG2DApplication.getInstance();
				sg2d.viewport.addChild(graphics);
			}
		}
	},
	
	undrawSG2DBodyLines: function(tile) {
		if (tile && tile.body && this._bodiesDrawed.has(tile.body)) {
			let sg2d = SG2DApplication.getInstance();
			sg2d.viewport.removeChild(tile.body._sg2dLines);
			this._bodiesDrawed.delete(tile.body);
		}
	},
	
	redrawSG2DBodiesLines: function() {
		for (var body of this._bodiesDrawed) {
			if (body.removed) {
				let sg2d = SG2DApplication.getInstance();
				sg2d.viewport.removeChild(body._sg2dLines);
				this._bodiesDrawed.delete(body);
				continue;
			}
			if (body.isStatic) continue;
			body._sg2dLines.x = body.position.x;
			body._sg2dLines.y = body.position.y;
			body._sg2dLines.angle = (body.angle - body._sg2dLines.angle_init) / SG2DMath.PI180;
		}
	},
	
	clear: function() {
		this._bodiesDrawed.clear();
	}
};

export default SG2DDebugging;