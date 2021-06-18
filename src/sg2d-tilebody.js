/**
 * SG2DBody
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya
 */

"use strict";

import SG2DConsts from "./sg2d-consts.js";
import SG2DUtils from "./sg2d-utils.js";
import SG2DTile from "./sg2d-tile.js";
import SG2DClusters from "./sg2d-clusters.js";

export default class SG2DTileBody extends SG2DTile {
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
	
	// default creator
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
	
	// overrided
	onGeometric() {
		/*this.calcBoundsPX(); => bounds формируется MatterJS*/
		this.calcCXY();
		this.calcClustersBody();
	}
	
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
		this.body = null;
		super.destroy();
	}
}

SG2DTileBody.isBody = true;

/** default MatterJS parameters */
SG2DTileBody.MATTER = {
	DENSITY: 1,
	FRICTION: 0,
	FRICTIONAIR: 0.1,
	FRICTIONSTATIC: 1,
	RESTITUTION: 0,
	SLOP: 0.05
};