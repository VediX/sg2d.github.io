/**
 * SGModel 1.0.2
 * A fast lightweight library (ES6) for structuring web applications using binding models and custom events. This is a faster and more simplified analogue of Backbone.js!
 * https://github.com/VediX/SGModel
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 * SGModel may be freely distributed under the MIT license
 */

"use strict";

export default class SGModel {
	
	/**
	 * SGModel constructor
	 * @param {object} props Properties
	 * @param {object} thisProps Properties and methods passed to the "this" context of the created instance
	 * @param {object} options Custom settings
	 */
	constructor(props, thisProps, options = void 0) {
		
		if (this.constructor.singleInstance) {
			if (this.constructor._instance) throw "Error! this.constructor._instance not is empty!";
			this.constructor._instance = this;
		}
		
		var properties = props || {};
		
		var defaults = (typeof this.defaults === "function" ? this.defaults() : SGModel.clone(this.constructor.defaultProperties));
		
		// override defaults by localStorage data
		if (this.constructor.localStorageKey) {
			let lsData = void 0;
			let data = localStorage.getItem(this.constructor.localStorageKey + (! this.constructor.singleInstance ? "_" + props.id : ""));
			if (data) lsData = JSON.parse(data);
			if (lsData) SGModel.initObjectByObject(defaults, lsData);
		}
		
		for (var p in properties) {
			var value = properties[p];
			switch (this.constructor.typeProperties[p]) {
				case SGModel.TYPE_ANY: case SGModel.TYPE_ARRAY: break;
				case SGModel.TYPE_NUMBER: properties[p] = (value === void 0 ? void 0 : +value); break;
				case SGModel.TYPE_NUMBER_OR_XY: {
					if (typeof value === "object") {
						value.x = (value.x === void 0 ? void 0 : +value.x);
						value.y = (value.y === void 0 ? void 0 : +value.y);
					} else {
						properties[p] = (value === void 0 ? void 0 : +value);
					}
					break;
				}
				case SGModel.TYPE_ARRAY_NUMBERS: {
					for (var i = 0; i < value.length; i++) value[i] = +value[i];
					break;
				}
				case SGModel.TYPE_OBJECT_NUMBERS: {
					if (Array.isArray(value)) {
						var valueDefault = defaults[p];
						if (! valueDefault) { debugger; throw "No default value was set for an object named \""+p+"\" ("+this.constructor.name+")! An object structure is required to fill in the data!"; }
						var index = 0;
						for (var i in valueDefault) {
							valueDefault[i] = +value[index];
							index++;
						}
						properties[p] = valueDefault;
					} else if (typeof value === "object") {
						for (var i in value) {
							value[i] = +value[i];
						}
					} else { debugger; throw "Error! Property \""+p+"\" ("+this.constructor.name+") must be an object or an array!"; }
					break;
				}
				case SGModel.TYPE_STRING: properties[p] = ''+value; break;
				case SGModel.TYPE_BOOLEAN: properties[p] = !! value; break;
				case SGModel.TYPE_OBJECT:
					if (Array.isArray(value)) {
						var valueDefault = defaults[p];
						if (! valueDefault) { debugger; throw "No default value was set for an object named \""+p+"\" ("+this.constructor.name+")! An object structure is required to fill in the data!"; }
						var index = 0;
						for (var i in valueDefault) {
							valueDefault[i] = value[index];
							index++;
						}
						properties[p] = valueDefault;
					} else if (typeof value === "object") {
						// no code
					} else { debugger; throw "Error! Property \""+p+"\" ("+this.constructor.name+") must be an object or an array!"; }
					break;
				default:
					debugger; throw "Error! Unknown type specified for property \""+p+"\" ("+this.constructor.name+")!";
			}
		}

		this.properties = SGModel.defaults({}, defaults, properties);

		if (! this.properties.id) this.properties.id = SGModel.uid();

		if (thisProps) {
			Object.assign(this, thisProps); // add internal properties to the object, accessible through this.*
		} else {
			thisProps = SGModel.OBJECT_EMPTY;
		}
		
		this.destroyed = false;

		this.onChangeCallbacks = {};
		
		// Crutch, since in JS there is no way to execute the code in the child class at the time of extends of the parent class
		if (! this.constructor.hasOwnProperty("_ownSettersInitialized")) {
			this.constructor._ownSettersInitialized = true;
			for (var p in this.constructor.ownSetters) {
				if (this.constructor.ownSetters[p] === true) {
					this.constructor.ownSetters[p] = this["set" + SGModel.upperFirstLetter(p)];
				}
			}
		}
		
		this.changed = false; // reset manually!
		
		this.initialize.call(this, props, thisProps, options);
	}
	
	// Called when an instance is created. Override in your classes.
	initialize() {}
	
	/**
	* Set property value
	* @param {string} name
	* @param {mixed} val
	* @param {object} [options]
	* @param {number} flags	- Valid flags: FLAG_OFF_MAY_BE | FLAG_PREV_VALUE_CLONE | FLAG_NO_CALLBACKS | FLAG_FORCE_CALLBACKS | FLAG_IGNORE_OWN_SETTER
	* @param {number}		[options.precision] - Rounding precision
	* @param {mixed}		[options.previous_value] - Use this value as the previous value
	* @return {boolean} If the value was changed will return true
	*/
	set(name, value, options = void 0, flags = 0) {
		
		if (typeof options !=="object" && options !== void 0) { debugger; throw "Error 7610932! \"options\" type is not a object or undefined! Property: " + name + ", constructor: " + this.constructor.name; }
		if (typeof flags !=="number") { debugger; throw "Error 7892354! \"flags\" type is not a number!" }
		
		options = options || SGModel.OBJECT_EMPTY;
		
		if (! (flags & SGModel.FLAG_IGNORE_OWN_SETTER) && this.constructor.ownSetters[name]) {
			return this.constructor.ownSetters[name].call(this, value, options, flags);
		}
		
		var type = this.constructor.typeProperties[name];
		if (type) {
			switch (type) {
				case SGModel.TYPE_ANY: break;
				case SGModel.TYPE_NUMBER: {
					if (value !== void 0) {
						value = (options.precision ? SGModel.roundTo(value, options.precision) : +value);
					}
					break;
				}
				case SGModel.TYPE_NUMBER_OR_XY: return this._setNumberOrXY.apply(this, arguments);
				case SGModel.TYPE_ARRAY: case SGModel.TYPE_ARRAY_NUMBERS: return this._setArray.apply(this, arguments);
				case SGModel.TYPE_OBJECT: case SGModel.TYPE_OBJECT_NUMBERS: return this._setObject.apply(this, arguments);
				case SGModel.TYPE_STRING: value = ''+value; break;
				case SGModel.TYPE_BOOLEAN: value = !! value; break;
			}
		}
		
		var val = this.properties[name];
		
		if (val === value) {
			if (! (flags & SGModel.FLAG_FORCE_CALLBACKS)) return false;
		} else {
			this.properties[name] = value;
			this.changed = true;
		}
		
		if (! (flags & SGModel.FLAG_NO_CALLBACKS)) {
			SGModel._prevValue = (options.previous_value !== void 0 ? options.previous_value : ((flags & SGModel.FLAG_PREV_VALUE_CLONE) ? SGModel.clone(val) : val));
			var callbacks = this.onChangeCallbacks[name];
			if (callbacks) {
				if (flags & SGModel.FLAG_OFF_MAY_BE) callbacks = SGModel.clone(callbacks);
				var _val = void 0;
				for (var i in callbacks) {
					var c = callbacks[i];
					if (c.d) {
						_val = c.f.call(c.c ? c.c : this, c.d, value, SGModel._prevValue);
					} else {
						_val = c.f.call(c.c ? c.c : this, value, SGModel._prevValue);
					}
					if (_val !== void 0) val = _val;
				}
			}
		}
		
		return true;
	}

	/** @private */
	_setArray(name, aValues, options = void 0, flags = 0) {
		
		options = options || SGModel.OBJECT_EMPTY;
		
		if ( ! (flags & SGModel.FLAG_IGNORE_OWN_SETTER) && this.constructor.ownSetters[name]) {
			return this.constructor.ownSetters[name].call(this, aValues, options, flags);
		}

		var type = this.constructor.typeProperties[name];
		var values = this.properties[name];

		SGModel._prevValue = options.previous_value || void 0;
		SGModel._bChanged = false;
		if (Array.isArray(aValues)) {
			for (var i = 0; i < aValues.length; i++) {
				var v = aValues[i];
				if (type === SGModel.TYPE_ARRAY_NUMBERS) {
					v = (options.precision ? SGModel.roundTo(v, options.precision) : +v);
				}
				if (values[i] !== v) {
					SGModel._bChanged = true;
					if ((flags & SGModel.FLAG_PREV_VALUE_CLONE) && ! SGModel._prevValue) SGModel._prevValue = SGModel.clone(values);
					values[i] = v;
				}
			}
		} else if (aValues) {
			debugger;
			throw "aValues should be must Array or empty! ("+this.constructor.name+")";
		} else { // ! aValues
			var v = (type === SGModel.TYPE_OBJECT_NUMBERS ? 0 : void 0);
			for (var i = 0; i < values.length; i++) {
				if (values[i] !== v) {
					SGModel._bChanged = true;
					if ((flags & SGModel.FLAG_PREV_VALUE_CLONE) && ! SGModel._prevValue) SGModel._prevValue = SGModel.clone(values);
					values[i] = v;
				}
			}
		}
		
		if (SGModel._bChanged) this.changed = true;
		
		if (SGModel._bChanged || (flags & SGModel.FLAG_FORCE_CALLBACKS)) {
			this._runCallbacks(name, values, flags);
			return true;
		}
		
		return false;
	}
	
	/** @private */
	_setObject(name, oValues, options = void 0, flags = 0) {
		
		options = options || SGModel.OBJECT_EMPTY;
		
		if (! (flags & SGModel.FLAG_IGNORE_OWN_SETTER) && this.constructor.ownSetters[name]) {
			return this.constructor.ownSetters[name].call(this, oValues, options, flags);
		}

		var type = this.constructor.typeProperties[name];
		var values = this.properties[name];

		SGModel._prevValue = options.previous_value || void 0;
		SGModel._bChanged = false;
		if (Array.isArray(oValues)) {
			SGModel._index = 0;
			for (var p in values) {
				var v = oValues[SGModel._index];
				if (type === SGModel.TYPE_OBJECT_NUMBERS) {
					v = (options.precision ? SGModel.roundTo(v, options.precision) : +v);
				}
				if (values[p] !== v) {
					SGModel._bChanged = true;
					if ((flags & SGModel.FLAG_PREV_VALUE_CLONE) && ! SGModel._prevValue) SGModel._prevValue = SGModel.clone(values);
					values[p] = v;
				}
				SGModel._index++;
			}
		} else if (oValues) {
			for (var p in oValues) {
				var v = oValues[p];
				if (type === SGModel.TYPE_OBJECT_NUMBERS) {
					v = (options.precision ? SGModel.roundTo(v, options.precision) : +v);
				}
				if (values[p] !== v) {
					SGModel._bChanged = true;
					if ((flags & SGModel.FLAG_PREV_VALUE_CLONE) && ! SGModel._prevValue) SGModel._prevValue = SGModel.clone(values);
					values[p] = v; 
				}
			}
		} else { // ! oValues
			var v = (type === SGModel.TYPE_OBJECT_NUMBERS ? 0 : void 0);
			for (var p in values) {
				if (values[p] !== v) {
					SGModel._bChanged = true;
					if ((flags & SGModel.FLAG_PREV_VALUE_CLONE) && ! SGModel._prevValue) SGModel._prevValue = SGModel.clone(values);
					values[p] = v;
				}
			}
		}
		
		if (SGModel._bChanged) this.changed = true;

		if (SGModel._bChanged || (flags & SGModel.FLAG_FORCE_CALLBACKS)) {
			this._runCallbacks(name, values, flags);
			return true;
		}
		return false;
	}
	
	/** @private */
	_setNumberOrXY(name, value, options = void 0, flags = 0) {
		
		options = options || SGModel.OBJECT_EMPTY;
		
		if (! (flags & SGModel.FLAG_IGNORE_OWN_SETTER) && this.constructor.ownSetters[name]) {
			return this.constructor.ownSetters[name].call(this, value, options, flags);
		}
		
		let val = this.properties[name];
		SGModel._prevValue = options.previous_value || void 0;
		SGModel._bChanged = false;
		
		if (value !== void 0) {
			if (typeof value === "object") {
				value.x = (options.precision ? SGModel.roundTo(value.x, options.precision) : +value.x);
				value.y = (options.precision ? SGModel.roundTo(value.y, options.precision) : +value.y);
				if (typeof val === "object") {
					if (val.x !== value.x || val.y !== value.y) {
						SGModel._bChanged = true;
						if ((flags & SGModel.FLAG_PREV_VALUE_CLONE) && ! SGModel._prevValue) SGModel._prevValue = SGModel.clone(val);
						val.x = value.x;
						val.y = value.y;
					}
				} else {
					if (val !== value.x || val !== value.y) {
						SGModel._bChanged = true;
						SGModel._prevValue = val;
						this.properties[name] = value; // TODO clone object?
					}
				}
			} else {
				value = (options.precision ? SGModel.roundTo(value, options.precision) : +value);
				if (typeof val === "object") {
					if (val.x !== value || val.y !== value) {
						SGModel._bChanged = true;
						if ((flags & SGModel.FLAG_PREV_VALUE_CLONE) && ! SGModel._prevValue) SGModel._prevValue = SGModel.clone(val);
						this.properties[name] = value;
					}
				} else {
					if (val !== value) {
						SGModel._bChanged = true;
						SGModel._prevValue = val;
						this.properties[name] = value;
					}
				}
			}
		} else {
			if (val !== value) {
				SGModel._bChanged = true;
				if ((flags & SGModel.FLAG_PREV_VALUE_CLONE) && ! SGModel._prevValue) SGModel._prevValue = SGModel.clone(val);
				this.properties[name] = void 0;
			}
		}
		
		if (SGModel._bChanged) {
			this.changed = true;
		} else {
			return false;
		}
		
		if (SGModel._bChanged || (flags & SGModel.FLAG_FORCE_CALLBACKS)) {
			this._runCallbacks(name, value, flags);
		}
		
		return true;
	}
	
	_runCallbacks(name, values, flags = 0) {
		if (! (flags & SGModel.FLAG_NO_CALLBACKS)) {
			var callbacks = this.onChangeCallbacks[name];
			if (callbacks) {
				if (flags & SGModel.FLAG_OFF_MAY_BE) callbacks = SGModel.clone(callbacks);
				var _val = void 0;
				for (var i in callbacks) {
					var c = callbacks[i];
					if (c.d) {
						_val = c.f.call(c.c ? c.c : this, c.d, values, SGModel._prevValue);
					} else {
						_val = c.f.call(c.c ? c.c : this, values, SGModel._prevValue);
					}
					if (_val !== void 0) values = _val;
				}
			}
		}
	}

	get(name) {
		return this.properties[name];
	}

	/**
	 * Set trigger for property change
	 * @param {string} name
	 * @param {function} func
	 * @param {object} context If not specified, the "this" of the current object is passed
	 * @param {mixed} data	If "data" is set, then this value (data) is passed in the first arguments [] callback
	 * @param {number} flags Valid flags:
	 *		SGModel.FLAG_IMMEDIATELY - "func" will be executed once now
	 */
	on(name, func, context, data, flags = 0) {
		var callbacks = this.onChangeCallbacks[name];
		if (! callbacks) callbacks = this.onChangeCallbacks[name] = [];
		callbacks.push({f: func, c: context, d: data});
		if (flags === SGModel.FLAG_IMMEDIATELY) {
			if (data) {
				func.call(context ? context : this, data, this.properties[name], this.properties[name]);
			} else {
				func.call(context ? context : this, this.properties[name], this.properties[name]);
			}
		}
	}

	off(name, func) {
		if (name) {
			var callbacks = this.onChangeCallbacks[name];
			if (callbacks) {
				if (func) {
					for (var i = 0; i < callbacks.length; i++) {
						if (callbacks[i].f === func) {
							callbacks.splice(i, 1);
							i--;
						}
					}
				} else {
					callbacks.length = 0;
				}
			}
		} else {
			for (var f in this.onChangeCallbacks) this.onChangeCallbacks[f].length = 0;
		}
	}
	
	/**
	 * Execute callbacks that are executed when the property value changes
	 * @param {string} name
	 * @param {number} flags Valid flags:
	 *		SGModel.FLAG_OFF_MAY_BE - if set can be .off(), then you need to pass this flag
	 */
	trigger(name, flags = 0) {
		
		var callbacks = this.onChangeCallbacks[name];
		if (callbacks) {
			if (flags & SGModel.FLAG_OFF_MAY_BE) callbacks = SGModel.clone(callbacks);
			for (var i in callbacks) {
				callbacks[i].f.call(callbacks[i].c ? callbacks[i].c : this, (callbacks[i].d ? callbacks[i].d : this.properties[name]));
			}
		}
	}
	
	/**
	 * Save data to localStorage
	 */
	save() {
		if (! this.constructor.localStorageKey) { debugger; throw "Error 37722990!"; }
		
		let id;
		if (this.constructor.singleInstance) {
			id = this.properties.id;
			delete this.properties.id;
		}
		
		// Discard properties starting with "_"
		let dest = {};
		for (var p in this.properties) {
			if (p[0] === "_") continue;
			dest[p] = this.properties[p];
		}
		
		localStorage.setItem(this.constructor.localStorageKey + (! this.constructor.singleInstance ? "_" + id : ""), JSON.stringify(dest));
		
		if (this.constructor.singleInstance) {
			this.properties.id = id;
		}
	}
	
	destroy() {
		this.destroyed = true;
		this.constructor._instance = null;
		this.off();
	}
}

if (typeof window === "object") window.SGModel = SGModel;
if (typeof self === "object") self.SGModel = SGModel;
if (typeof _root === "object") _root.SGModel = SGModel;

// Property data types
SGModel.typeProperties = {};
	
SGModel.defaultsProperties = {}; // override
	
SGModel.TYPE_ANY = void 0;
SGModel.TYPE_NUMBER = 1;
SGModel.TYPE_STRING = 2;
SGModel.TYPE_BOOLEAN = 3;
SGModel.TYPE_OBJECT = 4;
SGModel.TYPE_ARRAY = 5;
SGModel.TYPE_ARRAY_NUMBERS = 6;
SGModel.TYPE_OBJECT_NUMBERS = 7;
SGModel.TYPE_NUMBER_OR_XY = 8;

// The flag passed in the .on(...) call to execute the callback
SGModel.FLAG_IMMEDIATELY = true;

// Private property
SGModel.OBJECT_EMPTY = Object.preventExtensions({});

SGModel.FLAG_OFF_MAY_BE = 0b00000001; // if set can be .off(), then you need to pass this flag
SGModel.FLAG_PREV_VALUE_CLONE = 0b00000010; // Pass the previous value (heavy clone for objects / arrays)
SGModel.FLAG_NO_CALLBACKS = 0b00000100; // if given, no callbacks are executed
SGModel.FLAG_FORCE_CALLBACKS = 0b00001000; // execute callbacks even if there is no change
SGModel.FLAG_IGNORE_OWN_SETTER = 0b00010000; // ignore own setters

SGModel.OPTIONS_PRECISION_2 = Object.preventExtensions({ precision: 2 });
SGModel.OPTIONS_PRECISION_3 = Object.preventExtensions({ precision: 3 });
SGModel.OPTIONS_PRECISION_4 = Object.preventExtensions({ precision: 4 });
SGModel.OPTIONS_PRECISION_5 = Object.preventExtensions({ precision: 5 });

/**
 * List of properties for which to use their own setters first
 * Better than .on(...) for speed of work with a large number of class instances.
 * Also used if there is a base class and a descendant class where specific behavior is needed when changing properties.
 * Example:
 *	...
 *	static ownSetters = Object.assign({
 *		state: true
 *	}, OurBaseModel.ownSetters);
 *	...
 *	setState(value, options = SGModel.OBJECT_EMPTY, flags = 0) {
 *		if (this.set("state", value, options, flags | SGModel.FLAG_IGNORE_OWN_SETTER)) {
 *			//some code...
 *		}
 *	}
 */
SGModel.ownSetters = {};

/** @private */
SGModel._uid = 0;

/** @private */
SGModel.uid = function() {
	return ++SGModel._uid;
}

/** @public */
SGModel.defaults = function(dest, ...sources) {
	for (var i = sources.length; i--; ) {
		var source = sources[i];
		for (var p in source) {
			if (dest[p] === void 0) {
				dest[p] = (typeof source[p] === "object" ? SGModel.clone(source[p]) : source[p]);
			}
		}
	}
	return dest;
}

/**
 * Full cloning (with nested objects).
 * Attention! There is no check for circular references. You cannot allow nested objects to refer to each other through properties, because recursion is used!
 * @param {object|primitive} source
 * @return {object|primitive}
 */
SGModel.clone = function(source) {
	let dest;
	if (Array.isArray(source)) {
		dest = [];
		for (var i = 0; i < source.length; i++) {
			dest[i] = (typeof source[i] === "object" ? SGModel.clone(source[i]) : source[i]);
		}
	} else if (typeof source === "object") {
		dest = {};
		for (var p in source) {
			dest[p] = (typeof source[p] === "object" ? SGModel.clone(source[p]) : source[p]);
		}
	} else {
		dest = source;
	}
	return dest;
}

/**
 * Fill the values of the object / array dest with the values from the object / array source (with recursion)
 * @public
 */
SGModel.initObjectByObject = function(dest, source) {
	if (Array.isArray(dest)) {
		for (var i = 0; i < dest.length; i++) {
			if (source.hasOwnProperty(i)) {
				if (typeof dest[i] === "object") {
					this.initObjectByObject(dest[i], source[i]);
				} else {
					dest[i] = source[i];
				}
			}
		}
	} else if (typeof dest === "object") {
		for (var p in dest) {
			if (source.hasOwnProperty(p)) {
				if (typeof dest[p] === "object") {
					this.initObjectByObject(dest[p], source[p]);
				} else {
					dest[p] = source[p];
				}
			}
		}
	} else {
		dest = source;
	}
	return dest;
}

/** @public */
SGModel.upperFirstLetter = function(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/** @public */
SGModel.roundTo = function(value, precision = 0) {
	let m = 10 ** precision;
	return Math.round(value * m) / m;
}

/** @private */
SGModel._instance = null;

/** @public */
SGModel.singleInstance = false;

/** @public */
SGModel.getInstance = function(bIgnoreEmpty = false) {
	if (this._instance) {
		return this._instance;
	} else if (! bIgnoreEmpty) {
		debugger;
		throw "Error! this._instance is empty!";
	}
	return null;
}

/**
 * Method get() for single instance of a class
 * @public
 */
SGModel.get = function(...args) {
	return this._instance && this._instance.get(...args);
}

/**
 * Method set() for single instance of a class
 * @public
 */
SGModel.set = function(...args) {
	return this._instance && this._instance.set(...args);
}

/**
 * Method on() for single instance of a class
 * @public
 */
SGModel.on = function(...args) {
	return this._instance && this._instance.on(...args);
}

/**
 * Method off() for single instance of a class
 * @public
 */
SGModel.off = function(...args) {
	return this._instance && this._instance.off(...args);
}

/**
 * If a non-empty string value is specified, then the data is synchronized with the local storage.
 * Support for storing data as one instance of a class (single instance), and several instances: localStorageKey + "_" + id
 */
SGModel.localStorageKey = ""; // override

/** @private */
SGModel._bChanged = false;

/** @private */
SGModel._index = 0

/** @private */
SGModel._prevValue = void 0;

/** @private */
//static _ownSettersInitialized = false; // override

/** @private */
SGModel._xy = {x: 0, y: 0};