import SG2DTile from "../../sg2d-tile.js";

export default class ObjectBaseLifeBand extends SG2DTile {
	
	static layer = "bodies";
	
	static sprites = {
		lifeband_base: {
			texture: "ui/lifeband_base",
			anchor: { x: 0.5, y: -5 },
			zindex: 10,
			angle: 90,
			layer: "animations",
			setter_flag: SG2DTile.FLAG_ONLY_OPTIONS_SPRITE
		},
		lifeband_value: {
			textures: { friend: "ui/lifeband_green", enemy: "ui/lifeband_red" },
			texture: "ui/lifeband_green",
			scale: { x: 1, y: 1 },
			anchor: { x: 0.5, y: -5 },
			zindex: 11,
			angle: 90,
			layer: "animations",
			setter_flag: SG2DTile.FLAG_ONLY_OPTIONS_SPRITE
		}
	}
	
	static ownSetters = Object.assign({
		health: true
	}, SG2DTile.ownSetters);
	
	static HEALTH_MAX = 100;
	
	defaults() {
		return SGModel.defaults({
			health: this.constructor.HEALTH_MAX
		}, SG2DTile.defaultProperties);
	}
	
	setHealth(value = void 0, options = SGModel.OBJECT_EMPTY, flags = 0) {
		if (this.set("health", value, options, flags | SGModel.FLAG_IGNORE_OWN_SETTER)) {
			this.set("scale", { x: this.properties.health / this.constructor.HEALTH_MAX, y: 1 }, { sprite: this.sprites.lifeband_value });
			this.set("anchor", { x: 0.5 / this.sprites.lifeband_value.scale.x, y: -5 }, { sprite: this.sprites.lifeband_value });
		}
	}
}