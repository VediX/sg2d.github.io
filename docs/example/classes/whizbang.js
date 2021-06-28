import ExplodeMatrix from "./whizbang-explode-matrix-35x8.js";

export class Whizbang extends SG2D.TileBody {
	static texture = "objects/whizbang";
	static layer = "animations";
	static animation = {
		count: 6,
		sleep: 3,
		running: false,
		basetexture: "animations/explosionA_",
		loop: false
	};
	
	static STATE_FLY = 1;
	static STATE_EXPLODE = 2;
	
	static CONFIG = {
		FLY_POWER: 0.002,
		DAMAGE: 2,
		DISTANCE: Infinity,
		EXPLODE_RADIUS: 35,
		DAMAGE_DECREASE: 0,
		DAMAGE_DECREASE_DISTANCE: 0,
		DAMAGE_DEVIATION: 0.10
	};
	
	static ownSetters = Object.assign({
		state: true
	}, SG2D.TileBody.ownSetters);
	
	static isWhizbang = true;
	
	defaults() {
		return SG2D.Model.defaults({
			state: Whizbang.STATE_FLY,
			state_index: 0
		}, SG2D.Tile.defaultProperties);
	}
	
	initialize(...args) {
		
		super.initialize(...args);
		
		if (this.constructor.CONFIG.DISTANCE !== Infinity) {
			this.distance = 0;
		}
		if (this.constructor.CONFIG.DAMAGE_DECREASE) {
			this.damage = this.constructor.CONFIG.DAMAGE;
		}
	}
	
	setState(state = void 0, options = SG2D.Model.OBJECT_EMPTY, flags = 0) {
		if (this.set("state", state, options, flags | SG2D.Model.FLAG_IGNORE_OWN_SETTER)) {
			switch (state) {
				case Whizbang.STATE_EXPLODE: {
					this.set("state_index", Whizbang.animation.count * Whizbang.animation.sleep);
					this.sound("tank_whizbang_explosion");
					break;
				}
			}
		}
	}
	
	iterate() {
		if (! this.clusters.size) {
			this.destroy();
		} else {
			switch (this.properties.state) {
				case Whizbang.STATE_FLY: {
					let force = Matter.Vector.create(
						this.constructor.CONFIG.FLY_POWER * SG2D.Math.cosrad(this.body.angle, 1),
						this.constructor.CONFIG.FLY_POWER * SG2D.Math.sinrad(this.body.angle, 1)
					);
					Matter.Body.applyForce( this.body, this.body.position, force);
					break;
				}
				case Whizbang.STATE_EXPLODE: {
					
					this.set("state_index", Math.max(0, this.properties.state_index - 1));
					if (this.properties.state_index === 0) {
						this.destroy();
						return;
					} else {
						if (! this.sprite.animation.running) {
							this.startAnimation();
						}
						this.makeDamage();
					}
					
					break;
				}
			}
		}
	}
	
	bodyCreate(position = { x: 0, y: 0 }, angle = 0) { // override
		
		this.body = Matter.Bodies.rectangle(position.x, position.y, 24, 10, {
			friction: this.constructor.MATTER.FRICTION,
			frictionAir: this.constructor.MATTER.FRICTIONAIR,
			restitution: this.constructor.MATTER.RESTITUTION,
			slop: this.constructor.MATTER.SLOP
		});
		
		Matter.Body.setAngle(this.body, angle * SG2D.Math.PI180);
		
		Matter.Body.setVelocity(
			this.body,
			Matter.Vector.create(10 * SG2D.Math.cos(this.properties.angle, 1), 10 * SG2D.Math.sin(this.properties.angle, 1))
		);
		
		return this.body;
	}
	
	collision(tile, pair, pairs) {
		
		if (this.properties.state === Whizbang.STATE_EXPLODE) return;
		
		var contactPoint = SG2D.Math.avgVertext( Object.values(pair.contacts).map((v)=>{ return v.vertex; }), {x: 0, y: 0});
		this.set("position", contactPoint);

		if (this.body) {
			Matter.Composite.remove(SG2D.matter.world, this.body);
		}
		
		this.set("state", Whizbang.STATE_EXPLODE);
	}
	
	static _bodies = [];
	static _point = {x: 0, y: 0};
	makeDamage() {
		var damage = (this.constructor.CONFIG.DAMAGE_DECREASE ? this.damage : this.constructor.CONFIG.DAMAGE);
		damage = (1 - this.constructor.CONFIG.DAMAGE_DEVIATION / 2) * damage + Math.random() * this.constructor.CONFIG.DAMAGE_DEVIATION * damage;
		
		//	radius			r_cells
		//	0<r<=64			1
		//	64<r<=128		2
		//	128<r<=192		3
		var r_cells = 1 + ((this.constructor.CONFIG.EXPLODE_RADIUS - 1)>>6);
		this.getBodiesAround(this.properties.position, r_cells, Whizbang._bodies);
		
		for (var i = 0; i < Whizbang._bodies.length; i++) {
			var body = Whizbang._bodies[i];
			if (body.tile && body.tile.constructor.damageable) {
				body._damage_sum = 0;
				continue;
			}
			Whizbang._bodies.splice(i, 1);
			i--;
		}
		
		if (! Whizbang._bodies.length) return 0;
		
		for (var i = 0; i < ExplodeMatrix.length; i++) {
			var m = ExplodeMatrix[i];
			Whizbang._point.x = this.properties.position.x + m.x;
			Whizbang._point.y = this.properties.position.y + m.y;
			var bodies = Matter.Query.point(Whizbang._bodies, Whizbang._point);
			for (var b = 0; b < bodies.length; b++) {
				bodies[b]._damage_sum += m.v * damage;
			}
		}
		
		var sum = 0;
		var exp_damage = 0;
		for (var i = 0; i < Whizbang._bodies.length; i++) {
			var body = Whizbang._bodies[i];
			if (body._damage_sum) {
				var accepted_damage = body.tile.damage(body._damage_sum);
				sum += accepted_damage;
			}
		}
		
		return sum;
	}
}