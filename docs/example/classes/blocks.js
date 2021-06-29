"use strict";

export class BlockSteel extends SG2D.TileBody {
	static texture = "elements/block-steel";
	static layer = "bodies";
	static zindex = 20;
}

export default class BlockBase extends SG2D.TileBody {
	static layer = "bodies";
	static zindex = 20;
	
	static damageable = true;
	static HEALTH_MAX = 100;
	
	static ownSetters = Object.assign({
		health: true
	}, SG2D.TileBody.ownSetters);
	
	defaults() {
		return SG2D.Model.defaults({
			health: this.constructor.HEALTH_MAX
		}, super.defaults.call(this));
	}
	
	initialize(...args) {
		this.set("texture", this.constructor.texture);
		super.initialize(...args);
	}
	
	damage(damage) {
		return ( this.constructor.damageable ? -this.healthInc(-damage) : 0);
	}
	
	healthInc(delta) {
		let h0 = this.properties.health;
		this.set("health", Math.min(Math.max(0, h0 + delta), this.constructor.HEALTH_MAX));
		if (! this.properties.health) {
			this.destroy();
		}
		return this.properties.health - h0;
	}
	
	setHealth(value = void 0, options = SG2D.Model.OBJECT_EMPTY, flags = 0) {
		if (this.set("health", value, options, flags | SG2D.Model.FLAG_IGNORE_OWN_SETTER)) {
			this.set("texture", this.getTexture());
		}
	}
	
	getTexture() {
		return this.constructor.texture + Math.min(
			this.constructor.texturesCount,
			(1 + ~~(this.constructor.texturesCount * (this.properties.health || this.constructor.HEALTH_MAX) / this.constructor.HEALTH_MAX))
		);
	}
}

export class BlockStandard extends BlockBase {
	static texture = "elements/block-standard";
	static texturesCount = 50;
	static damageable = true;
	static HEALTH_MAX = 100;
	
	static generateInBetweenTextures() {
		SG2D.Utils.createInBetweenTextures({
			start: "elements/breakstone",
			end: "elements/block-standard",
			count: this.texturesCount,
			name: this.texture + "%",
			flags: SG2D.Utils.FLAG_ADD_BORDER_ALPHA
		});
	}
}

export class BlockTriangle extends BlockBase {
	
	static texture = "elements/block-corner-45";
	static baseTexture = "elements/block-corner-";
	static texturesCount = 50;
	static HEALTH_MAX = 50;
	static damageable = true;
	
	static corners = {
		45: { smx: 11, smy: 11, vertices: [{x: 64 - 1,y: -2}, {x: 64 - 1,y: 64 - 4}, {x:1,y: 64 - 4}]},
		135: { smx: -11, smy: 11, vertices: [{x:0,y:0}, {x:0,y:64 - 2}, {x:64 - 1,y:64 - 2}]},
		225: { smx: -11, smy: -11, vertices: [{x:3,y: 0}, {x: 64 + 2, y: 0}, {x:3, y: 64 - 2}]},
		315: { smx: 11, smy: -11, vertices: [{x:0,y:0}, {x: 64 - 2,y:0}, {x: 64 - 2,y: 64 - 1}]}
	};
	
	static generateInBetweenTextures() {
		for (var a = 45; a <= 315; a +=90) {
			SG2D.Utils.createInBetweenTextures({
				start: "elements/block-corner-"+a + "-break",
				end: "elements/block-corner-"+a,
				count: this.texturesCount,
				name: this.baseTexture + a + "_%",
				flags: SG2D.Utils.FLAG_ADD_BORDER_ALPHA
			});
		}
	}
	
	initialize(...args) {
		super.initialize(...args);
		this.set("texture", BlockTriangle.baseTexture + this.properties.type);
	}
	
	bodyCreate(position = { x: 0, y: 0 }, angle = 0) { // override
		
		let corner = BlockTriangle.corners[this.properties.type];
		
		this.body = Matter.Bodies.fromVertices(
			position.x + corner.smx,
			position.y + corner.smy,
			corner.vertices,
			{
				isStatic: true,
				frictionStatic: this.constructor.MATTER.FRICTIONSTATIC,
				restitution: this.constructor.MATTER.RESTITUTION,
				slop: this.constructor.MATTER.SLOP
			}
		);
		
		return this.body;
	}
	
	getTexture() {
		return BlockTriangle.baseTexture +
			(this.properties.type || 45) +
			"_" + Math.min(BlockTriangle.texturesCount, (1 + ~~(BlockTriangle.texturesCount * (this.properties.health || BlockTriangle.HEALTH_MAX) / BlockTriangle.HEALTH_MAX)));
	}
}