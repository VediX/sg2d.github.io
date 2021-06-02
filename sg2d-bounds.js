/**
 * SG2DBounds
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

export default class SG2DBounds {
	constructor() {
		if (arguments.length == 1) {
			this.setBounds(arguments[0]);
		} else if (arguments.length == 4) {
			this.set.apply(this, arguments);
		} else {
			this.set(0,0,0,0);
		}
	}
	set() {
		if (arguments.length === 1) {
			this.setBounds(arguments[0]);
		} else {
			this.min = {
				x: Math.min(arguments[0], arguments[2]),
				y: Math.min(arguments[1], arguments[3])
			};
			this.max = {
				x: Math.max(arguments[0], arguments[2]),
				y: Math.max(arguments[1], arguments[3])
			};
		}
	}

	setBounds(bounds) {
		this.min = {
			x: bounds.min.x,
			y: bounds.min.y
		};
		this.max = {
			x: bounds.max.x,
			y: bounds.max.y
		};
	}

	dx(dx = void 0) {
		if (dx !== void 0) {
			this.max.x = this.min.x + dx;
		}
		return this.max.x - this.min.x;
	}
	
	dy(dy = void 0) {
		if (dy !== void 0) {
			this.max.y = this.min.y + dy;
		}
		return this.max.y - this.min.y;
	}
}