"use strict";

import SG2DConsts from "./sg2d-consts.js";
import SG2DUtils from "./sg2d-utils.js";
import SG2DTile from "./sg2d-tile.js";
import SG2DClusters from "./sg2d-clusters.js";

/**
 * Тайл с физическим телом
 * @alias SG2D.TileBody
 */
class SG2DTileBody extends SG2DTile {
	initialize(properties, thisProps, options) {
		
		this.body = this.bodyCreate(properties.position, properties.angle);
		if (this.body) {
			this.body.tile = this;
		}
		
		super.initialize.apply(this, arguments);
		
		if (this.body) {
			Matter.Composite.add(SG2D.matter.world, this.body);
		}
		
		SG2D.Clusters.bodies.add(this);
	}
	
	/**
	 * Конструктор физического тела по умолчанию (квадрат). Можно переопределить.
	 * @param {object} [position={ x: 0, y: 0 }] - Координаты тела в пикселях
	 * @param {object} [angle=0] - Поворот тела в градусах
	 */
	bodyCreate(position = { x: 0, y: 0 }, angle = 0) {
		
		this.body = Matter.Bodies.rectangle(position.x, position.y, SG2D.Consts.CELLSIZEPIX - 1, SG2D.Consts.CELLSIZEPIX - 1, {
			isStatic: true,
			frictionStatic: this.constructor.MATTER.FRICTIONSTATIC,
			restitution: this.constructor.MATTER.RESTITUTION,
			slop: this.constructor.MATTER.SLOP
		});
		
		if (this.properties.angle) {
			Matter.Body.setAngle(this.body, angle * SG2D.Math.PI180);
		}
		
		return this.body;
	}
	
	_onGeometric() { // overrided
		/*this.calcBoundsPX(); => bounds формируется MatterJS*/
		this._calcCXY();
		this._calcClustersBody();
	}
	
	/**
	 * Получить список физических тел тайлов рядом с точкой pxy
	 * @param {object} pxy - Координаты точки, рядом с которой ищутся физические тела, например, {x: 250, y: 7200}
	 * @param {number} [cells_indent=1] - Ширина поиска в кластерах
	 * @param {array} [bodies=[]] - Результирующий массив
	 */
	getBodiesAround(pxy, cells_indent = 1, bodies = []) {
		bodies.length = 0;
		var cluster;
		var cx = SG2DUtils.PXtoCX(pxy.x), cy = SG2DUtils.PXtoCX(pxy.y);
		for (var x = cx - cells_indent; x <= cx + cells_indent; x++) {
			for (var y = cy - cells_indent; y <= cy + cells_indent; y++) {
				if (cluster = SG2DClusters.getCluster(x, y)) {
					for (var tile of cluster.bodies) {
						if (tile !== this && tile.body && bodies.indexOf(tile.body) === -1) {
							bodies.push(tile.body);
						}
					}
				}
			}
		}
		return bodies;
	}
	
	destroy() {
		if (this.body) {
			Matter.Composite.remove(SG2D.matter.world, this.body);
		}
		SG2D.Clusters.bodies.delete(this);
		super.destroy(); // before this.body=null !
		this.body = null;
	}
}

SG2DTileBody.isBody = true;

/** Default MatterJS parameters */
SG2DTileBody.MATTER = {
	DENSITY: 1,
	FRICTION: 0,
	FRICTIONAIR: 0.1,
	FRICTIONSTATIC: 1,
	RESTITUTION: 0,
	SLOP: 0.05
};

export default SG2DTileBody;