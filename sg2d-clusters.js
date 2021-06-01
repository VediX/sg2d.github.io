/**
 * SG2DClusters
 * https://github.com/VediX/SG2D
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

import SG2D from './sg2d.js';
import SG2DConsts from './sg2d-consts.js';
import SG2DMath from './sg2d-math.js';
import SG2DCluster from './sg2d-cluster.js';

export default class SG2DClusters {
	
	static permissible_sizes = [8,16,32,64,128,256,512,1024];
	static _x = 0;
	static _y = 0;
	
	static _instance = null;
	static getInstance() {
		if (this._instance) {
			return this._instance;
		} else {
			throw "Error! SG2DClusters._instance is empty!";
		}
	}
	
	static tiles = []; // all tiles (Array is faster than Set in Mozilla)
	static tilesset = new Set(); // all tiles
	static bodies = new Set(); // all colliding bodies
	
	static each(f) { return SG2DClusters.getInstance().each(f); }
	static getCluster(x, y) { return SG2DClusters.getInstance().getCluster(x, y); }
	static getClusterCXY(cxy) { return SG2DClusters.getInstance().getClusterCXY(cxy); }
	static inArea(x, y) { return SG2DClusters.getInstance().inArea(x, y); }
	static outArea(x, y) { return SG2DClusters.getInstance().outArea(x, y); }
	static nearestClusters90(cluster, checker) { return SG2DClusters.getInstance().nearestClusters90(cluster, checker); }
	static nearestClusters45(cluster, checker) { return SG2DClusters.getInstance().nearestClusters45(cluster, checker); }
	
	/**
	 * Config parameters and default values:
	 *	areasize=128 Size of area. The default is 128
	 */
	constructor(config, clusterClass = SG2DCluster) {
	
		if (SG2DClusters._instance) { debugger; throw "SG2DClusters Error! There is an instance of the class! You must execute .destroy() on the previous instance!"; }
		SG2DClusters._instance = this;
		
		config = config ? config : {};
		
		if (config.areasize !== void 0) {
			SG2DConsts.AREASIZE = config.areasize;
			SG2DConsts.AREASQUARE = config.areasize * config.areasize;
			SG2DConsts.AREASIZELOG2 = Math.ceil(Math.log2(config.areasize));
		}
	
		if (SG2DClusters.permissible_sizes.indexOf(SG2DConsts.AREASIZE) === -1) throw "Side of map size cannot differ from " + SG2DClusters.permissible_sizes.join(",") + "! Now SG2DConsts.AREASIZE=" + SG2DConsts.AREASIZE;

		this.areasize = this.width = this.height = SG2DConsts.AREASIZE;

		this.clusters = [];
		this.tiles = SG2DClusters.tiles;
		this.tilesset = SG2DClusters.tilesset;
		this.bodies = SG2DClusters.bodies;
		this.clear();
		
		var x, y;
		for (var i = 0; i < SG2DConsts.AREASQUARE; i++) {
			[x,y] = this.getXYbyIndex(i);
			this.clusters[i] = new clusterClass({x: x, y: y, i: i});
		}
	}
	
	getXYbyIndex(index) {
		SG2DCluster._y = index >> SG2DConsts.AREASIZELOG2;
		return [1 + (index - (SG2DCluster._y << SG2DConsts.AREASIZELOG2)), 1 + SG2DCluster._y];
	}
	
	getClusterByIndex(index) {
		SG2DCluster._y = index >> SG2DConsts.AREASIZELOG2;
		SG2DCluster._x = index - (SG2DCluster._y << SG2DConsts.AREASIZELOG2);
		return this.getCluster0(SG2DCluster._x, SG2DCluster._y);
	}

	getCluster0(x, y) {
		if (this.outArea0(x, y)) {
			return false;
		} else {
			return this.clusters[(y << SG2DConsts.AREASIZELOG2) + x];
		}
	}
	
	getCluster(x, y) {
		if (this.outArea(x, y)) {
			return false;
		} else {
			return this.clusters[((y - 1) << SG2DConsts.AREASIZELOG2) + (x - 1)];
		}
	}
	
	getClusterCXY(cxy) {
		if (this.outArea(cxy.x, cxy.y)) {
			return false;
		} else {
			return this.clusters[((cxy.y - 1) << SG2DConsts.AREASIZELOG2) + (cxy.x - 1)];
		}
	}

	outArea0(x, y) {
		return (x < 0 ||  x >= this.width || y < 0 || y >= this.height);
	}
	
	outArea(x, y) {
		return (x < 1 ||  x > this.width || y < 1 || y > this.height);
	}

	inArea0(x, y) {
		return ! this.outArea0(x, y);
	}
	
	inArea(x, y) {
		return ! this.outArea(x, y);
	}
	
	each(f) {
		for (var i = 0; i < SG2DConsts.AREASQUARE; i++) {
			f(this.clusters[i]);
		}
	}
	
	/**
	 * If the condition-function "checker" is fulfilled for at least one neighboring cluster, it will return "TRUE".
	 */
	nearestClusters90(cluster, checker) {
		var nearestCluster;
		for (var i = 0; i < 4; i++) {
			if (nearestCluster = this.getCluster(cluster.x + SG2DMath.vectors90[i].dx, cluster.y + SG2DMath.vectors90[i].dy)) {
				if (checker(nearestCluster, Math.round(i * 90)) === true) return true;
			}
		}
		return false;
	}
	
	nearestClusters45(cluster, checker) {
		var nearestCluster;
		for (var i = 0; i < 8; i++) {
			if (nearestCluster = this.getCluster(cluster.x + SG2DMath.vectors45[i].dx, cluster.y + SG2DMath.vectors45[i].dy)) {
				if (checker(nearestCluster, Math.round(i * 45)) === true) return true;
			}
		}
		return false;
	}
	
	clear() {
		SG2DClusters.tiles.length = 0;
		SG2DClusters.tilesset.clear();
		SG2DClusters.bodies.clear();
	}
	
	destroy() {
		this.clear();
		SG2DClusters._instance = null;
	}
}

if (typeof window !== "undefined") window.SG2DClusters = SG2DClusters;
if (typeof _root === "object") _root.SG2DClusters = SG2DClusters;