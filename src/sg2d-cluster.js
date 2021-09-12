"use strict";

import SG2DConsts from './sg2d-consts.js';

/**
 * Кластер
 * @alias SG2D.Cluster
 */
class SG2DCluster {
	
	/**
	 * Конструктор
	 * @param {object} cfg
	 * @param {number}	cfg.i
	 * @param {number}	cfg.x
	 * @param {number}	cfg.y
	 * @returns {SG2DCluster}
	 */
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
	
	/**
	 * Отрисовка спрайтов тайлов, которые находятся в кластере (в том числе частично)
	 */
	inCamera() {
		this.drawed = true;
		for (var tile of this.tiles) {
			tile.drawUndraw();
		}
	}
	
	/**
	 * Удаление спрайтов тайлов, которые находятся в кластере кроме тех, которые расположены в других видимых кластерах
	 */
	outCamera() {
		this.drawed = false;
		
		for (var tile of this.tiles) {
			for (var cluster of tile.clusters) {
				if (cluster.drawed) return;
			}
			tile.removeSprites();
		}
	}
	
	/**
	 * Получить список тайлов в слое
	 * @param {string} layer - Код слоя
	 * @param {Array} [aResult=void 0]
	 * @returns {SG2D.Tile[]}
	 */
	getTilesInLayer(layer, aResult = void 0) {
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
	
	/**
	 * Вернёт тайл, у которого текстура установлена в заданную или у которого заданный класс тайла.
	 * @param {string|SG2D.Tile} tileClassOrTexture - Имя текстуры или класс тайла.
	 * @returns {SG2D.Tile|false}
	 * @deprecated Используется при генерации карты. Начиная с версии 2.0 будет удалён!
	 */
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

/** @private */
SG2DCluster._tiles = [];

export default SG2DCluster;