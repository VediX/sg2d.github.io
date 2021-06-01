/**
 * SG2DCluster
 * https://github.com/VediX/SG2D
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

import SG2DConsts from './sg2d-consts.js';
import SG2D from './sg2d.js';

export default class SG2DCluster {
	
	constructor(cfg) {
		this.i = cfg.i;
		this.x = cfg.x;
		this.y = cfg.y;
		this.position = {
			x: cfg.x * SG2DConsts.CELLSIZEPIX - SG2DConsts.CELLSIZEPIX05,
			y: cfg.y * SG2DConsts.CELLSIZEPIX - SG2DConsts.CELLSIZEPIX05
		};
		
		this.tiles = new Set(); // All tiles in a cluster
		this.bodies = new Set(); // All tiles in the cluster affected by collision physics
		
		this.lighting_frame = 0; // see sg2d-camera.js
	}
	
	inCamera() {
		this.drawed = true;
		for (var tile of this.tiles) {
			tile.drawUndraw();
		}
	}
	
	outCamera() {
		this.drawed = false;
		
		for (var tile of this.tiles) {
			for (var cluster of tile.clusters) {
				if (cluster.drawed) return;
			}
			tile.removeSprites();
		}
	}
	
	static _tiles = [];
	getLayerTiles(layer, aResult = null) {
		if (aResult) {
			aResult.length = 0;
			for (var tile of this.tiles) {
				if ( (tile.properties.layer === void 0 && tile.constructor.layer === layer) || (tile.properties.layer === layer) ) {
					aResult.push(tile);
				}
			}
			return aResult;
		} else {
			SG2DCluster._tiles.length = 0;
			for (var tile of this.tiles) {
				if ( (tile.properties.layer === void 0 && tile.constructor.layer === layer) || (tile.properties.layer === layer) ) {
					SG2DCluster._tiles.push(tile);
				}
			}
			return SG2DCluster._tiles;
		}
	}
	
	tileInCluster(tileClassOrTexture) {
		if (typeof tileClassOrTexture === "function") {
			for (var tile of this.tiles) {
				if (tile.constructor === tileClassOrTexture) return tile;
			}
		} else {
			for (var tile of this.tiles) {
				if (tile.properties.texture === tileClassOrTexture) return tile;
			}
		}
		return false;
	}
	
	/*clear() {
		var tile;
		for (tile of this.tiles) tile.destroy();
	}*/
};