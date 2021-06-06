import SG2DTile from "../../sg2d-tile.js";
import ObjectBaseLifeBand from "./object-base-life-band.js";
import {Whizbang} from "./tiles.js";

export default class Player extends ObjectBaseLifeBand {
	
	static singleInstance = true;
	static zindex = 10;
	
	static sprites = SGModel.defaults({
		platform: {
			texture: "objects/player-platform",
			zindex: 0,
			sprites: {
				turret: {
					texture: "objects/player-turret",
					anchor: { x: 0.15, y: 0.5 },
					zindex: 2,
					sprites: {
						smoke_shot: {
							texture: "objects/player-smoke-shot_1",
							layer: "animations",
							anchor: { x: -3.4, y: 0.5 },
							zindex: 1,
							visible: false,
							animation: {
								count: 6,
								sleep: 3,
								running: false,
								basetexture: "objects/player-smoke-shot_"
							},
							setter_flag: SG2DTile.FLAG_ONLY_OPTIONS_SPRITE
						}
					}
				}
			}
		},
		track_left: {
			texture: "objects/player-track_1",
			anchor: { x: -3.2, y: 2.3 },
			zindex: 1,
			animation: {
				count: 8,
				sleep: 2,
				running: false,
				basetexture: "objects/player-track_",
				loop: true
			}
		},
		track_right: {
			texture: "objects/player-track_1",
			anchor: { x: -3.2, y: -1.3 },
			zindex: 1,
			animation: {
				count: 8,
				sleep: 2,
				running: false,
				basetexture: "objects/player-track_",
				loop: true
			}
		}
	}, ObjectBaseLifeBand.sprites);
	
	static isPlayer = 1;
	
	static STATE_MOVE_FORWARD = 0b00000001;
	static STATE_MOVE_BACKWARD = 0b00000010;
	static STATE_ROTATE_LEFT = 0b00000100;
	static STATE_ROTATE_RIGHT = 0b00001000;
	static STATE_ACCELERATOR = 0b00010000;
	//static STATE_DEBUG = 0b10000000; // TODO DEL DEBUG
	
	static STATES_TRACKS_MOVING = 0b00001111;

	static POWER_MOVE = 2;
	static POWER_ROTATE_PLATFORM = 1;
	static POWER_ROTATE_TURRET = 2;
	static LOAD_WHIZBANG_FRAMES = 30;
	
	static keyStateTable = {
		"KeyW": Player.STATE_MOVE_FORWARD,
		"KeyS": Player.STATE_MOVE_BACKWARD,
		"KeyA": Player.STATE_ROTATE_LEFT,
		"KeyD": Player.STATE_ROTATE_RIGHT,
		"ArrowUp": Player.STATE_MOVE_FORWARD,
		"ArrowDown": Player.STATE_MOVE_BACKWARD,
		"ArrowLeft": Player.STATE_ROTATE_LEFT,
		"ArrowRight": Player.STATE_ROTATE_RIGHT,
		"ShiftLeft": Player.STATE_ACCELERATOR,
		"ShiftRight": Player.STATE_ACCELERATOR,
		//"KeyR": Player.STATE_DEBUG // TODO DEL DEBUG
	};
	
	defaults() {
		return SGModel.defaults({
			turret_angle_target: 0,
			load_whizbang: 0,
			state: 0
		}, super.defaults.call(this));
	}
	
	initialize(...args) {
		
		super.initialize(...args);
		
		this.keyProcess = this.keyProcess.bind(this);
		this.mouse.pointerclick = this.pointerClick.bind(this);
		this.calcTurretAngleTarget = this.calcTurretAngleTarget.bind(this);
		
		this.mouse.on("pxy", this.calcTurretAngleTarget);
		document.addEventListener("keydown", this.keyProcess);
		document.addEventListener("keyup", this.keyProcess);
		
		this.on("state", this.stateChange);
		
		this.set("angle", this.properties.angle, { sprites: [this.sprites.platform, this.sprites.track_left, this.sprites.track_right] });
	}
	
	keyProcess(e) {
		let state = this.properties.state;
		let bit = Player.keyStateTable[e.code];
		if (bit) {
			if (e.type === "keydown") {
				state |= bit;
			} else {
				state &= ~bit;
			}
		}
		this.set("state", state);
	}
	
	calcTurretAngleTarget(pxy) {
		if (SG2DMath.distance_p(pxy, this.properties.position) > 64) {
			this.set("turret_angle_target", SG2DMath.angle_p1p2_deg(this.properties.position, pxy, 1));
		}
	}
	
	// shot
	pointerClick(target, options) {
		if (options.button === SG2DMouse.POINTER_LEFT && this.properties.load_whizbang <= 0) {
			this.set("load_whizbang", Player.LOAD_WHIZBANG_FRAMES);
			this.startAnimation(this.sprites.smoke_shot);
			let whizbang = new Whizbang({
				angle: this.sprites.turret.angle,
				position: {
					x: this.properties.position.x + 110 * SG2DMath.cos(this.sprites.turret.angle, 1),
					y: this.properties.position.y + 110 * SG2DMath.sin(this.sprites.turret.angle, 1)
				}
			});
		}
	}
	
	iterate() {	
		let state = this.properties.state;
		let dx = 0;
		let dy = 0;
		let angle = this.properties.angle;
		let accelerator = (state & Player.STATE_ACCELERATOR ? 2 : 1);
		if (state & Player.STATE_MOVE_FORWARD) {
			dx += Player.POWER_MOVE * accelerator * SG2DMath.cos(this.properties.angle, 1);
			dy += Player.POWER_MOVE * accelerator * SG2DMath.sin(this.properties.angle, 1);
		}
		if (state & Player.STATE_MOVE_BACKWARD) {
			dx -= Player.POWER_MOVE * SG2DMath.cos(this.properties.angle, 1);
			dy -= Player.POWER_MOVE * SG2DMath.sin(this.properties.angle, 1);
		}
		if (state & Player.STATE_ROTATE_LEFT) angle -= Player.POWER_ROTATE_PLATFORM;
		if (state & Player.STATE_ROTATE_RIGHT) angle += Player.POWER_ROTATE_PLATFORM;
		
		// TODO DEL DEBUG
		/*if (state & Player.STATE_DEBUG) {
			if (this._debug13247 === void 0) this._debug13247 = 60;
			this._debug13247--;
			if (this._debug13247 < 0) {
				this._debug13247 = 60;
				angle += Player.POWER_ROTATE_PLATFORM * 15;
			}
		}*/
		
		this.set("position", {x: this.properties.position.x + dx, y: this.properties.position.y + dy});
		this.set("angle", angle);
		
		this.camera.set("rotate", this.properties.angle);
		
		// tank turret rotation
		var da = Math.abs(SG2DMath.betweenAnglesDeg(this.sprites.turret.angle, this.properties.turret_angle_target));
		if (da > 0.1) {
			var dir = SG2DMath.nearestDirRotate(this.sprites.turret.angle, this.properties.turret_angle_target);
			var a = this.sprites.turret.angle + Math.min(da, Player.POWER_ROTATE_TURRET) * dir;
			this.set("angle", a, { sprite: this.sprites.turret });
			if (! this.sprites.smoke_shot.animation.running) {
				this.set("angle", a, { sprite: this.sprites.smoke_shot });
			}
			
		}
		
		if ((state & Player.STATES_TRACKS_MOVING) && (accelerator >= 2)) {
			this.stepAnimation(this.sprites.track_left);
			this.stepAnimation(this.sprites.track_right);
		}
		
		if (this.properties.load_whizbang > 0) {
			this.set("load_whizbang", this.properties.load_whizbang - 1);
		}
	}
	
	stateChange(state) {
		// tracks animation
		if (state & Player.STATES_TRACKS_MOVING) {
			this.resumeAnimation(this.sprites.track_left);
			this.resumeAnimation(this.sprites.track_right);
		} else {
			this.stopAnimation(this.sprites.track_left);
			this.stopAnimation(this.sprites.track_right);
		}
	}
	
	destroy() {
		document.removeEventListener("keydown", this.keyProcess);
		document.removeEventListener("keyup", this.keyProcess);
	}
}