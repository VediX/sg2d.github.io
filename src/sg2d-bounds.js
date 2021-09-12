"use strict";

/**
 * Границы
 * @alias SG2D.Bounds
 * @property {object} min
 * @property {number} min.x
 * @property {number} min.y
 * @property {object} max
 * @property {number} max.x
 * @property {number} max.y
 */
class SG2DBounds {
	
	/**
	 * Констурктор.
	 * @param {...number} [value] - Если ничего не передано, то все значения установлены в 0.
	 * @returns {SG2D.Bounds}
	 * @example
	 * let boundsA = new SG2D.Bounds(10,10,50,50)
	 * // or
	 * let boundsB = new SG2D.Bounds(boundsA);
	 */
	constructor() {
		this.min = {x: 0, y: 0};
		this.max = {x: 0, y: 0};
		if (arguments.length == 1) {
			this.setBounds(arguments[0]);
		} else if (arguments.length == 4) {
			this.set.apply(this, arguments);
		} else {
			this.set(0,0,0,0);
		}
	}
	
	/**
	 * Метод **set()** принимает параметры аналогично конструтору
	 */
	set() {
		if (arguments.length === 1) {
			this.setBounds(arguments[0]);
		} else {
			this.min.x = Math.min(arguments[0], arguments[2]);
			this.min.y = Math.min(arguments[1], arguments[3]);
			this.max.x = Math.max(arguments[0], arguments[2]);
			this.max.y = Math.max(arguments[1], arguments[3]);
		}
	}

	/**
	 * Задать значения границ
	 * @param {SG2D.Bounds} bounds
	 */
	setBounds(bounds) {
		this.min.x = bounds.min.x;
		this.min.y = bounds.min.y;
		this.max.x = bounds.max.x;
		this.max.y = bounds.max.y;
	}
	
	/**
	 * Ширина
	 * @param {Number} [dx=void 0] Дополнительная величина
	 * @returns {Number}
	 */
	dx(dx = void 0) {
		if (dx !== void 0) {
			this.max.x = this.min.x + dx;
		}
		return this.max.x - this.min.x;
	}
	
	/**
	 * Длина
	 * @param {Number} [dy=void 0] Дополнительная величина
	 * @returns {Number}
	 */
	dy(dy = void 0) {
		if (dy !== void 0) {
			this.max.y = this.min.y + dy;
		}
		return this.max.y - this.min.y;
	}
}

export default SG2DBounds;