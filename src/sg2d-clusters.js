"use strict";

import SG2DConsts from './sg2d-consts.js';
import SG2DMath from './sg2d-math.js';
import SG2DCluster from './sg2d-cluster.js';

/**
 * Матрица кластеров
 * @alias SG2D.Clusters
 */
class SG2DClusters {

	/**
	 * Конструктор
	 * @param {object}		[config=void 0] - Конфигурация
	 * @param {number}			[config.areasize=128]
	 * @param {SG2DCluster}	[clusterClass=SG2D.Cluster] - Класс кластера
	 * @returns {SG2DClusters}
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
		this.areasizepix = this.areasize * SG2DConsts.CELLSIZEPIX;

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
	 * Если функция checker выполняется хотя бы для одного соседнего кластера, то возвращается true, иначе false
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
	
	/**
	 * Если функция checker выполняется хотя бы для одного соседнего кластера, то возвращается true, иначе false
	 */
	nearestClusters45(cluster, checker) {
		var nearestCluster;
		for (var i = 0; i < 8; i++) {
			if (nearestCluster = this.getCluster(cluster.x + SG2DMath.vectors45[i].dx, cluster.y + SG2DMath.vectors45[i].dy)) {
				if (checker(nearestCluster, Math.round(i * 45)) === true) return true;
			}
		}
		return false;
	}
	
	/** @protected */
	clear() {
		SG2DClusters.tiles.length = 0;
		SG2DClusters.tilesset.clear();
		SG2DClusters.bodies.clear();
	}
	
	/** @protected */
	destroy() {
		this.clear();
		SG2DClusters._instance = null;
	}
}

SG2DClusters.permissible_sizes = [8,16,32,64,128,256,512,1024];
SG2DClusters._x = 0;
SG2DClusters._y = 0;

SG2DClusters._instance = null;
SG2DClusters.getInstance = function() {
	if (this._instance) {
		return this._instance;
	} else {
		throw "Error! SG2DClusters._instance is empty!";
	}
}

SG2DClusters.tiles = []; // all tiles (Array is faster than Set in Mozilla)
SG2DClusters.tilesset = new Set(); // all tiles
SG2DClusters.bodies = new Set(); // all colliding bodies

/**
 * Метод проекция на аналогичный метод singleton-экземпляра
 * @static
 */
SG2DClusters.each = function(f) { return SG2DClusters.getInstance().each(f); }

SG2DClusters.getCluster = function(x, y) { return SG2DClusters.getInstance().getCluster(x, y); }
SG2DClusters.getClusterCXY = function(cxy) { return SG2DClusters.getInstance().getClusterCXY(cxy); }
SG2DClusters.inArea = function(x, y) { return SG2DClusters.getInstance().inArea(x, y); }
SG2DClusters.outArea = function(x, y) { return SG2DClusters.getInstance().outArea(x, y); }
SG2DClusters.nearestClusters90 = function(cluster, checker) { return SG2DClusters.getInstance().nearestClusters90(cluster, checker); }
SG2DClusters.nearestClusters45 = function(cluster, checker) { return SG2DClusters.getInstance().nearestClusters45(cluster, checker); }

export default SG2DClusters;