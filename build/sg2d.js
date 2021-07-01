/*!
 * SG2D 1.0.0 by @ Kalashnikov Ilya
 * https://sg2d.ru
 * License MIT
 * 
 * MIT License
 * 
 * Copyright (c) Ilya Kalashnikov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SG2D", [], factory);
	else if(typeof exports === 'object')
		exports["SG2D"] = factory();
	else
		root["SG2D"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SGModel; });
/**
 * SGModel 1.0.2
 * A fast lightweight library (ES6) for structuring web applications using binding models and custom events. This is a faster and more simplified analogue of Backbone.js!
 * https://github.com/VediX/SGModel
 * (c) 2019-2021 Kalashnikov Ilya
 * SGModel may be freely distributed under the MIT license
 */



class SGModel {
	
	// overriden
	defaults() {
		return SGModel.clone(this.constructor.defaultProperties);
	}
	
	/**
	 * SGModel constructor
	 * @param {object} props Properties
	 * @param {object} thisProps Properties and methods passed to the "this" context of the created instance
	 * @param {object} options Custom settings
	 */
	constructor(properties = {}, thisProps = void 0, options = void 0) {
		
		if (this.constructor.singleInstance) {
			if (this.constructor._instance) throw "Error! this.constructor._instance not is empty!";
			this.constructor._instance = this;
		}
		
		let defaults = this.defaults();
		
		// override defaults by localStorage data
		if (this.constructor.localStorageKey) {
			let lsData = void 0;
			let data = localStorage.getItem(this.constructor.localStorageKey + (! this.constructor.singleInstance ? "_" + props.id : ""));
			if (data) lsData = JSON.parse(data);
			if (lsData) SGModel.initObjectByObject(defaults, lsData);
		}
		
		if (typeof properties !== "object") properties = {};
		
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
		
		this.initialize.call(this, properties, thisProps, options);
	}
	
	// Called when an instance is created. Override in your classes.
	initialize() {}
	
	/**
	* Set property value
	* @param {string} name
	* @param {mixed} val
	* @param {object}	[options=void 0]
	* @param {number}		[options.precision] - Rounding precision
	* @param {mixed}		[options.previous_value] - Use this value as the previous value
	* @param {number} flags	- Valid flags: FLAG_OFF_MAY_BE | FLAG_PREV_VALUE_CLONE | FLAG_NO_CALLBACKS | FLAG_FORCE_CALLBACKS | FLAG_IGNORE_OWN_SETTER
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

if (typeof exports === 'object' && typeof module === 'object') module.exports = SGModel;
else if (typeof define === 'function' && __webpack_require__(2)) define("SG2D", [], ()=>SGModel);
else if (typeof exports === 'object') exports["SGModel"] = SGModel;
else if (typeof window === 'object' && window.document) window["SGModel"] = SGModel;
else undefined["SGModel"] = SGModel;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)(module)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/libs/sg-model.js
var sg_model = __webpack_require__(0);

// CONCATENATED MODULE: ./src/sg2d-deferred.js
/**
 * SG2DDeferred
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */



function SG2DDeferred() {
	let thens = [];
	let catches = [];

	let status;
	let resolvedValue;
	let rejectedError;

	return {
		isCompleted: ()=>{
			return status === 'resolved';
		},
		resolve: value => {
			status = 'resolved';
			resolvedValue = value;
			thens.forEach(t => t(value));
			thens.length = 0; // Avoid memleaks.
		},
		reject: error => {
			status = 'rejected';
			rejectedError = error;
			catches.forEach(c => c(error));
			catches.length = 0; // Avoid memleaks.
		},
		then: cb => {
			if (status === 'resolved') {
				cb(resolvedValue);
			} else {
				thens.unshift(cb);
			}
		},
		catch: cb => {
			if (status === 'rejected') {
				cb(rejectedError);
			} else {
				catches.unshift(cb);
			}
		}
	}
}

/* harmony default export */ var sg2d_deferred = (SG2DDeferred);
// CONCATENATED MODULE: ./src/sg2d-consts.js
/**
 * SG2DConsts
 * https://github.com/VediX/sg2d.github.io
 */



let SG2DConsts = {
	CELLSIZEPIX: 32,
	CELLSIZEPIX05: 16,
	CELLSIZELOG2: 5,
	AREASIZE: 128,
	AREASIZELOG2: Math.ceil(Math.log2(128)),
	AREASQUARE: 128*128,
	DRAW_BODY_LINES: false, // draw body borders (SG2DBody-> body.verticles)
	ONLY_LOGIC: false, // If true - the graphic part is disabled, i.e. the engine can only be used for calculations, for example, in the server side
	CAMERA: {
		WIDTH_HEIGHT_K: 1.01,
		DEBUGGING: {
			SHOW: {
				GRID: false,
				BOUNDS_PXY: false,
				BOUNDS_TOP_CLUSTERS: false,
				CLUSTER_LINE_BOUNDS: false,
				AXIS_LABELS: false,
				CLUSTERS_IN_OUT: false
			}
		}
	},
	SYSTEM_TILES: [
		{ name: "sg2d/override", url: "data:image/png;base64,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" },
		{ name: "sg2d/404", url: "data:image/png;base64,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" }
	],
	TILE_OVERRIDE: "sg2d/override",
	TILE_404: "sg2d/404",
	PIXI_TEXTURE_STRICT: false // If "true", then throws an exception if there is no texture
};

/* harmony default export */ var sg2d_consts = (SG2DConsts);
// CONCATENATED MODULE: ./src/sg2d-math.js
/**
 * SG2DMath
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */



let SG2DMath = {};

/* harmony default export */ var sg2d_math = (SG2DMath);
	
(function() {

	let _uid = 0;
	SG2DMath.uid = function() {
		return (++_uid);
	};
	
	// Functions for working with bitmasks
	SG2DMath.addFlag = (value, flag)=>(value | flag);
	SG2DMath.removeFlag = (value, flag)=>(value & ~flag);
	SG2DMath.setFlag = (value, flag, state = true)=>(state ? SG2DMath.addFlag(value, flag) : SG2DMath.removeFlag(value, flag));
	SG2DMath.hasFlag = (value, flag)=>(value & flag);
	SG2DMath.noFlag = (value, flag)=>(! (value & flag));
	
	let _ap = [];
	for (var dec = 0; dec <= 10; dec++) _ap[dec] = 10 ** dec;
	
	/**
	 * Round to decimal place
	 * @param {number} v
	 * @param {int} p
	 * @returns {number}
	 */
	SG2DMath.roundTo = function(v, dec) {
		var e = _ap[dec];
		return Math.round(v * e) / e;
	};
	
	SG2DMath.absDelta = function(v1, v2) {
		return Math.abs(v1 - v2);
	};

	SG2DMath.PI180 = Math.PI/180;
	SG2DMath.PI2 = Math.PI*2;
	SG2DMath.rad90 = 90 * SG2DMath.PI180;

	SG2DMath.toRad = function(a) {
		return a * this.PI180;
	};
	
	SG2DMath.toDeg = function(a) {
		return a / this.PI180;
	};
	
	SG2DMath.normalize_a = function(a, precision = 0) {
		while (a >= 360) a = a - 360;
		while (a < 0) a = a + 360;
		return this.roundTo(a, precision);
	};

	let _aSin = [];
	let _aCos = [];
	for (var a = 0; a <= 360; a++) {
		_aSin[a] = Math.sin(a * SG2DMath.PI180);
		_aCos[a] = Math.cos(a * SG2DMath.PI180);
	}
	let _aSin1 = [];
	let _aCos1 = [];
	for (var a = 0; a <= 3600; a++) {
		var _a = a / 10;
		_aSin1[a] = Math.sin(_a * SG2DMath.PI180);
		_aCos1[a] = Math.cos(_a * SG2DMath.PI180);
	}
	
	SG2DMath.sin = function(a, precision = 0) { // Accuracy to the tenth of a degree
		return (precision === 0 ? _aSin[this.normalize_a(a, precision)] : _aSin1[ Math.round(10 * this.normalize_a(a, 1)) ]);
	};
	SG2DMath.cos = function(a, precision = 0) {
		return (precision === 0 ? _aCos[this.normalize_a(a, precision)] : _aCos1[ Math.round(10 * this.normalize_a(a, 1)) ]);
	};
	
	SG2DMath.sinrad = function() {
		arguments[0] = arguments[0] / this.PI180;
		return this.sin.apply(this, arguments);
	};
	
	SG2DMath.cosrad = function() {
		arguments[0] = arguments[0] / this.PI180;
		return this.cos.apply(this, arguments);
	};
	
	/*Math.angle_p1p2_rad = function(p1, p2) { //not used!
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
	};*/
	SG2DMath.angle_p1p2_deg = function(p1, p2, precision = 0) {
		var angle_rad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		var angle_deg = this.normalize_a(angle_rad / this.PI180, precision);
		return angle_deg;
	};

	SG2DMath.distance_d = function(dx, dy) {
		return Math.sqrt(dx*dx + dy*dy);
	};
	SG2DMath.distance_p = function(p1, p2) {
		return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
	};
	
	// Get the minimum angle to get from a_start a_end
	SG2DMath.betweenAnglesDeg = function(a_start, a_end) {
		var da1 = a_end - a_start;
		var da2 = (a_end-360) - a_start;
		var da3 = a_end - (a_start-360);
		return (Math.abs(da1) < Math.abs(da2) ? (Math.abs(da3) < Math.abs(da1) ? da3 : da1) : (Math.abs(da3) < Math.abs(da2) ? da3 : da2));
	};

	// Direction of rotation (right / left) - which is faster
	SG2DMath.nearestDirRotate = function(rotate_current, rotate_target) {
		var a1 = this.normalize_a(rotate_target - rotate_current);
		var a2 = this.normalize_a(rotate_current - rotate_target);
		if (a1 === a2) return 0;
		return a1 > a2 ? -1 : 1;
	};
	
	SG2DMath.vectors45 = [{dx:1,dy:0},{dx:1,dy:1},{dx:0,dy:1},{dx:-1,dy:1},{dx:-1,dy:0},{dx:-1,dy:-1},{dx:0,dy:-1},{dx:1,dy:-1}]; // counterclockwise, starting from 0 deg
	SG2DMath.vectors90 = [{dx:1,dy:0},{dx:0,dy:1},{dx:-1,dy:0},{dx:0,dy:-1}]; // counterclockwise, starting from 0 deg

	/** @private */
	let _linePoints = [];
	/**
	 * Default point collection function
	 * @private
	 */
	SG2DMath._addLinePoint = function(x, y) {
		this.push({x: x, y: y});
	};
	
	/**
	* Forming an array of points of a solid line
	* @param {object} oPointStart
	* @param {object} oPointEnd
	* @param {mixed} dest fAddLinePoint or aDest or undefined
	* @return {array}
	*/
	SG2DMath.getLinePoints = function(oPointStart, oPointEnd, dest = void 0) {
		
		var fAddLinePoint = this._addLinePoint;
		if (typeof dest === "function") fAddLinePoint = dest;
		else if (Array.isArray(dest)) fAddLinePoint = fAddLinePoint.bind(dest);
		else (_linePoints.length = 0, fAddLinePoint = fAddLinePoint.bind(_linePoints));
		
		fAddLinePoint(Math.round(oPointStart.x), Math.round(oPointStart.y));

		var x1 = oPointStart.x, y1 = oPointStart.y;
		var x2 = oPointEnd.x, y2 = oPointEnd.y;
		var Dx = (x2 - x1), Dy = (y2 - y1);
		var d = Math.sqrt(Dx*Dx + Dy*Dy);
		var dx = Dx / d, dy = Dy / d;
		var cx = x1, cy = y1;
		var cxPrev = Math.round(x1), cyPrev = Math.round(y1);
		var cxIntPrev = cxPrev, cyIntPrev = cyPrev;

		while (true) {
			cx += dx;
			cy += dy;

			var cxInt = Math.round(cx);
			var cyInt = Math.round(cy);

			if ( (cxInt === cxIntPrev) && (cyInt === cyIntPrev) ) continue;
			if ( ( (x2 > x1) && (cx > x2) ) || ( (x2 < x1) && (cx < x2) ) ) break;
			if ( ( (y2 > y1) && (cy > y2) ) || ( (y2 < y1) && (cy < y2) ) ) break;
			if ( (cxInt != cxIntPrev) && (cyInt != cyIntPrev) ) {
				var cx1Int = cxInt;
				var cy1Int = cyIntPrev;
				var d1 = Math.sqrt( Math.pow(cx1Int - cx, 2) + Math.pow(cy1Int - cy, 2) ) + Math.sqrt( Math.pow(cx1Int - cxPrev, 2) + Math.pow(cy1Int - cyPrev, 2) );
				var cx2Int = cxIntPrev;
				var cy2Int = cyInt;
				var d2 = Math.sqrt( Math.pow(cx2Int - cx, 2) + Math.pow(cy2Int - cy, 2) ) + Math.sqrt( Math.pow(cx2Int - cxPrev, 2) + Math.pow(cy2Int - cyPrev, 2) );
				if (d1 > d2) {
					fAddLinePoint(cx2Int, cy2Int);
					cxIntPrev = cx2Int;
					cyIntPrev = cy2Int;
				} else {
					fAddLinePoint(cx1Int, cy1Int);
					cxIntPrev = cx1Int;
					cyIntPrev = cy1Int;
				}
			}

			fAddLinePoint(cxInt, cyInt);

			cxPrev = cx;
			cyPrev = cy;
			cxIntPrev = cxInt;
			cyIntPrev = cyInt;
		}
		
		return _linePoints;
	};
	
	let _avgVertext = {x: void 0, y: void 0};
	
	/**
	 * Get the midpoint
	 * @param {array} vertexes
	 * @param {object} point
	 * @returns {object} return point object
	 */
	SG2DMath.avgVertext = function(vertexes, point) {
		if (! vertexes.length) { debugger; throw "Error 773734";}
		point = point || _avgVertext;
		_avgVertext.x = vertexes[0].x;
		_avgVertext.y = vertexes[0].y;
		for (var i = 1; i < vertexes.length; i++) {
			_avgVertext.x += vertexes[i].x;
			_avgVertext.y += vertexes[i].y;
		}
		_avgVertext.x = _avgVertext.x / vertexes.length;
		_avgVertext.y = _avgVertext.y / vertexes.length;
		return _avgVertext;
	};
})();
// CONCATENATED MODULE: ./src/sg2d-utils.js
/**
 * SG2D Utilities
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */






var SG2DUtils = {
	DEFAULT_WIDTH: 32,
	DEFAULT_HEIGHT: 32,
	
	FLAG_ADD_BORDER_ALPHA: 0b00000001,

	getTime: function() {
		var sResult;
		if (typeof process !== "undefined" && process.hrtime) {
			var diff = process.hrtime(),
			sResult = diff[0] + '.' + ('00' + Math.round(diff[1]/1e6)).substr(-3,3);
		} else if (typeof performance !== "undefined" && performance.now) {
			sResult = (performance.now() / 1000).toFixed(3);
		} else {
			var d = new Date();
			sResult = (d.getTime()/1000).toFixed(3);
		}
		return +sResult;
	},
	
	loadJS: function(src, onload = void 0) {
		return new Promise((resolve, reject)=>{
			var script = document.createElement('script');
			script.onload = (event)=>{
				onload && onload(event);
				resolve();
			};
			script.onerror = reject;
			script.src = src;
			document.head.append(script);
		});
	},

	getTextureAsCanvas: function(mTexture) {

		var texture = typeof mTexture === "object" ? mTexture : PIXI.Texture.from(mTexture);

		if (texture.canvas) return texture.canvas;

		var canvas = this.createCanvas(texture.frame.width, texture.frame.height);
		var ctx = canvas.getContext("2d");
		ctx.drawImage(texture.baseTexture.resource.source, texture.frame.x, texture.frame.y, texture.frame.width, texture.frame.height, 0, 0, texture.frame.width, texture.frame.height);

		canvas.texture = texture.textureCacheIds[0] || "error";
		texture.canvas = canvas;

		return canvas;
	},

	getTextureAsBlob: async function(mTexture) {

		if (typeof mTexture === "string" && ! PIXI.utils.TextureCache[mTexture]) {
			console.error("Texture \"" + mTexture + "\" does not exist!");
			return false;
		}

		var texture = typeof mTexture === "object" ? mTexture : PIXI.Texture.from(mTexture);

		if (texture.blob) return texture.blob;

		var canvas = this.createCanvas(texture.frame.width, texture.frame.height);
		var ctx = canvas.getContext("2d");
		ctx.drawImage(texture.baseTexture.resource.source, texture.frame.x, texture.frame.y, texture.frame.width, texture.frame.height, 0, 0, texture.frame.width, texture.frame.height);

		if (canvas.convertToBlob) {
			texture.blob = await canvas.convertToBlob({type: "image/png"});
		} else {
			texture.blob = await new Promise(resolve=>canvas.toBlob(blob=>resolve(blob)));
		}

		return texture.blob;
	},

	getTextureUrl: async function(mTexture, flagOpenWindow) {
		if (! mTexture) return null;
		var blob = await SG2DUtils.getTextureAsBlob(mTexture);
		if (blob) {
			blob.url = blob.url || URL.createObjectURL(blob);
			if (flagOpenWindow) {
				var win = window.open("", "_blank");
				win.document.write("<html><head><script>window.location = '"+blob.url+"';</script></head></html>");
				win.document.close();
			} else {
				return blob.url;
			}
		} else {
			return false;
		}
	},

	/** @private */
	_options: {x: void 0, y: void 0},
	
	drawTextureToCanvas: function(texture, canvas, options) {
		options = options || this._options;
		var ctx = canvas.getContext("2d");
		var canvas = this.getTextureAsCanvas(texture);
		ctx.drawImage(canvas, options.x === void 0 ? 0 : options.x, options.y === void 0 ? 0 : options.y);
	},

	addMask: function(config) {
		var w = config.width || SG2DUtils.DEFAULT_WIDTH;
		var h = config.height || SG2DUtils.DEFAULT_HEIGHT;

		var canvasMask = this.createCanvas(w, h);

		var ctxMask = canvasMask.getContext("2d");
		var imageData = ctxMask.getImageData(0, 0, w, h);
		var p05 = w>>1;
		var l = w * h * 4;
		for (var i = 0; i < l; i+=4) {
			var p = i >> 2,
				y = Math.floor(p / h) - p05,
				x = p - (y + p05) * w - p05,
				r = sg2d_math.distance_d(x + 0.5, y + 0.5);
			var rgba = config.iterate(x, y, r, p);
			imageData.data[i] = rgba.r;
			imageData.data[i+1] = rgba.g;
			imageData.data[i+2] = rgba.b;
			imageData.data[i+3] = rgba.a;
		}
		ctxMask.putImageData(imageData, 0, 0);

		canvasMask._pixiId = config.name;
		var texture = PIXI.Texture.from(canvasMask);
		texture.canvas = canvasMask;
		texture._isFinalTexture = true;

		//(new Image()).src = canvasMask.toDataURL();

		return canvasMask;
	},

	/** @private */
	_optionsBAT: {},

	/**
	 * Make the border of the sprites semi-transparent (to eliminate artifacts in the form of stripes at the edges of terrain tiles)
	 * @param {object} options
	 * @param {array}		[options.textures=void 0] Array of textures
	 * @param {number}		[options.alpha=0.995] Transparency for the outermost border (1 pixel from the edge)
	 * @param {number}		[options.alpha2=1] Transparency for the border 2 pixels from the edge
	 */
	setBorderAlphaTextures: function(options={}) {
		options.textures = options.textures || [];
		if (! options.textures.length) {
			this._getFinalTextures(options.textures);
		}
		for (var i = 0; i < options.textures.length; i++) {
			var texture = typeof options.textures[i] === "object" ? options.textures[i] : PIXI.utils.TextureCache[options.textures[i]];
			if (texture) {
				this._optionsBAT.texture = texture;
				this._optionsBAT.alpha = options.alpha;
				this._optionsBAT.alpha2 = options.alpha2;
				this.setBorderAlphaTexture(this._optionsBAT);
			} else {
				console.warn("Texture with name \"" + options.textures[i] + "\" not found!");
			}
		}
	},

	/**
	 * Make the border of the sprite semi-transparent (to eliminate artifacts in the form of stripes at the edges of terrain tiles)
	 * @param {object} options
	 * @param {PIXI.Texture|string}	options.texture
	 * @param {number}				[options.alpha=0.995] Transparency for the outermost border (1 pixel from the edge)
	 * @param {number}				[options.alpha2=1] Transparency for the border 2 pixels from the edge
	 */
	setBorderAlphaTexture: function(options={}) {

		if (options.alpha === void 0) options.alpha = 0.995;
		if (options.alpha2 === void 0) options.alpha2 = 1;

		options.alpha = ~~(options.alpha * 256);
		options.alpha2 = ~~(options.alpha2 * 256);

		let texture_src = typeof options.texture === "object" ? options.texture : PIXI.utils.TextureCache(options.texture);
		let canvas = this.getTextureAsCanvas(texture_src);
		var ctx = canvas.getContext("2d");
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var l = canvas.width * canvas.height * 4;
		for (var i = 0; i < l; i+=4) {
			var p = i >>2;
			var y = Math.floor(p / canvas.width);
			var x = p - y * canvas.width;
			if (x === 0 || y === 0 || x === canvas.width-1 || y === canvas.height-1) {
				imageData.data[i+3] = Math.min(imageData.data[i+3], options.alpha);
			}
			if (options.alpha2 < 255 && (x === 1 || y === 1 || x === canvas.width-2 || y === canvas.height-2)) {
				imageData.data[i+3] = Math.min(imageData.data[i+3], options.alpha2);
			}
		}
		ctx.putImageData(imageData, 0, 0);

		PIXI.Texture.removeFromCache(canvas.texture);
		PIXI.BaseTexture.removeFromCache(canvas.texture);

		canvas._pixiId = canvas.texture;
		var texture_dest = PIXI.Texture.from(canvas);
		texture_dest.canvas = canvas;
		texture_dest._isFinalTexture = texture_src._isFinalTexture;
		texture_dest._qBorderAlpha = texture_src._qBorderAlpha;
	},

	/**
	 * Adds a transparent border to a 1 pixel sprite so that PIXI smooths the edges of the sprite when rotated.
	 * @param {object} options
	 * @param {array}		[options.textures=void 0]
	 * @param {boolean}	[options.all=false] If TRUE then a transparent border is added if the sprite has opaque pixels on the border
	 * @param {number}		[options.qborder=1] Maximum permissible transparent frame thickness
	 */
	addBorderAlphaTextures: function(options) {
		options.textures = options.textures || [];
		options.qborder = options.qborder || 1;
		if (! options.textures.length) {
			this._getFinalTextures(options.textures);
		}
		for (var i = 0; i < options.textures.length; i++) {
			var texture = typeof options.textures[i] === "object" ? options.textures[i] : PIXI.utils.TextureCache[options.textures[i]];
			if (texture) {
				if (options.qborder > this.ifUndefined(texture._qBorderAlpha, 0)) {
					var srcCanvas = SG2DUtils.getTextureAsCanvas(texture);
					var destCanvas = SG2DUtils.createCanvas(texture.width + 2, texture.height + 2);
					var destCtx = destCanvas.getContext("2d");
					destCtx.drawImage(srcCanvas, 1, 1);
					destCanvas._pixiId = texture.textureCacheIds[0] || texture.canvas._pixiId;
					PIXI.Texture.removeFromCache(destCanvas._pixiId);
					PIXI.BaseTexture.removeFromCache(destCanvas._pixiId);
					var textureDest = PIXI.Texture.from(destCanvas);
					textureDest.canvas = destCanvas;
					textureDest._isFinalTexture = texture._isFinalTexture;
					textureDest._qBorderAlpha = texture._qBorderAlpha ? texture._qBorderAlpha + 1 : 1;
				}
			} else {
				console.warn("Texture with name \"" + options.textures[i] + "\" not found!");
			}
		}
	},

	/** @private */
	_getFinalTextures: function(textures) {
		for (var name in PIXI.utils.TextureCache) {
			var texture = PIXI.utils.TextureCache[name];
			if (texture._isFinalTexture) {
				textures.push(texture);
			}
		}
	},

	// TODO DEL: (не исп-ся?)
	/*_rgba: {r:0,g:0,b:0,a:0},
	imageDataSetPixel: function(imageData, x, y, r, g, b, a) {
		var index = (x + y * imageData.width) * 4;
		imageData.data[index] = r;
		imageData.data[index + 1] = g;
		imageData.data[index + 2] = b;
		imageData.data[index + 3] = a;
	},
	imageDataGetPixel: function(imageData, x, y) {
		var index = (x + y * imageData.width) * 4;
		this._rgba.r = imageData.data[index];
		this._rgba.g = imageData.data[index+1];
		this._rgba.b = imageData.data[index+2];
		this._rgba.a = imageData.data[index+3];
		return this._rgba;
	},*/
	// /TODO DEL.

	/** @private */
	_ibt: [],

	/**
	 * Generate intermediate textures to gradually transform one texture to another (without using alpha)
	 * @param {object} config
	 */
	createInBetweenTextures: function(config) {
		if (! config.start) throw "Error 7020181!";
		if (! config.end) throw "Error 7020182!";
		config.count = Math.max(2, config.count || 2);
		if (! config.name) throw "Error 7020184!";
		config.flags = config.flags || 0;

		if (config.count <= 2) return;

		let canvasStart = this.getTextureAsCanvas(config.start);
		let canvasEnd = this.getTextureAsCanvas(config.end);
		let w = canvasStart.width, h = canvasStart.height, wh = w * h;

		for (var i = 0; i < wh; i++) this._ibt[i] = false;

		let dataStart = canvasStart.getContext("2d").getImageData(0,0,w,h).data;
		let dataEnd = canvasEnd.getContext("2d").getImageData(0,0,w,h).data;

		let blocksize = config.count - 1; // 5-1=4
		// count	     blocks
		// 2-1=1	S-...	e-...
		// 3-1=2	S-S-...	S-e- S-e- S-e- S-e- S-e- S-e-...	e-e-...
		// 4-1=3	S-S-S-...	S-S-e- S-S-e- S-S-e- S-S-e-...		S-e-e- S-e-e- S-e-e- S-e-e-...		e-e-e-...
		// 5-1=4	S-S-S-S-...	S-S-S-e- S-S-S-e- S-S-S-e-...		S-S-e-e- S-S-e-e- S-S-e-e-...		S-e-e-e- S-e-e-e- S-e-e-e-...		e-e-e-e-...
		// +random within one block (S-S-x-S)

		let qblocks = Math.ceil(wh / blocksize);
		let dataPrev = null;

		let texturesCreated = [];
		
		for (var j = 2; j < config.count; j++) {

			var jc = (j-1)/(config.count-1);
			var m = config.count - j + 1; // number of remaining unreplaced pixels

			var imageData = new ImageData(Uint8ClampedArray.from(dataPrev || dataStart), w, h);
			var data = imageData.data;

			for (var b = 0; b < qblocks; b++) {
				var pm = Math.floor(Math.random() * m); // Random position in the remaining unreplaced pixels
				var p0 = b * blocksize;
				for (var p = p0; p < p0 + blocksize; p++) {
					if (this._ibt[p]) continue;
					if (pm === 0) {
						this._ibt[p] = true;
						var index = p<<2;

						var brightnessStart = dataStart[index]+dataStart[index+1]+dataStart[index+2];
						var brightnessEnd = dataEnd[index]+dataEnd[index+1]+dataEnd[index+2];
						var brightnessDelta = (brightnessEnd - brightnessStart) * jc / 3 / 256;
						for (var c = 0; c < 3; c++) {
							var ic = index+c;
							data[ic] = dataEnd[ic];
							if (brightnessDelta < 0) {
								data[ic] = ~~(data[ic] * (1 + brightnessDelta));
							} else {
								data[ic] = ~~(data[ic] + (256 - data[ic]) * brightnessDelta);
							}
						}

						var ic = index+3;
						var alphaDelta = (dataEnd[ic] - dataStart[ic]) * jc / 256;
						data[ic] = dataEnd[ic];
						if (alphaDelta) {
							if (alphaDelta < 0) {
								data[ic] = ~~(data[ic] * (1 + alphaDelta));
							} else {
								data[ic] = ~~(data[ic] + (256 - data[ic]) * alphaDelta);
							}
						}

						break;
					}
					pm--;
				}
			}

			var canvas = this.createCanvas(w, h);
			var ctx = canvas.getContext("2d");
			ctx.putImageData(imageData, 0, 0);
			
			canvas._pixiId = config.name.replace("%", j);
			var texture = PIXI.Texture.from(canvas);
			texture.canvas = canvas;
			texture._isFinalTexture = true;
			
			texturesCreated.push(texture);

			dataPrev = data;
		}
		
		if (config.flags & this.FLAG_ADD_BORDER_ALPHA) {
			this.addBorderAlphaTextures({
				textures: texturesCreated
			});
		}

		var nameStart = config.name.replace("%", 1);
		if (! PIXI.utils.TextureCache[nameStart]) {
			canvasStart._pixiId = nameStart;
			var texture = PIXI.Texture.from(canvasStart);
			texture._isFinalTexture = true;
		}

		var nameEnd = config.name.replace("%", config.count);
		if (! PIXI.utils.TextureCache[nameEnd]) {
			canvasEnd._pixiId = nameEnd;
			var texture = PIXI.Texture.from(canvasEnd);
			texture._isFinalTexture = true;
		}
	},

	parseTexturePack: function(resources) {
		for (var r in resources) {
			if (r.substr(-6, 6) === "_image") continue;
			var resource = resources[r];
			for (var code in resource.textures) {

				var baseTexture = resource.textures[code];

				var m = code.match(/(.+)_(\d+)x(\d+)(\w)?(\.\w+)?$/); // Search for pictures with a specific name, for example: "explosion_64x64.png"
				if (m) {
					baseTexture._isFinalTexture = false;
					//SG2DUtils.getTextureUrl(code).then((res)=>{ (new Image()).src = res; }); // debugging

					var name = m[1];
					var w = +m[2];
					var h = +m[3];
					var dir = m[4] || "h";
					var sizex = Math.floor(baseTexture.width / w);
					var sizey = Math.floor(baseTexture.height / h);

					if (dir === "h") {
						var index = 0;
						for (var y = 0; y < sizey; y++) {
							for (var x = 0; x < sizex; x++) {
								var texture_name = name + "_" + (++index);
								if (PIXI.utils.TextureCache[texture_name]) {
									console.error("Texture \"" + texture_name + "\" already exists!");
									continue;
								}
								var px = x * w, py = y * h;
								var rect = new PIXI.Rectangle(0, 0, 0, 0);
								rect.width = w;
								rect.height = h;
								rect.x = baseTexture.frame.x + px;
								rect.y = baseTexture.frame.y + py;
								var texture = new PIXI.Texture(baseTexture, rect);
								PIXI.Texture.addToCache(texture, texture_name);
								texture._isFinalTexture = true;
								//SG2DUtils.getTextureUrl(name + "_" + index).then((res)=>{ (new Image()).src = res; }); // debugging
							}
						}
					} else {
						throw "dir vertical no supported! (TODO)";
					}

					PIXI.Texture.removeFromCache(baseTexture);
					PIXI.BaseTexture.removeFromCache(baseTexture);
				} else {
					baseTexture._isFinalTexture = true;
				}
			}
		}
	},

	/** @private */
	_loadSystemTextures: function() {
		let promise = new Promise((resolve, failed)=>{
			if (typeof PIXI === "undefined") {
				resolve("PIXI is undefined! Perhaps we are working in server mode!");
			} else {
				const loader = new PIXI.Loader()
				loader.add(sg2d_consts.SYSTEM_TILES).load((loader, resources)=>{
					for (var i = 0; i < sg2d_consts.SYSTEM_TILES.length; i++) {
						PIXI.Texture.removeFromCache( sg2d_consts.SYSTEM_TILES[i].url );
						PIXI.BaseTexture.removeFromCache( sg2d_consts.SYSTEM_TILES[i].url );
						PIXI.utils.TextureCache[ sg2d_consts.SYSTEM_TILES[i].name ]._isFinalTexture = true;
					}
					resolve();
				});
			}
		});
		return promise;
	},

	FLAG_CANVAS_OFFSCREEN: 0,
	FLAG_CANVAS_ELEMENT: 1,

	/**
	 * Create a new canvas
	 * @param {number} flag FLAG_CANVAS_OFFSCREEN или FLAG_CANVAS_ELEMENT
	 */
	createCanvas: function(width = void 0, height = void 0, flag = 0) {
		//flag = this.FLAG_CANVAS_ELEMENT; // FOR DEBUGGING
		if (flag === this.FLAG_CANVAS_ELEMENT || typeof OffscreenCanvas === "undefined") {
			var canvas = document.createElement("CANVAS");
			canvas.width = width || SG2DUtils.DEFAULT_WIDTH;
			canvas.height = height || SG2DUtils.DEFAULT_HEIGHT;
			return canvas;
		} else {
			return new OffscreenCanvas(width || SG2DUtils.DEFAULT_WIDTH, height || SG2DUtils.DEFAULT_HEIGHT);
		}
	},
	
	drawCircle: function(x, y, r, c) {
		var graphics = new PIXI.Graphics();
		graphics.beginFill(c || 0xff2222);
		graphics.drawCircle(x || 0, y || 0, r || 3);
		graphics.endFill();
		graphics.zIndex = 99999;
		SG2D.Application.drawSprite(graphics);
	},

	/** @public */
	PXtoCX: function(x_or_y) {
		return 1 + (x_or_y >> sg2d_consts.CELLSIZELOG2);
	},

	/** @public */
	debounce: function(func, delay) {
		let clearTimer;
		return function() {
			const context = this;
			const args = arguments;
			clearTimeout(clearTimer);
			clearTimer = setTimeout(() => func.apply(context, args), delay);
		}
	},

	/** @public */
	throttle: function(func, limit, _context) {
		let lastFunc;
		let lastRan;
		return function() {
			const context = _context || this;
			const args = arguments;
			if (!lastRan) {
				func.apply(context, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(function() {
					if ((Date.now() - lastRan) >= limit) {
						func.apply(context, args);
						lastRan = Date.now();
					}
				}, limit - (Date.now() - lastRan));
			}
		}
	},

	/** @private */
	_p: void 0,

	/** @public */
	isEmpty: function(o) {
		for (this._p in o) return false;
		return true;
	},

	/** @public */
	objectForEach: function(o, f, c = this) {
		for (var name in o) {
			if (f.call(c, o[name])===false) break;
		}
	},
	
	/** @public */
	propertiesCount: function(o) {
		let q = 0;
		for (var p in o) q++;
		return q;
	},

	/** @public */
	ifUndefined: function(value, valueIfUndefined) {
		return (value === void 0 ? valueIfUndefined : value);
	}
};

/* harmony default export */ var sg2d_utils = (SG2DUtils);
// CONCATENATED MODULE: ./src/sg2d-bounds.js
/**
 * SG2DBounds
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */



class SG2DBounds {
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
// CONCATENATED MODULE: ./src/sg2d-cluster.js
/**
 * SG2DCluster
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */





class sg2d_cluster_SG2DCluster {
	
	constructor(cfg) {
		this.i = cfg.i;
		this.x = cfg.x;
		this.y = cfg.y;
		this.position = {
			x: cfg.x * sg2d_consts.CELLSIZEPIX - sg2d_consts.CELLSIZEPIX05,
			y: cfg.y * sg2d_consts.CELLSIZEPIX - sg2d_consts.CELLSIZEPIX05
		};
		
		this.tiles = new Set(); // All tiles in a cluster
		this.bodies = new Set(); // All tiles in the cluster affected by collision physics
		
		this.lighting_frame = 0; // see sg2d-camera.js
	}
	
	inCamera() {
		this.drawed = true;
		for (var tile of this.tiles) {
			tile.drawUndraw();
		}
	}
	
	outCamera() {
		this.drawed = false;
		
		for (var tile of this.tiles) {
			for (var cluster of tile.clusters) {
				if (cluster.drawed) return;
			}
			tile.removeSprites();
		}
	}
	
	getLayerTiles(layer, aResult = null) {
		if (aResult) {
			aResult.length = 0;
			for (var tile of this.tiles) {
				if ( (tile.properties.layer === void 0 && tile.constructor.layer === layer) || (tile.properties.layer === layer) ) {
					aResult.push(tile);
				}
			}
			return aResult;
		} else {
			sg2d_cluster_SG2DCluster._tiles.length = 0;
			for (var tile of this.tiles) {
				if ( (tile.properties.layer === void 0 && tile.constructor.layer === layer) || (tile.properties.layer === layer) ) {
					sg2d_cluster_SG2DCluster._tiles.push(tile);
				}
			}
			return sg2d_cluster_SG2DCluster._tiles;
		}
	}
	
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
sg2d_cluster_SG2DCluster._tiles = [];
// CONCATENATED MODULE: ./src/sg2d-clusters.js
/**
 * SG2DClusters
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */







class sg2d_clusters_SG2DClusters {
	
	constructor(config, clusterClass = sg2d_cluster_SG2DCluster) {
	
		if (sg2d_clusters_SG2DClusters._instance) { debugger; throw "SG2DClusters Error! There is an instance of the class! You must execute .destroy() on the previous instance!"; }
		sg2d_clusters_SG2DClusters._instance = this;
		
		config = config ? config : {};
		
		if (config.areasize !== void 0) {
			sg2d_consts.AREASIZE = config.areasize;
			sg2d_consts.AREASQUARE = config.areasize * config.areasize;
			sg2d_consts.AREASIZELOG2 = Math.ceil(Math.log2(config.areasize));
		}
	
		if (sg2d_clusters_SG2DClusters.permissible_sizes.indexOf(sg2d_consts.AREASIZE) === -1) throw "Side of map size cannot differ from " + sg2d_clusters_SG2DClusters.permissible_sizes.join(",") + "! Now SG2DConsts.AREASIZE=" + sg2d_consts.AREASIZE;

		this.areasize = this.width = this.height = sg2d_consts.AREASIZE;
		this.areasizepix = this.areasize * sg2d_consts.CELLSIZEPIX;

		this.clusters = [];
		this.tiles = sg2d_clusters_SG2DClusters.tiles;
		this.tilesset = sg2d_clusters_SG2DClusters.tilesset;
		this.bodies = sg2d_clusters_SG2DClusters.bodies;
		this.clear();
		
		var x, y;
		for (var i = 0; i < sg2d_consts.AREASQUARE; i++) {
			[x,y] = this.getXYbyIndex(i);
			this.clusters[i] = new clusterClass({x: x, y: y, i: i});
		}
	}
	
	getXYbyIndex(index) {
		sg2d_cluster_SG2DCluster._y = index >> sg2d_consts.AREASIZELOG2;
		return [1 + (index - (sg2d_cluster_SG2DCluster._y << sg2d_consts.AREASIZELOG2)), 1 + sg2d_cluster_SG2DCluster._y];
	}
	
	getClusterByIndex(index) {
		sg2d_cluster_SG2DCluster._y = index >> sg2d_consts.AREASIZELOG2;
		sg2d_cluster_SG2DCluster._x = index - (sg2d_cluster_SG2DCluster._y << sg2d_consts.AREASIZELOG2);
		return this.getCluster0(sg2d_cluster_SG2DCluster._x, sg2d_cluster_SG2DCluster._y);
	}

	getCluster0(x, y) {
		if (this.outArea0(x, y)) {
			return false;
		} else {
			return this.clusters[(y << sg2d_consts.AREASIZELOG2) + x];
		}
	}
	
	getCluster(x, y) {
		if (this.outArea(x, y)) {
			return false;
		} else {
			return this.clusters[((y - 1) << sg2d_consts.AREASIZELOG2) + (x - 1)];
		}
	}
	
	getClusterCXY(cxy) {
		if (this.outArea(cxy.x, cxy.y)) {
			return false;
		} else {
			return this.clusters[((cxy.y - 1) << sg2d_consts.AREASIZELOG2) + (cxy.x - 1)];
		}
	}

	outArea0(x, y) {
		return (x < 0 ||  x >= this.width || y < 0 || y >= this.height);
	}
	
	outArea(x, y) {
		return (x < 1 ||  x > this.width || y < 1 || y > this.height);
	}

	inArea0(x, y) {
		return ! this.outArea0(x, y);
	}
	
	inArea(x, y) {
		return ! this.outArea(x, y);
	}
	
	each(f) {
		for (var i = 0; i < sg2d_consts.AREASQUARE; i++) {
			f(this.clusters[i]);
		}
	}
	
	/**
	 * If the condition-function "checker" is fulfilled for at least one neighboring cluster, it will return "TRUE".
	 */
	nearestClusters90(cluster, checker) {
		var nearestCluster;
		for (var i = 0; i < 4; i++) {
			if (nearestCluster = this.getCluster(cluster.x + sg2d_math.vectors90[i].dx, cluster.y + sg2d_math.vectors90[i].dy)) {
				if (checker(nearestCluster, Math.round(i * 90)) === true) return true;
			}
		}
		return false;
	}
	
	nearestClusters45(cluster, checker) {
		var nearestCluster;
		for (var i = 0; i < 8; i++) {
			if (nearestCluster = this.getCluster(cluster.x + sg2d_math.vectors45[i].dx, cluster.y + sg2d_math.vectors45[i].dy)) {
				if (checker(nearestCluster, Math.round(i * 45)) === true) return true;
			}
		}
		return false;
	}
	
	clear() {
		sg2d_clusters_SG2DClusters.tiles.length = 0;
		sg2d_clusters_SG2DClusters.tilesset.clear();
		sg2d_clusters_SG2DClusters.bodies.clear();
	}
	
	destroy() {
		this.clear();
		sg2d_clusters_SG2DClusters._instance = null;
	}
}

sg2d_clusters_SG2DClusters.permissible_sizes = [8,16,32,64,128,256,512,1024];
sg2d_clusters_SG2DClusters._x = 0;
sg2d_clusters_SG2DClusters._y = 0;

sg2d_clusters_SG2DClusters._instance = null;
sg2d_clusters_SG2DClusters.getInstance = function() {
	if (this._instance) {
		return this._instance;
	} else {
		throw "Error! SG2DClusters._instance is empty!";
	}
}

sg2d_clusters_SG2DClusters.tiles = []; // all tiles (Array is faster than Set in Mozilla)
sg2d_clusters_SG2DClusters.tilesset = new Set(); // all tiles
sg2d_clusters_SG2DClusters.bodies = new Set(); // all colliding bodies

sg2d_clusters_SG2DClusters.each = function(f) { return sg2d_clusters_SG2DClusters.getInstance().each(f); }
sg2d_clusters_SG2DClusters.getCluster = function(x, y) { return sg2d_clusters_SG2DClusters.getInstance().getCluster(x, y); }
sg2d_clusters_SG2DClusters.getClusterCXY = function(cxy) { return sg2d_clusters_SG2DClusters.getInstance().getClusterCXY(cxy); }
sg2d_clusters_SG2DClusters.inArea = function(x, y) { return sg2d_clusters_SG2DClusters.getInstance().inArea(x, y); }
sg2d_clusters_SG2DClusters.outArea = function(x, y) { return sg2d_clusters_SG2DClusters.getInstance().outArea(x, y); }
sg2d_clusters_SG2DClusters.nearestClusters90 = function(cluster, checker) { return sg2d_clusters_SG2DClusters.getInstance().nearestClusters90(cluster, checker); }
sg2d_clusters_SG2DClusters.nearestClusters45 = function(cluster, checker) { return sg2d_clusters_SG2DClusters.getInstance().nearestClusters45(cluster, checker); }
// CONCATENATED MODULE: ./src/sg2d-debugging.js
/**
 * SG2DDebugging
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */







var SG2DDebugging = {
	drawDebug: function() {
		
		let sg2d = sg2d_application_SG2DApplication.getInstance();
		let clusters = sg2d.clusters;
		let camera = sg2d.camera;
		
		// Grid
		if (sg2d_consts.CAMERA.DEBUGGING.SHOW.GRID) {
			if (! this._temp116) {
				this._temp116 = [];
				for (var x = 0; x <= clusters.width; x++) {
					var line = new PIXI.Graphics();
					line.lineStyle(2, 0xffffff).moveTo(x * sg2d_consts.CELLSIZEPIX, 0).lineTo(x * sg2d_consts.CELLSIZEPIX, clusters.height * sg2d_consts.CELLSIZEPIX);
					line.zIndex = 9999;
					this._temp116.push(line);
					sg2d.viewport.addChild(line);
				}
				for (var y = 0; y <= clusters.height; y++) {
					var line = new PIXI.Graphics();
					line.lineStyle(2, 0xffffff).moveTo(0, y * sg2d_consts.CELLSIZEPIX).lineTo(clusters.width * sg2d_consts.CELLSIZEPIX, y * sg2d_consts.CELLSIZEPIX);
					line.zIndex = 9999;
					this._temp116.push(line);
					sg2d.viewport.addChild(line);
				}
			}
		} else {
			if (this._temp116) {
				for (var p in this._temp116) {
					sg2d.viewport.removeChild(this._temp116[p]);
				}
			}
			this._temp116 = void 0;
		}
		
		// bounds cluster line
		if (sg2d_consts.CAMERA.DEBUGGING.SHOW.BOUNDS_PXY) {
			if (this._temp110) sg2d.viewport.removeChild(this._temp110);
			var graphics = this._temp110 = new PIXI.Graphics();
			var bpx = camera.boundsPXTops;
			graphics.moveTo(bpx.leftTop.x, bpx.leftTop.y);
			graphics.lineStyle(3, 0xFFFF00, 1);
			graphics.lineTo(bpx.rightTop.x, bpx.rightTop.y);
			graphics.lineStyle(3, 0xFF0000, 1);
			graphics.lineTo(bpx.rightBottom.x, bpx.rightBottom.y);
			graphics.lineStyle(3, 0x00FF00, 1);
			graphics.lineTo(bpx.leftBottom.x, bpx.leftBottom.y);
			graphics.lineStyle(3, 0x0000FF, 1);
			graphics.lineTo(bpx.leftTop.x, bpx.leftTop.y);
			graphics.endFill();
			graphics.zIndex = 9999;
			sg2d.viewport.addChild(graphics);
		} else {
			if (this._temp110) {
				sg2d.viewport.removeChild(this._temp110);
				this._temp110 = void 0;
			}
		}
		
		// bounds cluster top points
		if (sg2d_consts.CAMERA.DEBUGGING.SHOW.BOUNDS_TOP_CLUSTERS) {
			if (! this._temp111) this._temp111 = {};
			var i = 0; var colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xAA00AA];
			for (var p in camera.boundsClusterTops) {
				var point = camera.boundsClusterTops[p];
				if (! this._temp111[p]) {
					var graphics = this._temp111[p] = new PIXI.Graphics();
					graphics.lineStyle(3, colors[i++], 1);
					graphics.moveTo(0, 0);
					graphics.lineTo(63, 0);
					graphics.lineTo(63, 63);
					graphics.lineTo(0, 63);
					graphics.lineTo(0, 0);
					graphics.endFill();
					graphics.zIndex = 9999;
					sg2d.viewport.addChild(graphics);
				}
				this._temp111[p].position.set(point.x * 64 - 64, point.y * 64 - 64);
			}
		} else {
			if (this._temp111) {
				for (var p in this._temp111) {
					sg2d.viewport.removeChild(this._temp111[p]);
				}
			}
			this._temp111 = void 0;
		}
		
		// bounds cluster line points
		if (sg2d_consts.CAMERA.DEBUGGING.SHOW.CLUSTER_LINE_BOUNDS) {
			if (! this._temp112) this._temp112 = [];
			for (var i = 0; i < this._temp112.length; i++) sg2d.viewport.removeChild(this._temp112[i]);
			this._temp112.length = 0;
			for (var i = 0; i < camera.boundsPoint._length; i++) {
				var graphics = this._temp112[i] = new PIXI.Graphics();
				graphics.lineStyle(2, 0xFFFFFF, 2);
				var point = camera.boundsPoint[i];
				graphics.moveTo(0, 0);
				graphics.lineTo(63, 0);
				graphics.lineTo(63, 63);
				graphics.lineTo(0, 63);
				graphics.lineTo(0, 0);
				graphics.endFill();
				graphics.zIndex = 9998;
				graphics.position.set(point.x * 64 - 64, point.y * 64 - 64);
				sg2d.viewport.addChild(graphics);
			}
		} else {
			if (this._temp112) {
				for (var p in this._temp112) {
					sg2d.viewport.removeChild(this._temp112[p]);
				}
			}
			this._temp112 = void 0;
		}

		// Static coordinate labels along the axes
		// TODO: сделать динамический перерасчет position существующих Text-объектов, что бы координаты всегда были на виду по краям камеры?
		if (sg2d_consts.CAMERA.DEBUGGING.SHOW.AXIS_LABELS) {
			if (! this._temp115) {
				this._temp115 = [];
				for (var x = 1; x <= clusters.width; x++) {
					var cluster = clusters.getCluster(x, 1);
					if (! cluster) continue;
					var text = new PIXI.Text(x, {fontFamily : 'Arial', fontSize: 12, fill : 0xffffff, align : 'center'});
					text.position.x = cluster.position.x;
					text.position.y = cluster.position.y - sg2d_consts.CELLSIZEPIX;
					text.angle = -camera.rotate_adjustment;
					text.zIndex = 9999;
					this._temp115.push(text);
					sg2d.viewport.addChild(text);
				}
				for (var y = 1; y <= clusters.height; y++) {
					var cluster = clusters.getCluster(1, y);
					if (! cluster) continue;
					var text = new PIXI.Text(y, {fontFamily : 'Arial', fontSize: 12, fill : 0xffffff, align : 'center'});
					text.position.x = cluster.position.x - sg2d_consts.CELLSIZEPIX;
					text.position.y = cluster.position.y;
					text.angle = -camera.rotate_adjustment;
					text.zIndex = 9999;
					this._temp115.push(text);
					sg2d.viewport.addChild(text);
				}
			} else {
				var rotate = camera.properties.rotate - camera.rotate_adjustment;
				for (var i = 0; i < this._temp115.length; i++) {
					this._temp115[i].angle = rotate;
				}
			}
		} else {
			if (this._temp115) {
				for (var p in this._temp115) {
					sg2d.viewport.removeChild(this._temp115[p]);
				}
			}
			this._temp115 = void 0;
		}
	},
	
	drawDebug2: function() {
		
		let sg2d = sg2d_application_SG2DApplication.getInstance();
		let camera = sg2d.camera;
		
		if (sg2d_consts.CAMERA.DEBUGGING.SHOW.CLUSTERS_IN_OUT) {
			if (! this._temp113) this._temp113 = [];
			for (var i = 0; i < this._temp113.length; i++) sg2d.viewport.removeChild(this._temp113[i]);
			this._temp113.length = 0;
			for (var i = 0; i < camera.clustersIn.length; i++) {
				var graphics = new PIXI.Graphics();
				graphics.lineStyle(2, 0xFF0000, 1);
				var cluster = camera.clustersIn[i];
				graphics.moveTo(0, 0);
				graphics.lineTo(63, 0);
				graphics.lineTo(63, 63);
				graphics.lineTo(0, 63);
				graphics.lineTo(0, 0);
				graphics.endFill();
				graphics.zIndex = 9998;
				graphics.position.set(cluster.x * 64 - 64, cluster.y * 64 - 64);
				sg2d.viewport.addChild(graphics);
				this._temp113.push(graphics);
			}
			for (var i = 0; i < camera.clustersOut.length; i++) {
				var graphics = new PIXI.Graphics();
				graphics.lineStyle(2, 0x4466FF, 1);
				var cluster = camera.clustersOut[i];
				graphics.moveTo(0, 0);
				graphics.lineTo(63, 0);
				graphics.lineTo(63, 63);
				graphics.lineTo(0, 63);
				graphics.lineTo(0, 0);
				graphics.endFill();
				graphics.zIndex = 9998;
				graphics.position.set(cluster.x * 64 - 64, cluster.y * 64 - 64);
				sg2d.viewport.addChild(graphics);
				this._temp113.push(graphics);
			}
		} else {
			if (this._temp113) {
				for (var p in this._temp113) {
					sg2d.viewport.removeChild(this._temp113[p]);
				}
			}
			this._temp113 = void 0;
		}
	},
	
	/** @private */
	_bodiesDrawed: new Set(),
	
	drawSG2DBodyLines: function(tile) {
		if (tile && tile.body && tile.body.vertices && tile.body.vertices.length) {
			if (! this._bodiesDrawed.has(tile.body)) {
				this._bodiesDrawed.add(tile.body);
				
				var parts = tile.body.parts;
				var graphics = tile.body._sg2dLines = (parts.length === 1 ? new PIXI.Graphics() : new PIXI.Container());
				
				for (var i = parts.length === 1 ? 0 : 1; i < parts.length; i++) {
					var body = parts[i];
					var g = (parts.length === 1 ? graphics : (g = new PIXI.Graphics(), graphics.addChild(g), g));
					g.lineStyle(2, 0xffffff, 1);
					g.moveTo(body.vertices[0].x - body.position.x, body.vertices[0].y - body.position.y);
					for (var j = 0; j < body.vertices.length; j++) g.lineTo(body.vertices[j].x - body.position.x, body.vertices[j].y - body.position.y);
					g.lineTo(body.vertices[0].x - body.position.x, body.vertices[0].y - body.position.y);
					g.endFill();
					g.x = body.position.x - tile.body.position.x;
					g.y = body.position.y - tile.body.position.y;
				}
				graphics.x = tile.body.position.x;
				graphics.y = tile.body.position.y;
				graphics.angle_init = tile.body.angle;
				graphics.zIndex = 9998;
				let sg2d = sg2d_application_SG2DApplication.getInstance();
				sg2d.viewport.addChild(graphics);
			}
		}
	},
	
	undrawSG2DBodyLines: function(tile) {
		if (tile && tile.body && this._bodiesDrawed.has(tile.body)) {
			let sg2d = sg2d_application_SG2DApplication.getInstance();
			sg2d.viewport.removeChild(tile.body._sg2dLines);
			this._bodiesDrawed.delete(tile.body);
		}
	},
	
	redrawSG2DBodiesLines: function() {
		for (var body of this._bodiesDrawed) {
			if (body.removed) {
				let sg2d = sg2d_application_SG2DApplication.getInstance();
				sg2d.viewport.removeChild(body._sg2dLines);
				this._bodiesDrawed.delete(body);
				continue;
			}
			if (body.isStatic) continue;
			body._sg2dLines.x = body.position.x;
			body._sg2dLines.y = body.position.y;
			body._sg2dLines.angle = (body.angle - body._sg2dLines.angle_init) / sg2d_math.PI180;
		}
	},
	
	clear: function() {
		this._bodiesDrawed.clear();
	}
};

/* harmony default export */ var sg2d_debugging = (SG2DDebugging);
// CONCATENATED MODULE: ./src/sg2d-camera.js
/**
 * SG2DCamera
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */








class sg2d_camera_SG2DCamera extends sg_model["a" /* default */] {
		
	defaults() {
		return {
			scale: sg2d_camera_SG2DCamera.SCALE_NORMAL, // Scaling, for example: 16 -> 128px (200%), ..., 9 -> 72px (112%),  8 -> 64px (100%), 7 -> 56px, 6 -> 48px, 5 -> 40px, 4 -> 32px, 3 -> 24px, 2 -> 16px, 1-> 8px (12.5%)
			rotation: false,
			rotate: 0, // grad
			position: {x: 0, y: 0}, // current camera position
			target: {x: 0, y: 0}, // camera movement target
			offset: {x: 0, y: 0},
			wh: {w: 0, h: 0},
			wh05: {w: 0, h: 0},
			boundsPX: { left: 0, top: 0, right: 0, bottom: 0 },
			boundsCluster: { left: 0, top: 0, right: 0, bottom: 0 },
			frameCVC: 0, // frameChangeVisibleClusters - Changing this property means that some new clusters have appeared in the camera view, or some have disappeared
			scale_wheel: true, // scale with scrolling
			scale_min: sg2d_camera_SG2DCamera.SCALE_MIN,
			scale_max: sg2d_camera_SG2DCamera.SCALE_MAX,
			pointer_over_canvas: true,
			movement_by_pointer: 0,
			movement_state: 0
		};
	}
	
	/**
	 * Config parameters and default values:
	 * @param {object} properties
	 * @param {boolean}	[properties.scale_wheel=true] Allow camera zoom
	 * @param {number}		[scale=8] Start scale
	 * @param {boolean}	[rotation=true] Allow camera rotation
	 * @param {number}		[rotate=0] Start camera rotation
	 * @param {object}		[start_position={ x: 0, y: 0}] Start position
	 * @param {number}		[rotate_adjustment=0] Basic offset of the camera angle in degrees
	 * @param {boolean}	[movement_by_pointer=0] Allow free movement of the camera with the right mouse button
	 */
	initialize(properties) {
		
		let config = properties || {};
		config.scale_wheel = typeof config.scale_wheel !== "undefined" ? config.scale_wheel : true;
		config.scale = +config.scale || sg2d_camera_SG2DCamera.SCALE_NORMAL;
		config.rotation = !!config.rotation || false;
		config.rotate = +config.rotate || 0;
		config.position = config.position || null;
		config.rotate_adjustment = +config.rotate_adjustment || sg2d_camera_SG2DCamera.ROTATE_ADJUSTMENT;
		config.movement_by_pointer = +config.movement_by_pointer;
		
		this.rotate_adjustment = config.rotate_adjustment;
		this.browser_scale_start = window.devicePixelRatio ? window.devicePixelRatio : window.outerWidth/window.innerWidth;
		this.set("scale_min", +config.scale_min || sg2d_camera_SG2DCamera.SCALE_MIN);
		this.set("scale_max", +config.scale_max || sg2d_camera_SG2DCamera.SCALE_MAX);
		
		this.scales_k = [];
		this.scales_per = [];
		var k = 1, p = 100, k_step = 1.00;
		for (var i = sg2d_camera_SG2DCamera.SCALE_NORMAL; i <= this.properties.scale_max; i++) {
			this.scales_k[i] = k;
			this.scales_per[i] = ~~p;
			k += 0.125 * k_step;
			p += 12.5 * k_step;
		}
		var k = 1, p = 100;
		for (var i = sg2d_camera_SG2DCamera.SCALE_NORMAL; i >= this.properties.scale_min; i--) {
			this.scales_k[i] = k;
			this.scales_per[i] = ~~p;
			k -= 0.125 * k_step;
			p -= 12.5 * k_step;
		}
		
		this.positionPrev = {
			x: this.properties.position.x,
			y: this.properties.position.y
		};
		this.frame_lighting = 1;
		this.boundsClusterPrev = null;
		this.clustersInCamera = new Set();
		
		// Visible part of the area in PX units
		this.boundsPXTops = { // The vertices of the rectangle are calculated with camera rotation and scaling
			leftTop: {x:0,y:0},
			rightTop: {x:0,y:0},
			rightBottom: {x:0,y:0},
			leftBottom: {x:0,y:0}
		};
		// Visible part of the area in Cells units
		this.boundsClusterTops = { // The vertices of the rectangle are calculated with camera rotation and scaling
			leftTop: {x:0,y:0},
			rightTop: {x:0,y:0},
			rightBottom: {x:0,y:0},
			leftBottom: {x:0,y:0}
		};
		
		this.clustersOut = []; // Clusters that disappeared from the camera view
		this.clustersIn = []; // Clusters that appeared in the camera view
		
		this._addLinePoint = this._addLinePoint.bind(this);
		
		this.onPointerEnter = this.onPointerEnter.bind(this);
		this.onPointerLeave = this.onPointerLeave.bind(this);
		
		this.onWheelScale = this.onWheelScale.bind(this);
		if (this.properties.scale_wheel) {
			this._onwheel(this.onWheelScale);
		}
		
		// Boundaries of the visible part in Cells units (all points of 4 solid lines formed by boundsCluster vertices)
		this.boundsPoint = [];
		this.on("wh", (wh)=>{
			var q = ~~((wh.w + wh.h) / sg2d_consts.CELLSIZEPIX * 4);
			for (var i = 0; i < q; i++) this.boundsPoint[i] = {x: 0, y: 0}; // so as not to spawn objects every time!
		});
		
		this.set("scale_wheel", config.scale_wheel);
		this.set("scale", config.scale);
		this.set("rotation", config.rotation);
		
		this.on("frameCVC", sg2d_debugging.drawDebug2);
		
		this.set("movement_by_pointer", config.movement_by_pointer);
		
		this._followToTile = null;
	}
	
	/** @private */
	_sg2dconnect(sg2d) {
		this.sg2d = sg2d;
		this.onResize();
		this.sg2d.pixi.view.addEventListener("pointerenter", this.onPointerEnter);
		this.sg2d.pixi.view.addEventListener("pointerleave", this.onPointerLeave);
		this.set("rotate", this.properties.rotate);
		this.sg2d.viewport.angle = -this.properties.rotate + this.rotate_adjustment;
		this.startPosition(this.properties.position || null);
		this._calc();
	}
	
	/** Own setter for rotate property*/
	setRotate(newRotate, options, flags = 0) {
		if (! this.properties.rotation && ! (flags & sg_model["a" /* default */].FLAG_FORCE_CALLBACKS)) return; //?
		newRotate = sg2d_math.normalize_a(newRotate, 1);
		let prevRotate = this.properties.rotate;
		if (this.set("rotate", newRotate, options, flags | sg_model["a" /* default */].FLAG_IGNORE_OWN_SETTER)) {
			this.sg2d.viewport.angle = -this.properties.rotate + this.rotate_adjustment;
			let da = sg2d_math.normalize_a(newRotate - prevRotate);
			let dx = this.properties.offset.x;
			let dy = this.properties.offset.y;
			sg2d_camera_SG2DCamera._point.x = dx * sg2d_math.cos(da, 1) - dy * sg2d_math.sin(da, 1);
			sg2d_camera_SG2DCamera._point.y = dy * sg2d_math.cos(da, 1) + dx * sg2d_math.sin(da, 1);
			this.set("offset", sg2d_camera_SG2DCamera._point);
			this._calc();
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Set the starting position of the camera
	 */
	startPosition(position) {
		this.moveTo(position, true);
	}
	
	/** Own setter for position property*/
	setPosition(value, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		value = value || this.positionPrev;
		options = ! options ||  options === sg_model["a" /* default */].OBJECT_EMPTY ? sg_model["a" /* default */].OPTIONS_PRECISION_5 : options;
		options.precision = options.precision || 5;
		
		if (! this.set("position", value, options, flags | sg_model["a" /* default */].FLAG_IGNORE_OWN_SETTER)) return false;
		
		this._calc();
		
		return true;
	}
	
	/** @private */
	_calc() {
		
		this.sg2d.viewport.x = (this.sg2d.pixi.screen.width  || 100) / 2;
		this.sg2d.viewport.y = (this.sg2d.pixi.screen.height || 100) / 2;
		this.sg2d.viewport.pivot.x = this.properties.position.x;
		this.sg2d.viewport.pivot.y = this.properties.position.y;
		
		var x = this.properties.position.x
		var y = this.properties.position.y
		var acos = sg2d_math.cos(this.properties.rotate, 1), asin = sg2d_math.sin(this.properties.rotate, 1);
		var w05 = this.properties.wh05.w * sg2d_consts.CAMERA.WIDTH_HEIGHT_K;
		var h05 = this.properties.wh05.h * sg2d_consts.CAMERA.WIDTH_HEIGHT_K;
		var bpx = this.boundsPXTops;
		var bc = this.boundsClusterTops;
		
		// boundsPXTops calc
		bpx.leftTop.x = Math.round(x - w05 * acos + h05 * asin);
		bpx.leftTop.y = Math.round(y - w05 * asin - h05 * acos);
		bpx.rightTop.x = Math.round(x + w05 * acos + h05 * asin);
		bpx.rightTop.y = Math.round(y + w05 * asin - h05 * acos);
		bpx.rightBottom.x = Math.round(x + w05 * acos - h05 * asin);
		bpx.rightBottom.y = Math.round(y + w05 * asin + h05 * acos);
		bpx.leftBottom.x = Math.round(x - w05 * acos - h05 * asin);
		bpx.leftBottom.y = Math.round(y - w05 * asin + h05 * acos);
		
		// boundsPX calc
		var boundsPX = sg2d_camera_SG2DCamera._boundsPX;
		boundsPX.left = boundsPX.top = boundsPX.right = boundsPX.bottom = void 0;
		for (var p in bpx) {
			var o = bpx[p];
			if (boundsPX.left === void 0) boundsPX.left = o.x; else if (boundsPX.left > o.x) boundsPX.left = o.x;
			if (boundsPX.top === void 0) boundsPX.top = o.y; else if (boundsPX.top > o.y) boundsPX.top = o.y;
			if (boundsPX.right === void 0) boundsPX.right = o.x; else if (boundsPX.right < o.x) boundsPX.right = o.x;
			if (boundsPX.bottom === void 0) boundsPX.bottom = o.y; else if (boundsPX.bottom < o.y) boundsPX.bottom = o.y;
		}
		var bChangeBoundsPX = false;
		for (var p in this.properties.boundsPX) {
			if (boundsPX[p] !== this.properties.boundsPX[p]) bChangeBoundsPX = true;
			this.properties.boundsPX[p] = boundsPX[p];
		}
		
		// boundsCluster calc
		var boundsCluster = sg2d_camera_SG2DCamera._boundsCluster;
		boundsCluster.left = Math.floor( 1 + boundsPX.left / sg2d_consts.CELLSIZEPIX );
		boundsCluster.top = Math.floor( 1 + boundsPX.top / sg2d_consts.CELLSIZEPIX );
		boundsCluster.right = Math.floor( 1 + boundsPX.right / sg2d_consts.CELLSIZEPIX );
		boundsCluster.bottom = Math.floor( 1 + boundsPX.bottom / sg2d_consts.CELLSIZEPIX );
		var bChangeBoundsCluster = false;
		for (var p in boundsCluster) {
			if (boundsCluster[p] !== this.properties.boundsCluster[p]) bChangeBoundsCluster = true;
			this.properties.boundsCluster[p] = boundsCluster[p];
		}
		
		if (! this.boundsClusterPrev) {
			this.boundsClusterPrev = {
				left: this.properties.boundsCluster.left,
				top: this.properties.boundsCluster.top,
				right: this.properties.boundsCluster.right,
				bottom: this.properties.boundsCluster.bottom
			}
		}
		
		// boundsClusterTops calc - step 1
		bc.leftTop.x = 0.5 + bpx.leftTop.x / sg2d_consts.CELLSIZEPIX;
		bc.leftTop.y = 0.5 + bpx.leftTop.y / sg2d_consts.CELLSIZEPIX;
		bc.rightTop.x = 0.5 + bpx.rightTop.x / sg2d_consts.CELLSIZEPIX;
		bc.rightTop.y = 0.5 + bpx.rightTop.y / sg2d_consts.CELLSIZEPIX;
		bc.rightBottom.x = 0.5 + bpx.rightBottom.x / sg2d_consts.CELLSIZEPIX;
		bc.rightBottom.y = 0.5 + bpx.rightBottom.y / sg2d_consts.CELLSIZEPIX;
		bc.leftBottom.x = 0.5 + bpx.leftBottom.x / sg2d_consts.CELLSIZEPIX;
		bc.leftBottom.y = 0.5 + bpx.leftBottom.y / sg2d_consts.CELLSIZEPIX;
		
		// Calc line points
		this.boundsPoint._length = -1;
		sg2d_math.getLinePoints(bc.leftTop, bc.rightTop, this._addLinePoint);
		sg2d_math.getLinePoints(bc.rightTop, bc.rightBottom, this._addLinePoint);
		sg2d_math.getLinePoints(bc.rightBottom, bc.leftBottom, this._addLinePoint);
		sg2d_math.getLinePoints(bc.leftBottom, bc.leftTop, this._addLinePoint);
		this.boundsPoint._length++;
		
		// calculate visible clusters
		var cluster, x ,y, x1, x2, state;
		var frame_lighting_prev = this.frame_lighting++;
		var frame_lighting = this.frame_lighting;
		this.clustersOut.length = 0;
		this.clustersIn.length = 0;

		for (var i = 0; i < this.boundsPoint._length; i++) {
			var p = this.boundsPoint[i];
			if (cluster = this.sg2d.clusters.getCluster(p.x, p.y)) {
				if (cluster.lighting_frame === 0) {
					this.clustersIn.push(cluster);
					this.clustersInCamera.add(cluster);
				}
				cluster.lighting_frame = frame_lighting;
			}
		}
		
		var x_min = Math.min(this.boundsClusterPrev.left, this.properties.boundsCluster.left);
		var y_min = Math.min(this.boundsClusterPrev.top, this.properties.boundsCluster.top);
		var x_max = Math.max(this.boundsClusterPrev.right, this.properties.boundsCluster.right);
		var y_max = Math.max(this.boundsClusterPrev.bottom, this.properties.boundsCluster.bottom);
		
		for (y = y_min; y <= y_max; y++) {
			state = 0;
			x1 = 0;
			x2 = 0;
			for (x = x_min; x <= x_max; x++) {
				if (cluster = this.sg2d.clusters.getCluster(x, y)) {
					switch (state) {
						case 0: { // Finding the first cluster with frame_lighting
							switch (cluster.lighting_frame) {
								case 0: break;
								case frame_lighting_prev: {
									this.clustersOut.push(cluster);
									this.clustersInCamera.delete(cluster);
									cluster.lighting_frame = 0;
									break;
								}
								case frame_lighting: {
									state = 1;
									x1 = x;
									x2 = x1;
									break;
								}
								default:
									debugger; throw "Error!";
							}
							break;
						}
						case 1: { // Finding the last cluster with frame lighting
							switch (cluster.lighting_frame) {
								case 0: case frame_lighting_prev: {
									break;
								}
								case frame_lighting: {
									x2 = x;
									break;
								}
								default: 
									console.log("cluster.lighting_frame=" + cluster.lighting_frame);
									debugger; throw "Error!";
							}
							break;
						}
					}
				}
			}
			if (x1 && x2) {
				for (var x = x1; x <= x2; x++) {
					if (cluster = this.sg2d.clusters.getCluster(x, y)) {
						if (cluster.lighting_frame === 0) {
							this.clustersIn.push(cluster);
							this.clustersInCamera.add(cluster);
						}
						cluster.lighting_frame = frame_lighting;
					}
				}
				for (var x = x2 + 1; x <= x_max; x++) {
					if (cluster = this.sg2d.clusters.getCluster(x, y)) {
						if (cluster.lighting_frame === frame_lighting_prev) {
							this.clustersOut.push(cluster);
							this.clustersInCamera.delete(cluster);
						} //else break; // if left, sometimes the error in state=1 => cluster.lighting_frame is older than it could be!
						cluster.lighting_frame = 0;
					}
				}
			}
		}
		if (this.clustersOut.length || this.clustersIn.length) {
			this.set("frameCVC", this.properties.frameCVC+1);
			for (var i = 0; i < this.clustersOut.length; i++) {
				this.clustersOut[i].outCamera();
			}
			for (var i = 0; i < this.clustersIn.length; i++) {
				this.clustersIn[i].inCamera();
			}
		}
		
		// boundsClusterTops calc - step 2
		for (var p in bc) {
			bc[p].x = Math.floor(0.5 + bc[p].x);
			bc[p].y = Math.floor(0.5 + bc[p].y);
		}
		
		sg2d_debugging.drawDebug();
		
		this.positionPrev.x = this.properties.position.x;
		this.positionPrev.y = this.properties.position.y;
		
		this.boundsClusterPrev.left = this.properties.boundsCluster.left;
		this.boundsClusterPrev.top = this.properties.boundsCluster.top;
		this.boundsClusterPrev.right = this.properties.boundsCluster.right;
		this.boundsClusterPrev.bottom = this.properties.boundsCluster.bottom;
		
		if (bChangeBoundsPX) this.trigger("boundsPX");
		if (bChangeBoundsCluster) this.trigger("boundsCluster");
	}
	
	/**
	 * Tile that the camera will follow
	 */
	followTo(tile) {
		this._followToTile = tile;
	}
	
	stopFollow() {
		this._followToTile = null;
	}
	
	getFollow() {
		return this._followToTile;
	}
	
	/**
	 * Smoothly move the camera to position
	 * @param {object|number, number} point
	 * @param {boolean} [flag=false] Move instantly (true) or smoothly (false)
	 */
	moveTo() {
		if (typeof arguments[0] === "object") {
			this.set("target", arguments[0], sg_model["a" /* default */].OPTIONS_PRECISION_5);
			if (arguments[1] === true) {
				this.set("position", arguments[0], sg_model["a" /* default */].OPTIONS_PRECISION_5);
			}
		} else {
			sg2d_camera_SG2DCamera._moveToTarget.x = arguments[0];
			sg2d_camera_SG2DCamera._moveToTarget.y = arguments[1];
			this.set("target", sg2d_camera_SG2DCamera._moveToTarget, sg_model["a" /* default */].OPTIONS_PRECISION_5);
			if (arguments[2] === true) {
				this.set("position", sg2d_camera_SG2DCamera._moveToTarget, sg_model["a" /* default */].OPTIONS_PRECISION_5);
			}
		}
	}
											
	moveOffset(step = sg2d_consts.CELLSIZEPIX, rotate = 0) {
		let k = this.scales_k[this.properties.scale];
		let d = step / k;
		rotate = rotate - this.properties.rotate + this.rotate_adjustment;
		sg2d_camera_SG2DCamera._point.x = this.properties.offset.x + d * sg2d_math.cos(rotate, 1);
		sg2d_camera_SG2DCamera._point.y = this.properties.offset.y - d * sg2d_math.sin(rotate, 1);
		this.set("offset", sg2d_camera_SG2DCamera._point);
	}
	
	onResize() {
		var browser_scale = window.devicePixelRatio ? window.devicePixelRatio : window.outerWidth/window.innerWidth; // ignoring browser scaling
		var k = this.scales_k[this.properties.scale] * this.browser_scale_start / browser_scale;
		this.sg2d.viewport.scale.set(k);
		if (this.rotate_adjustment === 0 || this.rotate_adjustment === 180 || this.rotate_adjustment === -180) {
			this.set("wh", {w: (this.sg2d.pixi.screen.width || 100) / k, h: (this.sg2d.pixi.screen.height || 100) / k});
		} else {
			this.set("wh", {w: (this.sg2d.pixi.screen.height || 100) / k, h: (this.sg2d.pixi.screen.width || 100) / k});
		}
		this.set("wh05", {w: this.properties.wh.w>>1, h: this.properties.wh.h>>1});
		
		this.set("position", void 0, void 0, sg2d_camera_SG2DCamera.FLAG_FORCE_CALLBACKS);
	}
	
	/** @private */
	_iterate() {
		if (this._followToTile) {
			sg2d_camera_SG2DCamera._point.x = this._followToTile.properties.position.x + this.properties.offset.x;
			sg2d_camera_SG2DCamera._point.y = this._followToTile.properties.position.y + this.properties.offset.y;
			this.set("target", sg2d_camera_SG2DCamera._point);
		}	
		if (this.properties.target.x !== this.properties.position.x || this.properties.target.y !== this.properties.position.y) {
			sg2d_camera_SG2DCamera._point.x = this.properties.position.x + sg2d_camera_SG2DCamera.SMOOTHNESS_FACTOR * (this.properties.target.x - this.properties.position.x);
			sg2d_camera_SG2DCamera._point.y = this.properties.position.y + sg2d_camera_SG2DCamera.SMOOTHNESS_FACTOR * (this.properties.target.y - this.properties.position.y);
			//SG2DCamera._point.x = this.properties.target.x; SG2DCamera._point.y = this.properties.target.y; // TODO DEL DEBUG
			this.set("position", sg2d_camera_SG2DCamera._point);
		}
	}
	
	onPointerEnter(e) {
		this.set("pointer_over_canvas", true);
	}
	
	onPointerLeave(e) {
		this.set("pointer_over_canvas", false);
	}
	
	onWheelScale(e) {
		if (! this.properties.pointer_over_canvas) return;
		var delta = e.deltaY || e.detail || e.wheelDelta;
		this.zoomInc(delta < 0 ? 1 : -1);
	}
	
	zoom(scale = sg2d_camera_SG2DCamera.SCALE_NORMAL) {
		scale = Math.max(this.properties.scale_min, scale);
		scale = Math.min(this.properties.scale_max, scale);
		this.set("scale", scale);
		this.onResize();
	}
	
	zoomInc(scaleIncrement = 1) {
		var scale_next = this.properties.scale + scaleIncrement;
		scale_next = Math.max(this.properties.scale_min, scale_next);
		scale_next = Math.min(this.properties.scale_max, scale_next);
		this.set("scale", scale_next);
		this.onResize();
	}
	
	/** @public */
	getScale() {
		return {
			value: this.properties.scale,
			percent: this.scales_per[this.properties.scale],
			k: this.scales_k[this.properties.scale]
		};
	}
	
	/** @private */
	_addLinePoint(x, y) { // Used in Math.GetLinePoints (..) as a callback
		var p = this.boundsPoint[++this.boundsPoint._length];
		p.x = (x < 1 ? 1 : (x > sg2d_consts.AREASIZE ? sg2d_consts.AREASIZE : x));
		p.y = (y < 1 ? 1 : (y > sg2d_consts.AREASIZE ? sg2d_consts.AREASIZE : y));
	}
	
	_onwheel(fCallback, e) {
		if (! e) e = window;
		if ("onwheel" in document) {
			e.addEventListener("wheel", fCallback); // IE9+, FF17+, Ch31+
		} else if ("onmousewheel" in document) {
			e.addEventListener("mousewheel", fCallback); // obsolete version of the event
		} else {
			e.addEventListener("MozMousePixelScroll", fCallback); // Firefox < 17
		}
	}
	_offwheel(fCallback, e) {
		if (! e) e = window;
		e.removeEventListener("wheel", fCallback);
		e.removeEventListener("onmousewheel", fCallback);
		e.removeEventListener("mousewheel", fCallback);
		e.removeEventListener("MozMousePixelScroll", fCallback);
	}
	
	destroy() {
		this.sg2d.pixi.view.removeEventListener("pointerenter", this.onPointerEnter);
		this.sg2d.pixi.view.removeEventListener("pointerleave", this.onPointerLeave);
		this._offwheel(this.onWheelScale);
		super.destroy();
	}
}

sg2d_camera_SG2DCamera.singleInstance = true;

sg2d_camera_SG2DCamera.ROTATE_ADJUSTMENT = 0; // default

sg2d_camera_SG2DCamera.SCALE_MIN = 2;
sg2d_camera_SG2DCamera.SCALE_NORMAL = 8;
sg2d_camera_SG2DCamera.SCALE_MAX = 10;

sg2d_camera_SG2DCamera.MOVEMENT_BY_POINTER = 0b00000001;
sg2d_camera_SG2DCamera.MOVEMENT_BY_POINTER_LEFT = 0b00000001;
sg2d_camera_SG2DCamera.MOVEMENT_BY_POINTER_RIGHT = 0b00000010;
sg2d_camera_SG2DCamera.MOVEMENT_BY_POINTER_MIDDLE = 0b00000100;

sg2d_camera_SG2DCamera.STATE_NO_MOVEMENT = 0;
sg2d_camera_SG2DCamera.STATE_MOVEMENT_WAITING_SHIFT = 1;
sg2d_camera_SG2DCamera.STATE_MOVING = 2;

/**
 * Camera smoothness factor
 * @public
 */
sg2d_camera_SG2DCamera.SMOOTHNESS_FACTOR = 0.25;

sg2d_camera_SG2DCamera.typeProperties = {
	rotate: sg_model["a" /* default */].TYPE_NUMBER,
	rotation: sg_model["a" /* default */].TYPE_BOOLEAN,
	position: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	target: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	offset: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	wh: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	wh05: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	boundsPX: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	boundsCluster: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS
};

sg2d_camera_SG2DCamera.ownSetters = {
	rotate: true,
	position: true
};

/** @public */
sg2d_camera_SG2DCamera.moveTo = function(...args) {
	sg2d_camera_SG2DCamera.getInstance().moveTo.apply(sg2d_camera_SG2DCamera.getInstance(), ...args);
}

sg2d_camera_SG2DCamera.scaling = function(params) {
	if (sg2d_camera_SG2DCamera.getInstance().properties.scale_wheel) {
		sg2d_camera_SG2DCamera.getInstance().onWheelScale({deltaY: params.action === "-" ? 1 : -1});
	}
}

/** @private */
sg2d_camera_SG2DCamera._point = {x: void 0, y: void 0};

/** @private */
sg2d_camera_SG2DCamera._boundsPX = {};

/** @private */
sg2d_camera_SG2DCamera._boundsCluster = {};

/** @private */
sg2d_camera_SG2DCamera._moveToTarget = {x: 0, y: 0};
// CONCATENATED MODULE: ./src/sg2d-sound.js
/**
 * SG2DSound
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */








/** @private */
function _SG2DSound() {
	
	Object.assign(this, new sg_model["a" /* default */]({
		music: true,
		musicVolume: 100, // from 0 to 100
		sounds: true,
		soundsVolume: 100, // from 0 to 100
		bass: false,
		muteOnLossFocus: true,
		volumeDecreaseDistance: 10, // Units changes in clusters. Distance at which the sound can no longer be heard. If value is 0, sound does not subside with increasing distance
		environment2D: true,
		view: "", // Current view code
		_focusLoss: false // global mute when focus loss browser
	}));
	
	this.sounds = {};
	this.musics = {}; // flat list of all music ([] * PIXI.sound.Sound)
	this.music_views = {}; // Views and list music
	this.music_view = null; // Current view object
	
	/** @protected */
	this.bass = void 0;
	
	/** @private */
	this._options = {
		config: void 0,
		music_dir:  void 0,
		sounds_dir: void 0,
		library_pathfile: void 0
	};
	
	/** @private */
	this._initializationRunned = false;
	
	/** @private */
	this._gestureDetected = false;
	
	/**
	 * Sound library loader and parameter setter
	 * @param {object}		[options={}]
	 * @param {object|string}	[options.config="./res/sound.json"]
	 * @param {string}			[options.music_dir="./res/music/"]
	 * @param {string}			[options.sounds_dir="./res/sounds/"]
	 * @param {string}			[options.library_pathfile="./libs/pixi/pixi-sound.js"]
	 * @param {object}		[properties={}]
	 * @param {boolean}		[properties.sounds=true]
	 * @param {boolean}		[properties.music=true]
	 * @param {number}			[properties.musicVolume=100]
	 * @param {number}			[properties.soundsVolume=100]
	 * @param {boolean}		[properties.muteOnLossFocus=true]
	 * @param {number}			[properties.volumeDecreaseDistance=0]
	 * @param {boolean}		[properties.environment2D=true]
	 * @param {boolean}		[properties.bass=false]
	 */
	this.load = (options = {}, properties = {})=>{
		
		if (typeof window === "undefined" || window.document === void 0) {
			console.error("Error in SG2D.Sound.load()! window.document is not set!");
			return;
		}
		
		let promise;
		
		this._options.config = options.config;
		this._options.music_dir = options.music_dir || this._options.music_dir || "./res/music/";
		this._options.sounds_dir = options.sounds_dir || this._options.sounds_dir || "./res/sounds/";
		this._options.library_pathfile = options.library_pathfile || this._options.library_pathfile || "./libs/pixi/pixi-sound.js";
		
		for (var p in properties) this.set(p, properties[p]);
		
		if (! this._initializationRunned) {
			this._initializationRunned = true;
			
			this.onEndMusic = this._onEndMusic.bind(this);
			this.visibilityChange = this._visibilityChange.bind(this);
			document.addEventListener("visibilitychange", this._visibilityChange);
			
			this.on("music", (music)=>{
				if (music) {
					this.musicResume();
				} else {
					this.musicPause();
				}
			});
			
			this.on("musicVolume", (musicVolume)=>{
				if (this.music_view && this.music_view.instance) {
					this.music_view.instance.volume = musicVolume / 100;
				}
			});
			
			this.on("view", (view)=>{
				this.musicPlay(view);
			});
			
			promise = new Promise((resolve, reject)=>{
				if (this._gestureDetected) {
					this._libraryLoad(options, resolve, reject);
				} else {
					let t = setInterval(()=>{
						if (this._gestureDetected) {
							clearInterval(t);
							this._libraryLoad(options, resolve, reject);
						}
					}, 100);
				}
			});
			
		} else if (this._options.config) {
			promise = new Promise((resolve, reject)=>{
				this.loadConfig(this._options.config, resolve, reject);
			});
		} else {
			promise = Promise.resolve();
		}
		
		return promise;
	};
	
	/** @private */
	this._libraryLoaded = false;
	
	/** @private */
	this._libraryLoad = (options = {}, resolve, reject)=>{
		
		let promise;
		
		if (! this._libraryLoaded) {
			this._libraryLoaded = true;
			
			promise = sg2d_utils.loadJS(this._options.library_pathfile, (event)=>{
				
				this.visibilityChange();
				
				this.bass = [
					new PIXI.sound.filters.ReverbFilter(1, 100),
					new PIXI.sound.filters.EqualizerFilter(13, 15, 6, -1, 0, 0, 0, 0, 0, 0)
				];
				
				if (options.config) {
					this.loadConfig(options.config, resolve, reject);
				} else {
					resolve();
				}
			});
			
			promise.catch(error=>{
				reject("Error in SG2D.Sound! See options.library_pathfile=\"" + this._options.library_pathfile + "\"!");
			});
		} else {
			promise = Promise.resolve();
		}
		
		return promise;
	};
	
	/** @private */
	this._sg2dconnect = (sg2d)=>{
		this.sg2d = sg2d;
	};
	
	this.loadConfig = (config, resolve, reject)=>{
		if (typeof config === "object") {
			this._parseConfig(config);
			resolve();
		} else if (typeof config === "string") {
			fetch(config).then(response=>{
				if (! response.ok) {
					let sError = "Error in SG2D.Sound! response.status="+response.status+". See config=\"" + config + "\"!";
					reject(sError);
					throw new Error(sError);
				} else {
					return response.json();
				}
			}).then(json=>{
				this._parseConfig.call(this, json);
				resolve();
			}).catch(error=>{
				reject("Error in SG2D.Sound! See config=\"" + config + "\"!");
				debugger; // TODO
			});
		}
	};
	
	/** @private */
	this._parseConfig = (json)=>{
		var temp, sound;
		if (json.sounds) {
			for (var name in json.sounds) {
				temp = json.sounds[name];
				this.sounds[name] = sound = typeof temp === "object" ? temp : { file: temp };
				sound.name = name;
				sound.sound = PIXI.sound.add(name, {
					autoPlay: false,
					preload: true,
					url: this._options.sounds_dir+sound.file,
					loaded: (err, sound)=>{
						if (err) {
							if (typeof sound !== "undefined") sound.isError = true;
							console.warn(''+err);
						}
					}
				});

				if (this.properties.bass) {
					sound.sound.filters = this.bass;
				}
			}
		}
		if (json.music) {
			for (let viewcode in json.music) {
				temp = json.music[viewcode];
				let list = typeof temp === "string" ? [temp] : (Array.isArray(temp) ? temp : []);
				let musics = [];
				for (var i = 0; i < list.length; i++) {
					musics[i] = this.musics[list[i]] = PIXI.sound.add(list[i], {
						autoPlay: false,
						preload: false,
						singleInstance: true,
						url: this._options.music_dir+list[i],
						loaded: (err, music)=>{
							if (err) {
								if (typeof music !== "undefined") music.isError = true;
								console.warn(''+err);
							} else {
								if (this.properties.view && this.properties.view === viewcode && ! this.music_view) {
									this.musicPlay(viewcode);
								}
							}
						},
						complete: (sound, b, c)=>{
							debugger;
						}
					});
				}
				this.music_views[viewcode] = {
					viewcode: viewcode, status: false,
					list: musics, current_index: 0,
					instance: null // Current music instance
				}
			}
		}
		
		if (this.properties.view && (! this.music_view || this.music_view.viewcode !== this.properties.view)) {
			this.musicPlay(this.properties.view);
		}
	};
	
	this._visibilityChange = ()=>{
		if (document.visibilityState === "visible") {
			this.set("_focusLoss", false);
			if (PIXI.sound) PIXI.sound.unmuteAll();
		} else {
			this.set("_focusLoss", true);
			if (PIXI.sound && this.properties.muteOnLossFocus) PIXI.sound.muteAll();
		}
	};
	
	/**
	 * Play music
	 * @param {string|bool}	[viewcode=true] - Page code or true value. If true, then the current music starts playing if it is not playing yet
	 * @param {object}		[options={}] - Options passed to the play() method, for example, sound volume, playback speed, start and end times
	 * @param {boolean}	[strict=false] - If the melody is not loaded, then the console will display an error
	 */
	this.musicPlay = (viewcode = true, options = {}, strict = false)=>{
		
		if (viewcode === true) {
			if (! this.music_view) return false;
		} else {
			if (this.music_view && this.music_view.viewcode === viewcode) {
				// no code
			} else {
				if (this.music_view) {
					this.music_view.instance && this.music_view.instance.destroy();
					this.music_view.instance = null;
					this.music_view.status = false;
				}
				this.music_view = this.music_views[viewcode];
			}
		}
		
		if (! this.music_view) {
			if (strict) console.error("SG2D.Sound Error! The music file may not have been loaded yet!");
			return false;
		}
		
		this.set("view", viewcode, void 0, sg_model["a" /* default */].FLAG_NO_CALLBACKS);
		
		this.music_view.status = true;
		
		if (! this.music_view.list.length) return false;
		
		if (this.properties.music && PIXI.sound) {
			
			options = sg_model["a" /* default */].defaults(options, {
				volume: this.properties.musicVolume / 100
			});
			
			if (this.music_view.instance) {
				if (this.music_view.instance.paused) {
					this.music_view.instance.paused = false;
				}
			} else {
			
				let music = this.music_view.list[this.music_view.current_index];
				if (music.isError) return false;

				if (this.properties.bass) music.filters = this.bass;

				let music_view = this.music_view;
				let result = music.play(options);
				if (typeof result.then === "function") {
					result.then((instance)=>{
						music_view.instance = instance;
						instance.on("end", this.onEndMusic);
						if (! music_view.status) music_view.instance.paused = true;
					});
				} else {
					music_view.instance = result;
					music_view.instance.on("end", this.onEndMusic);
				}
			}
		}
		return true;
	};
	
	/** @private */
	this._onEndMusic = (instance)=>{
		this.music_view.current_index++;
		if (this.music_view.current_index >= this.music_view.list.length) this.music_view.current_index = 0;
		this.music_view.instance = null;
		this.musicPlay();
	};
	
	this.musicPause = ()=>{
		if (this.music_view) {
			this.music_view.status = false;
			if (this.music_view.instance) {
				this.music_view.instance.paused = true;
			}
		}
	};
	
	this.musicResume = ()=>{
		this.musicPlay();
	};
	
	/** @private */
	this._sound = { file: "" };
	/** @private */
	this._config = {};
	
	/**
	 * Play sound
	 * @param {string|object} Sound name or base sound object from sounds.json
	 * @param {object} config_or_tile Sound settings overriding basic sounds.json or Tile instance
	 * @param {object} tile If a tile is specified, then position is taken from it to calculate the distance and sound volume
	 */
	this.play = (sound, config_or_tile = void 0, tile = void 0)=>{
		
		var instance = null;
		
		if (typeof sound === "string") {
			let name = sound;
			sound = this.sounds[name];
			if (! sound) this.sounds[name] = sound = { name: name, file: name + ".mp3" };
		}
		
		var config = SG2DSound._config;
		if (typeof config_or_tile === "object") {
			if (config_or_tile.constructor.isTile) {
				tile = config_or_tile;
			} else {
				config = config_or_tile;
			}
		}
		
		if (this.properties.sounds && PIXI.sound) {
			if (! sound.sound) return; // Sounds have not yet been loaded into loadLibAndSounds()
			if (! sound.sound.isLoaded) return false;
			
			var options = {};
			options.volume = (config.volume || sound.volume || 1) * this.properties.soundsVolume / 100;
			
			if (this.properties.volumeDecreaseDistance) {
				let camera = sg2d_camera_SG2DCamera.getInstance(true);
				if (tile && camera) {
					let maxd = this.properties.volumeDecreaseDistance * 64;
					let pp = camera.get("position");
					let tp = tile.get("position");
					let d = sg2d_math.distance_p(pp, tp);
					options.volume *= Math.max(0, 1 - d / maxd);
				}
				if (sg2d_camera_SG2DCamera.getInstance(true)) {
					options.volume = options.volume * sg2d_camera_SG2DCamera.get("scale") / sg2d_camera_SG2DCamera.SCALE_NORMAL;
				}
			}
			
			options.speed = config.speed || sound.speed || 1;
			options.start = config.start || sound.start || 0;
			if (config.end) options.end = config.end; else if (sound.end) options.end = sound.end;
			
			instance = sound.sound.play(options);
			
			if (tile) tile.sound_instance = instance;
			
			// 2D Environment
			if (this.properties.environment2D) {
				let camera = sg2d_camera_SG2DCamera.getInstance(true);
				if (tile && camera) {
					// TODO: PIXI.Sound does not currently support instance-level filters!
					//tile.sound.filters[0].pan = Math.min(1, Math.max(-1, 3*(dx - ppx)/visd));
					// START OF CRAWLER: // TODO are waiting for the official release, or you need to look at https://codepen.io/Rumyra/pen/qyMzqN/ or https://howlerjs.com/
					let pan = sg2d_math.sin( sg2d_math.angle_p1p2_deg(camera.get("position"), tile.get("position"), 0) - sg2d_camera_SG2DCamera.get("rotate") );
					//console.log("pan="+pan+", camera_rotate=" + ca +", pta="+pta);
					let panner = new StereoPannerNode(instance._source.context, {pan: pan});
					instance._source.connect(instance._gain).connect(panner).connect(instance._source.context.destination);
					// /END OF CRAWLER
				}
			}
		}
		
		return instance;
	};
	
	this.destroy = ()=>{
		document.removeEventListener("visibilitychange", this.visibilityChange);
	};
}

var SG2DSound = { EMPTY: true };

if (typeof window !== "undefined" && window.document) {
	let fKeyDown = event=>{
		if (event.keyCode === 20 || event.keyCode === 18 || event.keyCode === 17 || event.keyCode === 16) return; // CapsLock, Alt, Ctrl, Shift - these gesture keys are not read out and a warning arrives "WebAudioContext.ts:101 The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page. https://goo.gl/7K7WLu"
		document.removeEventListener("keydown", fKeyDown);
		document.removeEventListener("pointerup", fPointerUp);
		SG2DSound._gestureDetected = true;
	};

	let fPointerUp = event=>{
		document.removeEventListener("keydown", fKeyDown);
		document.removeEventListener("pointerup", fPointerUp);
		SG2DSound._gestureDetected = true;
	};

	document.addEventListener("keydown", fKeyDown);
	document.addEventListener("pointerup", fPointerUp);
	
	_SG2DSound.prototype = sg_model["a" /* default */].prototype;
	SG2DSound = new _SG2DSound();
}

/* harmony default export */ var sg2d_sound = (SG2DSound);
// CONCATENATED MODULE: ./src/sg2d-tile.js
/**
 * SG2DTile
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */













class sg2d_tile_SG2DTile extends sg_model["a" /* default */] {
	
	initialize(properties, thisProps, options) {
		
		// Crutch, since in JS there is no way to execute the code in the child class at the time of extends of the parent class
		this.constructor._prepareStaticConfigSprites();
		
		options = options || sg_model["a" /* default */].OBJECT_EMPTY;
		
		this.bounds = (this.body && this.body.bounds ? new SG2DBounds(this.body.bounds) : new SG2DBounds());
		this.boundsCXY = new SG2DBounds();
		this.clusters = new Set();
		this.centerCluster = null;
		this.sprite = void 0; // one or main sprite
		this.sprites = void 0; // list of sprites
		this.hasAnimations = false;
		
		if (! this.constructor.sprites) throw "Error 82423704! this.constructor.sprites must be filled!";
		
		this.sprites = sg_model["a" /* default */].clone(this.constructor.sprites);
		if (this.sprites.main) this.sprite = this.sprites.main;
		if (this.sprite) {
			this.sprite.texture = this.properties.texture !== void 0 ? this.properties.texture : this.constructor.sprites.main.texture;
			for (var p in sg2d_tile_SG2DTile._defaultSpriteValues) {
				if (properties[p] !== void 0) this.sprite[p] = properties[p];
			}
			if (this.properties.layer !== void 0) {
				this.sprite.layer = this.properties.layer;
			}
		}
		
		sg2d_utils.objectForEach(this.sprites, sprite=>{
			sprite._texture = sprite.texture;
			if (sprite.animation) {
				sprite.animation._count = sprite.animation.start || 1;
				sprite.animation._sleep = 1;
				if (sprite.animation.onComplete) sprite.animation.onComplete = sprite.animation.onComplete.bind(this);
				this.hasAnimations = true;
				this._animationIndex = 0; // tile can be in multiple clusters
			}
		});
		
		sg2d_clusters_SG2DClusters.tiles[this.properties.id] = this;
		sg2d_clusters_SG2DClusters.tilesset.add(this);
		
		this.onGeometric();
		this.drawUndraw();
	}
	
	/** Own setter for texture property*/
	setTexture(value = void 0, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		if (sg2d_consts.ONLY_LOGIC) return;
		this._setTileProperty("texture", value, options, flags);
	}
	
	/** Own setter for position property*/
	setPosition(value = void 0, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		if (this.set("position", value, options, flags | sg_model["a" /* default */].FLAG_IGNORE_OWN_SETTER)) {
			this.onGeometric();
			this.drawUndraw();
		}
	}
	
	/** Own setter for angle property*/
	setAngle(value = void 0, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		if (value !== void 0) value = sg2d_math.normalize_a(value, sg2d_utils.ifUndefined(options.precision, 1));
		if (this._setTileProperty("angle", value, options, flags)) {
			//this.onGeometric();
		}
	}
	
	/** Own setter for angle property*/
	setAnchor(value = void 0, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("anchor", value, options, flags);
	}
	
	/** Own setter for scale property*/
	setScale(value = void 0, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("scale", value, options, flags);
	}
	
	/** Own setter for visible property*/
	setAlpha(value = void 0, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("alpha", value, options, flags);
	}
	
	/** Own setter for visible property*/
	setVisible(value = void 0, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("visible", value, options, flags);
	}
	
	/** Own setter for visible property*/
	setZindex(value = void 0, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		this._setTileProperty("zindex", value, options, flags);
	}
	
	/** @private */
	_setTileProperty(name, value, options = sg_model["a" /* default */].OBJECT_EMPTY, flags = 0) {
		this._spritesFromOptions(options);
		if (sg2d_tile_SG2DTile._spritesFromOptions.size) {
			let changed = false;
			for (var sprite of sg2d_tile_SG2DTile._spritesFromOptions) {
				if (! sprite) continue;
				if (sprite[name] !== value) {
					sprite[name] = value;
					changed = true;
					this.drawUndraw(sprite);
				}
			}
			return changed;
		} else {
			if (this.set(name, value, options, flags | sg_model["a" /* default */].FLAG_IGNORE_OWN_SETTER)) {
				sg2d_utils.objectForEach(this.sprites, sprite=>{
					if (sprite.setter_flag !== sg2d_tile_SG2DTile.FLAG_ONLY_OPTIONS_SPRITE) sprite[name] = value;
				});
				this.drawUndraw();
				return true;
			}
		}
		return false;
	}
	
	/**
	 * For moving sprites, checks if drawing is required when hitting the camera
	 */
	drawUndraw(sprite = void 0) {
		if (! sg2d_consts.ONLY_LOGIC && sg2d_application_SG2DApplication._initialized) {
			if (this.isInCamera()) {
				if (sprite) {
					this._pixiSprite(sprite);
				} else {
					for (var name in this.sprites) {
						this._pixiSprite(this.sprites[name]);
					}
					this.set("drawed", true);
				}
				return true;
			} else {
				this.removeSprites();
				return false;
			}
		}
		return void 0;
	}
	
	/** @public */
	isInCamera() {
		if (! this.clusters) debugger; // TODO DEL DEBUG
		for (var cluster of this.clusters) {
			if (cluster.drawed) return true;
		}
		return false;
	}
	
	// To handle a click on a tile instance, set this method
	// click(target, options) {...}
	
	/** @private */
	_pixiSprite(sprite) {
		if (sg2d_application_SG2DApplication._initialized && this.constructor.noDraw === false) {
			var pixiSprite = sprite.pixiSprite;
			if (sprite.visible) {
				if (! pixiSprite) {
					let texture = this.updateSpriteTexture(sprite, sprite.animation && sprite.animation.running ? this.getAnimationTexture(sprite) : sprite.texture);
					pixiSprite = sprite.pixiSprite = new PIXI.Sprite(texture);
					pixiSprite.tile = this;
					sg2d_application_SG2DApplication.drawSprite(pixiSprite, sprite.layer);
				}
			} else {
				if (pixiSprite) {
					sg2d_application_SG2DApplication.removeSprite(sprite.pixiSprite);//, {children: true}); // TODO? Bush transform=null!!!=>Error in pixi.js
					delete sprite.pixiSprite;
				}
			}
			if (sprite.pixiSprite) {
				if (! sprite.animation || sprite.animation && ! sprite.animation.running) {
					this.updateSpriteTexture(sprite, sprite.texture);
				}
				pixiSprite.position.x = ~~this.properties.position.x;
				pixiSprite.position.y = ~~this.properties.position.y;
				if (typeof sprite.anchor === "number") pixiSprite.anchor.set(sprite.anchor); else pixiSprite.anchor.set(sprite.anchor.x, sprite.anchor.y);
				if (typeof sprite.scale === "number") pixiSprite.scale.set(sprite.scale); else pixiSprite.scale.set(sprite.scale.x, sprite.scale.y);
				pixiSprite.angle = sprite.angle;
				pixiSprite.zIndex = sprite.zindex;
				pixiSprite.alpha = sprite.alpha;
				pixiSprite.visible = sprite.visible;
			}
		}
	}
	
	removeSprites() { // default (override if there is a complicated rendering or several pictures)
		if (this.properties.drawed) {
			for (var name in this.sprites) {
				var sprite = this.sprites[name];
				if (sprite.pixiSprite) {
					sg2d_application_SG2DApplication.removeSprite(sprite.pixiSprite);//, {children: true}); // TODO? Bush transform=null!!!=>Error in pixi.js
					delete sprite.pixiSprite;
				}
				if (sprite.animation) {
					sprite.animation._count = 1;
					sprite.animation._sleep = 1;
					if (! sprite.animation.loop) {
						sprite._texture = sprite.texture;
						sprite.animation.running = false;
					}
				}
			}
			this.set("drawed", false);
		}
	}
	
	startAnimation(name_or_sprite = void 0) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			sprite.animation.running = true;
			sprite.visible = true;
			sprite.animation._count = 1;
			sprite.animation._sleep = 1;
			if (this.isInCamera()) {
				this._pixiSprite(sprite);
			}
			this.updateSpriteTexture(sprite, this.getAnimationTexture(sprite));
		}
	}
	
	breakAnimation(name_or_sprite = void 0) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			sprite.animation.running = false;
			sprite.animation.visible = false;
			sprite.animation._count = 1;
			sprite.animation._sleep = 1;
			this.updateSpriteTexture(sprite, sprite.texture || sprite._texture);
			if (this.isInCamera()) {
				this._pixiSprite(sprite);
			}
		}
	}
	
	stopAnimation(name_or_sprite = void 0, options = void 0) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			sprite.animation.running = false;
		}
		if (options && options.visible !== void 0) this.set("visible", options.visible, { sprite: sprite });
	}
	
	resumeAnimation(name_or_sprite = void 0, options = void 0) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			sprite.animation.running = true;
		}
		if (options && options.visible !== void 0) this.set("visible", options.visible, { sprite: sprite });
	}
	
	stepAnimation(name_or_sprite = void 0, count = 1) {
		let sprite = this._checkSpriteAnimation(name_or_sprite);
		if (sprite) {
			for (var i = 0; i < count; i++) {
				this.iterateAnimations(true, sprite);
			}
		}
	}
	
	/** @private */
	_checkSpriteAnimation(name_or_sprite) {
		if (this.hasAnimations) {
			name_or_sprite = name_or_sprite || this.sprite;
			let sprite = typeof name_or_sprite === "object" ? name_or_sprite : this.sprites[name_or_sprite];
			if (! sprite) throw "Error 730002! Animation sprite \"" + name_or_sprite + "\" not found!";
			let animation = sprite.animation;
			if (! animation) throw "Error 908720! Sprite \"" + sprite.name + "\" does not contain animation description!";
			return sprite;
		}
		return false;
	}
	
	getAnimationTexture(sprite) {
		return sprite.animation.basetexture + sprite.animation._count;
	}
	
	/** @protected */
	iterateAnimations(frame_index = true, sprite = void 0) {
		if (this.hasAnimations && (this._animationIndex < frame_index || frame_index === true)) {
			if (frame_index !== true) this._animationIndex = frame_index;
			if (sprite) {
				this._iterateAnimation(sprite);
			} else {
				sg2d_utils.objectForEach(this.sprites, this._iterateAnimation, this);
			}
		}
	}
	
	/** @private */
	_iterateAnimation(sprite) {
		var animation = sprite.animation;
		if (animation && animation.running) {
			animation._sleep++;
			if (animation._sleep > animation.sleep) {
				animation._sleep = 1;
				animation._count++;
				if (animation._count > animation.count) {
					animation._count = 1;
					if (! animation.loop) {
						sprite._texture = sprite.texture || sprite._texture;
						sprite.visible = false;
						animation.running = false;
						if (animation.onComplete) animation.onComplete(sprite);
						this._pixiSprite(sprite);
					}
				} else {
					sprite._texture = this.getAnimationTexture(sprite);
				}
				this.updateSpriteTexture(sprite);
			}
		}
	}
	
	/**
	 * @return {PIXI.Texture}
	 */
	updateSpriteTexture(sprite, _texture = void 0) {
		if (_texture !== void 0) sprite._texture = _texture;
		let sTexture = this.checkTexture(sprite._texture);
		let texture = PIXI.Texture.from(sTexture, {}, sg2d_consts.PIXI_TEXTURE_STRICT);
		if (sprite.pixiSprite) {
			if (sprite.pixiSprite.texture.textureCacheIds[0] !== sTexture) sprite.pixiSprite.texture = texture;
		}
		return texture;
	}
	
	/**
	 * @param {string} sTexture
	 * @return {string}
	 */
	checkTexture(sTexture) {
		if (! sg2d_consts.PIXI_TEXTURE_STRICT && ! PIXI.utils.TextureCache[sTexture]) {
			if (sg2d_tile_SG2DTile._textures_not_founded.indexOf(sTexture) === -1) {
				sg2d_tile_SG2DTile._textures_not_founded.push(sTexture);
				console.warn("Texture with the name \"" + sTexture + "\" was not found!"); debugger;
				if (! sTexture) debugger;
			}
			sTexture = sg2d_consts.TILE_404;
		}
		return sTexture;
	}
	
	/** @private */
	_spritesFromOptions(options = sg_model["a" /* default */].OBJECT_EMPTY) {
		sg2d_tile_SG2DTile._spritesFromOptions.clear();
		if (options.sprite) {
			sg2d_tile_SG2DTile._spritesFromOptions.add(options.sprite);
		}
		if (options.sprites) {
			sg2d_utils.objectForEach(options.sprites, sprite=>sg2d_tile_SG2DTile._spritesFromOptions.add(sprite));
		}
	}
	
	onGeometric() { // override for special cases
		this.calcBoundsPX();
		this.calcCXY();
		this.calcClustersBody();
	}
	
	calcBoundsPX() { // override for special cases
		this.bounds.set(
			this.properties.position.x - sg2d_consts.CELLSIZEPIX05 + 0.5,
			this.properties.position.y - sg2d_consts.CELLSIZEPIX05 + 0.5,
			this.properties.position.x + sg2d_consts.CELLSIZEPIX05 - 0.5,
			this.properties.position.y + sg2d_consts.CELLSIZEPIX05 - 0.5
		);
	}
	
	calcCXY() {
		
		sg2d_tile_SG2DTile._point.x = sg2d_utils.PXtoCX(this.properties.position.x);
		sg2d_tile_SG2DTile._point.y = sg2d_utils.PXtoCX(this.properties.position.y);
		this.centerCluster = sg2d_clusters_SG2DClusters.getClusterCXY(sg2d_tile_SG2DTile._point); // before this.set("cxy", ...) !
		
		this.set("cxy", sg2d_tile_SG2DTile._point, void 0, sg_model["a" /* default */].FLAG_PREV_VALUE_CLONE);
		
		this.boundsCXY.set(
			sg2d_utils.PXtoCX(this.bounds.min.x),
			sg2d_utils.PXtoCX(this.bounds.min.y),
			sg2d_utils.PXtoCX(this.bounds.max.x),
			sg2d_utils.PXtoCX(this.bounds.max.y)
		);
	}
	
	calcClustersBody() {
		var cluster;
		// TODO: учесть то что объект может быть повернут и тогда в некоторых кластерах (угловых) по факту тело объекта не будет присутствовать
		for (cluster of this.clusters) {
			if (cluster.x < this.boundsCXY.min.x || cluster.x > this.boundsCXY.max.x || cluster.y < this.boundsCXY.min.y || cluster.y > this.boundsCXY.max.y) {
				this.clusters.delete(cluster);
				cluster.tiles.delete(this);
				if (this.constructor.isBody) cluster.bodies.delete(this);
			}
		}
		for (var y = this.boundsCXY.min.y; y <= this.boundsCXY.max.y; y++) {
			for (var x = this.boundsCXY.min.x; x <= this.boundsCXY.max.x; x++) {
				if (cluster = sg2d_clusters_SG2DClusters.getCluster(x, y)) { // MatterJS allows objects to be micro-felled into each other, i.e. on the border of the map it can be!
					this.clusters.add(cluster);
					cluster.tiles.add(this);
					if (this.constructor.isBody) cluster.bodies.add(this);
				}
			}
		}
	}
	
	sound(code) {
		sg2d_sound.play(code, this);
	}
	
	destroy() {
		if (sg2d_consts.ONLY_LOGIC) {
			// no code
		} else {
			this.removeSprites();
			if (sg2d_consts.DRAW_BODY_LINES) sg2d_debugging.undrawSG2DBodyLines(this);
		}
		
		for (var cluster of this.clusters) {
			cluster.tiles.delete(this);
			cluster.bodies.delete(this);
		}
		this.clusters.clear();
		sg2d_clusters_SG2DClusters.tiles[this.properties.id] = null;
		sg2d_clusters_SG2DClusters.tilesset.delete(this);
		super.destroy();
	}
}

sg2d_tile_SG2DTile.typeProperties = { // overriden with Object.assign(...)
	texture: sg_model["a" /* default */].TYPE_STRING,
	position: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	angle: sg_model["a" /* default */].TYPE_NUMBER,
	anchor: sg_model["a" /* default */].TYPE_NUMBER_OR_XY,
	scale: sg_model["a" /* default */].TYPE_NUMBER_OR_XY,
	alpha: sg_model["a" /* default */].TYPE_NUMBER,
	visible: sg_model["a" /* default */].TYPE_BOOLEAN,
	zindex: sg_model["a" /* default */].TYPE_NUMBER,
	cxy: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS
};

/**@type {(void 0|string)} */
sg2d_tile_SG2DTile.layer = void 0; // if equal to void 0, the default layer is used (PIXI.Container)

/**@type {string} */
sg2d_tile_SG2DTile.texture = sg2d_consts.TILE_OVERRIDE; // overriden 

/**@type {number} */
sg2d_tile_SG2DTile.angle = 0;

/**@type {number} */
sg2d_tile_SG2DTile.anchor = 0.5;

/**@type {number} */
sg2d_tile_SG2DTile.scale = 1;

/**@type {number} */
sg2d_tile_SG2DTile.alpha = 1;

/**@type {boolean} */
sg2d_tile_SG2DTile.visible = true;

/**
 * Main zindex is added to zindex of sprites, except for sprite with name="main"
 * @type {number}
 */
sg2d_tile_SG2DTile.zindex = 0;

/**
* @typedef SG2DAnimationConfig
* @type {object}
* @property {number} [start=1]
* @property {number} count
* @property {number} [sleep=1]
* @property {boolean} [running=false]
* @property {boolean} [loop=false]
* @property {function} [onComplete=void 0]
*
* @type {SG2DAnimationConfig}
static animation = { start: 1, count: 8, sleep: 2, basetexture: "objects/tank_shot_", running: true }; // example
*/

/**
* @typedef SG2DSpriteConfig
* @type {object}
* @property {string} texture
* @property {(number|object)} [anchor=0.5]
* @property {number} [angle=0] - in degrees
* @property {(number|object)} [scale=1]
* @property {number} [zindex=0]
* @property {SG2DAnimationConfig} [animation]
* 
* @type {SG2DSpriteConfig[]}
static sprites = { // example
	tank_platform: { texture: "objects/tank-platform", zindex: 2 },
	tank_turret: { texture: "objects/tank-turret", anchor: { x: 0.5, y: 0.2 }, zindex: 3 }
	tank_track_left: { texture: "objects/tank-track", offset: { x: -40, y: 0 }, zindex: 1, basetexture: { count: 8, sleep: 2 } }
	tank_track_right { texture: "objects/tank-track", offset: {x: 40, y: 0}, zindex: 1, basetexture: { count: 8, sleep: 2 } }
};
*/

/**
 * @type {boolean}
 * @readonly
 */
sg2d_tile_SG2DTile.isTile = true;

/** @type {boolean} */
sg2d_tile_SG2DTile.isBody = false;

/** @type {boolean} */
sg2d_tile_SG2DTile.noDraw = false;

/** Ignore common sprite property setters (without options.<sprite|sprites>) */
sg2d_tile_SG2DTile.FLAG_ONLY_OPTIONS_SPRITE = true;

// To handle a click on a tile class, define this method in the tile class
// SG2DTile.click(target, options) {...}

/** @private */
sg2d_tile_SG2DTile._initPrevPosition = {x: -1, y: -1};

/** @private */
sg2d_tile_SG2DTile._point = {x: void 0, y: void 0};

sg2d_tile_SG2DTile.ownSetters = { // overriden with Object.assign(...)
	position: true,
	angle: true,
	anchor: true,
	scale: true,
	alpha: true,
	visible: true,
	zindex: true,
	texture: true
};

sg2d_tile_SG2DTile.defaultProperties = {
	id: void 0,
	position: {x: 0, y: 0},
	angle: 0,
	anchor: 0.5,
	scale: 1,
	alpha: 1,
	visible: true,
	zindex: 0,
	layer: void 0,
	cxy: {x: 0, y: 0},
	drawed: false
}

/** @private */
sg2d_tile_SG2DTile._defaultSpriteValues = {
	angle: 0,
	anchor: 0.5,
	scale: 1,
	alpha: 1,
	visible: true,
	zindex: 0
};

/** @private */
sg2d_tile_SG2DTile._prepareStaticConfigSprites = function() {

	if (this.hasOwnProperty("_spritesPrepared")) {
		return;
	} else {
		this._spritesPrepared = true;
	}

	if (! this.hasOwnProperty("sprites")) {
		this.sprites = { main: this._prepareSpriteProperties({ name: "main" }, this) }
	} else {
		this.sprites = this._prepareMultipleSprites(this.sprites);
	}

	if (this.sprites.main) this.sprite = this.sprites.main;
	if (this.sprite) {
		if (this.animation !== void 0) {
			this.sprite.animation = sg_model["a" /* default */].clone(this.animation);
		}
	}

	if (this.zindex !== void 0) {
		sg2d_utils.objectForEach(this.sprites, sprite=>{
			if (sprite.name !== "main") {
				sprite.zindex += this.zindex;
			}
		});
	}
}

/** @private */
sg2d_tile_SG2DTile. _prepareMultipleSprites = function(sprites, parentSprite = void 0) {
	for (var name in sprites) {
		const sprite = sprites[name];
		sprite.name = name;
		if (parentSprite) {
			sprite.parent = parentSprite.name;
			sprite.setter_flag = sg2d_tile_SG2DTile.FLAG_ONLY_OPTIONS_SPRITE;
		}
		this._prepareSpriteProperties(sprite);
		if (sprite.sprites) {
			sprites = {...sprites, ...this._prepareMultipleSprites(sprite.sprites, sprite)};
		}
	}
	return sprites;
}

/** @private */
sg2d_tile_SG2DTile._prepareSpriteProperties = function(dest, src = void 0) {
	if (! src) src = dest;
	dest.texture = typeof src.texture !== void 0 ? src.texture : sg2d_consts.TILE_OVERRIDE;
	for (var p in sg2d_tile_SG2DTile._defaultSpriteValues) {
		dest[p] = sg2d_utils.ifUndefined(src[p], sg2d_tile_SG2DTile._defaultSpriteValues[p]);
	}
	dest.layer = src.layer || this.layer;
	return dest;
}

/** @private */
sg2d_tile_SG2DTile._textures_not_founded = [];

/** @private */
sg2d_tile_SG2DTile._spritesFromOptions = new Set();
// CONCATENATED MODULE: ./src/sg2d-pointer.js
/**
 * SG2DPointer
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */









class sg2d_pointer_SG2DPointer extends sg_model["a" /* default */] {
	
	initialize(properties, thisProps, options) {
		
		// passed to thisProps: { sg2d: this }
		
		//this.camera = this.sg2d.camera;
		
		if (! sg2d_pointer_SG2DPointer._newPosition) sg2d_pointer_SG2DPointer._newPosition = new PIXI.Point();
		
		this.identifiers = [];
		for (var i = 0; i < sg2d_pointer_SG2DPointer._maxIdentifiers; i++) {
			this.identifiers[i] = {
				target: { cluster: void 0, tile: void 0, sprite: void 0, pxy: this.properties.pxy, cxy: this.properties.cxy, pxy_local: {x: void 0, y: void 0} },
				options: { type: void 0, button: void 0 }
			}
		}
		
		this.on("pxy", ()=>{
			this.set("cxy", [Math.floor( 1 + this.properties.pxy.x / sg2d_consts.CELLSIZEPIX ), Math.floor( 1 + this.properties.pxy.y / sg2d_consts.CELLSIZEPIX )]);
		});
	}
	
	/** @private */
	_sg2dconnect(sg2d) {
		
		this.sg2d = sg2d;
		this.camera = this.sg2d.camera;
		
		this.properties.global = this.sg2d.pixi.renderer.plugins.interaction.mouse.global;
		
		this.sg2d.viewport.interactive = true;
		
		this.sg2d.viewport.on("pointerdown", this.pointerdown.bind(this));
		this.sg2d.viewport.on("pointerup", this.pointerup.bind(this));
		this.sg2d.viewport.on("pointermove", this.pointermove.bind(this));
		//this.sg2d.viewport.on("pointerover", this.pointerover.bind(this));
		//this.sg2d.canvas.addEventListener("pointerup", (e)=>{ debugger; });
		
		// Css style for icons
		for (var p in this.properties.cursors) {
			var s = this.properties.cursors[p];
			if (s) {
				this.sg2d.pixi.renderer.plugins.interaction.cursorStyles[p] = s;
			}
		}
	}
	
	/*getTileByPXY(pxy, bClick) {
		SG2DPointer._target.cluster = this.sg2d.clusters.getCluster(pxy.x, pxy.y);
		SG2DPointer._target.tile = null;
		SG2DPointer._target.sprite = null;
		SG2DPointer._target.pxy_local.x = void 0;
		SG2DPointer._target.pxy_local.y = void 0;
		for (var tile of SG2DPointer._target.cluster.bodies) {
			if (bClick && ! tile.click) continue;
			for (var sprite of tile.sprites) {
				//var mousePos = e.data.getLocalPosition(sprite);
				var mousePos = this.sg2d.pixi.renderer.plugins.interaction.mouse.getLocalPosition(sprite);
				if (sprite.getLocalBounds().contains(mousePos.x, mousePos.y)) {
					if (! SG2DPointer._target.sprite || SG2DPointer._target.sprite.zIndex > sprite.zIndex) {
						SG2DPointer._target.sprite = sprite;
						SG2DPointer._target.tile = tile;
					}
				}
			}
		}
		return SG2DPointer._target;
	}*/
	
	pointerdown(event) {
		
		if (! this.sg2d.clusters) return;
		if (event.data.identifier >= sg2d_pointer_SG2DPointer._maxIdentifiers) return;
		
		let target = this.identifiers[event.data.identifier].target;
		let options = this.identifiers[event.data.identifier].options;
		
		options.button = event.data.button;
		options.type = event.type;
		
		target.cluster = this.sg2d.clusters.getCluster(this.properties.cxy.x, this.properties.cxy.y);
		target.tile = null;
		target.sprite = null;
		
		if (target.cluster) {
			for (var tile of target.cluster.bodies) {
				sg2d_utils.objectForEach(tile.sprites, sprite=>{
					if (! sprite.pixiSprites) return;
					this.sg2d.pixi.renderer.plugins.interaction.mouse.getLocalPosition(sprite.pixiSprite, target.pxy_local); // or e.data.getLocalPosition(..)
					if (sprite.getLocalBounds().contains(target.pxy_local.x, target.pxy_local.y)) {
						if (! target.sprite.pixiSprite || target.sprite.pixiSprite.zIndex > sprite.pixiSprite.zIndex) {
							target.sprite = sprite;
							target.tile = tile;
						}
					}
				});
			}
		}
		
		if (this.camera.properties.movement_by_pointer) {
			if (this.camera.properties.movement_state === sg2d_camera_SG2DCamera.STATE_NO_MOVEMENT) {
				if (
					(options.button === 0 && (this.camera.properties.movement_by_pointer & sg2d_camera_SG2DCamera.MOVEMENT_BY_POINTER_LEFT)) ||
					(options.button === 2 && (this.camera.properties.movement_by_pointer & sg2d_camera_SG2DCamera.MOVEMENT_BY_POINTER_RIGHT)) ||
					(options.button === 1 && (this.camera.properties.movement_by_pointer & sg2d_camera_SG2DCamera.MOVEMENT_BY_POINTER_MIDDLE))
				) {
					sg2d_pointer_SG2DPointer._startPoint.x = sg2d_pointer_SG2DPointer._newPosition.x;
					sg2d_pointer_SG2DPointer._startPoint.y = sg2d_pointer_SG2DPointer._newPosition.y;
					this.camera.set("movement_state", sg2d_camera_SG2DCamera.STATE_MOVEMENT_WAITING_SHIFT);
				}
			}
		}
	}
	
	pointermove(e) {
		if (this.camera.properties.movement_by_pointer) {
			if (this.camera.properties.movement_state === sg2d_camera_SG2DCamera.STATE_MOVEMENT_WAITING_SHIFT) {
				this.sg2d.viewport.cursor = "move";
				let d = sg2d_math.distance_p(sg2d_pointer_SG2DPointer._startPoint, sg2d_pointer_SG2DPointer._newPosition);
				if (d >= sg2d_pointer_SG2DPointer.CAMERA_MOVEMENT_SHIFT) {
					sg2d_pointer_SG2DPointer._startPoint.x =  this.properties.global.x;
					sg2d_pointer_SG2DPointer._startPoint.y =  this.properties.global.y;
					sg2d_pointer_SG2DPointer._startPointPXY.x = this.camera.properties.offset.x;
					sg2d_pointer_SG2DPointer._startPointPXY.y = this.camera.properties.offset.y;
					this.camera.set("movement_state", sg2d_camera_SG2DCamera.STATE_MOVING);
				}
			} else if (this.camera.properties.movement_state === sg2d_camera_SG2DCamera.STATE_MOVING) {
				let k = this.camera.scales_k[this.camera.properties.scale];
				let dx = (this.properties.global.x - sg2d_pointer_SG2DPointer._startPoint.x) / k;
				let dy = (this.properties.global.y - sg2d_pointer_SG2DPointer._startPoint.y) / k;
				let rotate = this.camera.properties.rotate - this.camera.rotate_adjustment;
				sg2d_pointer_SG2DPointer._position.x = sg2d_pointer_SG2DPointer._startPointPXY.x - dx * sg2d_math.cos(rotate, 1) + dy * sg2d_math.sin(rotate, 1);
				sg2d_pointer_SG2DPointer._position.y = sg2d_pointer_SG2DPointer._startPointPXY.y - dy * sg2d_math.cos(rotate, 1) - dx * sg2d_math.sin(rotate, 1);
				this.camera.set("offset", sg2d_pointer_SG2DPointer._position, sg_model["a" /* default */].OPTIONS_PRECISION_5);
			}
		}
	}
	
	pointerup(event) {
		
		if (! this.sg2d.clusters) return;
		if (event.data.identifier >= sg2d_pointer_SG2DPointer._maxIdentifiers) return;
		
		let target = this.identifiers[event.data.identifier].target;
		let options = this.identifiers[event.data.identifier].options;
		
		if (target.tile) {
			if (target.tile.constructor.click) target.tile.constructor.click(target, options);
			if (target.tile.click) target.tile.click(target, options);
		}
		
		if (this.camera.properties.movement_by_pointer) {
			if (this.camera.properties.movement_state) {
				this.sg2d.viewport.cursor = "default";
				let k = this.camera.scales_k[this.camera.properties.scale];
				let dx = (this.properties.global.x - sg2d_pointer_SG2DPointer._startPoint.x) / k;
				let dy = (this.properties.global.y - sg2d_pointer_SG2DPointer._startPoint.y) / k;
				this.camera.set("movement_state", sg2d_camera_SG2DCamera.STATE_NO_MOVEMENT);
			}
		}
		
		this.pointerclick(target, options);
	}
	
	pointerclick(e) {} // override
	
	iterate() {
		this.sg2d.pixi.renderer.plugins.interaction.mouse.getLocalPosition(this.sg2d.viewport, sg2d_pointer_SG2DPointer._newPosition);
		sg2d_pointer_SG2DPointer._newPosition.x = ~~sg2d_pointer_SG2DPointer._newPosition.x;
		sg2d_pointer_SG2DPointer._newPosition.y = ~~sg2d_pointer_SG2DPointer._newPosition.y;
		this.set("pxy", [sg2d_pointer_SG2DPointer._newPosition.x, sg2d_pointer_SG2DPointer._newPosition.y]);
	}
}

sg2d_pointer_SG2DPointer.typeProperties = {
	global: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	camera: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	pxy: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS,
	cxy: sg_model["a" /* default */].TYPE_OBJECT_NUMBERS
};

sg2d_pointer_SG2DPointer.POINTER_LEFT = 0;
sg2d_pointer_SG2DPointer.POINTER_MIDDLE = 1;
sg2d_pointer_SG2DPointer.POINTER_RIGHT = 2;

sg2d_pointer_SG2DPointer.CAMERA_MOVEMENT_SHIFT = 10; // pixels

/** @private */
sg2d_pointer_SG2DPointer._newPosition= void 0;

/** @private */
sg2d_pointer_SG2DPointer._maxIdentifiers = 10;

sg2d_pointer_SG2DPointer.defaultProperties = {
	global: void 0, // relative to the screen
	pxy: { x: 0, y: 0 }, // in the coordinates of the game world: PX
	cxy: { x: 0, y: 0 }, // in the coordinates of the game world: Cluster
	cursors: { default: "", hover: "", move: "", /*...*/} // cursor icons
}

/** @private */
sg2d_pointer_SG2DPointer._position = {x: 0, y: 0};

/** @private */
sg2d_pointer_SG2DPointer._startPoint = { x: 0, y: 0 };

/** @private */
sg2d_pointer_SG2DPointer._startPointPXY = { x: 0, y: 0 };
// CONCATENATED MODULE: ./src/sg2d-effects.js
/**
 * SG2DEffects
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */






class sg2d_effects_SG2DEffects {
	
	constructor() {
		this.effects = new Set();
	}
	
	/** @private */
	_sg2dconnect(sg2d) {	
		this.sg2d = sg2d;
		
		this.sg2d.camera.on("scale", this._onCameraScale.bind(this), void 0, void 0, true);
		this.sg2d.camera.on("rotate", this._onCameraRotate.bind(this), void 0, void 0, true);
	}
	
	_onCameraScale(scale, scale_prev) {
		for (var effect of this.effects) {
			switch (effect.type) {
				case sg2d_effects_SG2DEffects.TYPE_SHADOWS:
					effect.filter.distance *= scale / scale_prev;
					break;
				case sg2d_effects_SG2DEffects.TYPE_BEVELS:
					effect.filter.thickness *= scale / scale_prev;
					break;
				case sg2d_effects_SG2DEffects.TYPE_DISPLACEMENT:
					effect.options.scale /= scale / scale_prev;
					effect.sprite.scale.set(effect.options.scale);
					break;
			}
		}
	}
	
	_onCameraRotate(rotate) {
		for (var effect of this.effects) {
			switch (effect.type) {
				case sg2d_effects_SG2DEffects.TYPE_SHADOWS: case sg2d_effects_SG2DEffects.TYPE_BEVELS:
					effect.filter.rotation = effect.options.rotation - rotate;
					break;
			}
		}
	}
	
	addShadowsToLayer(config) {
		var container = this.sg2d.layers[config.layer].container;
		container.filters = container.filters || [];
		var rotation = sg2d_utils.ifUndefined(config.rotation, 135);
		var effect = {
			type: sg2d_effects_SG2DEffects.TYPE_SHADOWS,
			layer: config.layer,
			filter: new PIXI.filters.DropShadowFilter({
				rotation: rotation - this.sg2d.camera.properties.rotate,
				distance: sg2d_utils.ifUndefined(config.distance, 8),
				alpha: sg2d_utils.ifUndefined(config.alpha, 0.6)
			}),
			options: {
				rotation: rotation
			}
		};
		container.filters.push(effect.filter);
		
		this.effects.add(effect);
		return effect;
	}
	
	addBevelsToLayer(config) {
		var container = this.sg2d.layers[config.layer].container;
		container.filters = container.filters || [];
		var rotation = sg2d_utils.ifUndefined(config.rotation, 135);
		var effect = {
			type: sg2d_effects_SG2DEffects.TYPE_BEVELS,
			layer: config.layer,
			filter: new PIXI.filters.BevelFilter({
				rotation: rotation - this.sg2d.camera.properties.rotate,
				thickness: sg2d_utils.ifUndefined(config.thickness, 2),
				lightAlpha: sg2d_utils.ifUndefined(config.lightAlpha, 0.8),
				shadowAlpha: sg2d_utils.ifUndefined(config.shadowAlpha, 0.8)
			}),
			options: {
				rotation: rotation
			}
		};
		effect.filter.padding = 1;
		container.filters.push(effect.filter);
		
		this.effects.add(effect);
		return effect;
	}
	
	addDisplacementToLayer(config) {
		var container = this.sg2d.layers[config.layer].container;
		container.filters = container.filters || [];
		
		var effect = {
			type: sg2d_effects_SG2DEffects.TYPE_DISPLACEMENT,
			layer: config.layer,
			options: {
				texture: config.texture || sg2d_consts.TILE_OVERRIDE,
				scale: config.scale || 1
			}
		};
		
		if (typeof config.iterate === "function") {
			effect.iterate = config.iterate.bind(effect);
			effect.options.animationStep = config.animationStep || 1;
		}
		
		effect.sprite = PIXI.Sprite.from(effect.options.texture);
		effect.sprite.scale.set(effect.options.scale);
		effect.sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		container.addChild(effect.sprite);
		
		effect.filter = new PIXI.filters.DisplacementFilter(effect.sprite);
		container.filters.push(effect.filter);
		
		this.effects.add(effect);
		return effect;
	}
}

sg2d_effects_SG2DEffects.TYPE_SHADOWS = 1;
sg2d_effects_SG2DEffects.TYPE_BEVELS = 2;
sg2d_effects_SG2DEffects.TYPE_DISPLACEMENT = 3;
// CONCATENATED MODULE: ./src/sg2d-plugins.js
/**
 * SG2DPlugins
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */



class SG2DPlugins {}
	
SG2DPlugins.files = {};
SG2DPlugins.classes = {};
SG2DPlugins.instances = {};

/** @public */
SG2DPlugins.load = function(asPlugins) {
	asPlugins = typeof asPlugins === "object"
	? (Array.isArray(asPlugins)
		? asPlugins.reduce((accumulator, currentValue)=>{
			accumulator[currentValue] = {};
			return accumulator
		}, {})
		: asPlugins)
	: {};
	let promises = [];
	for (let p in asPlugins) {
		if (! this.files[p]) {
			let promise = new Promise((success, failed)=>{
				this.files[p] = import(/* webpackIgnore: true */"./plugins/"+p+'.js').then((result)=>{
					let _class = this.classes[result.default.name] = result.default;
					let instance = this.instances[result.default.code] = new _class();
					if (_class.ready) {
						_class.ready(success, failed);
					} else {
						throw "The plugin class \"" + _class.name + "\" must have a static ready() method! Maybe you didn't inherit the class from SG2D.PluginBase or you didn't call super() in the constructor!";
					}
				});
			});
			promises.push(promise);
		}
	}

	return Promise.all(promises);
}
// CONCATENATED MODULE: ./src/sg2d-plugin-base.js
/**
 * SG2DPluginBase
 * Base class for the plugin
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */



class SG2DPluginBase {
	
	/** @public */
	//static code = ""; // override
	
	/** @private */
	//static _instance = null; // override
	
	/** @private */
	//static _ready = null; // override
	
	/** @public */
	static ready(_success = void 0, _failed = void 0) {
		if (! this._ready) {
			this._ready = new Promise((success, failed)=>{
				this.success = success;
				this.failed = failed;
			});
		}
		if (_success || _failed) {
			this._ready.then(_success || (()=>{}), _failed || (()=>{}));
		}
		return this._ready;
	}
	
	/** @protected */
	//static success = ()=>{}; // override
	
	/** @protected */
	//static failed = ()=>{}; // override
	
	// overridden with a call to super()
	constructor() {
		if (this.constructor._instance) throw "Error! A plugin class can only have one instance!";
		this.constructor._instance = this;
		this.constructor.ready();
	}
}
// CONCATENATED MODULE: ./src/sg2d-application.js
/**
 * SG2DApplication 1.0.0
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */

















class sg2d_application_SG2DApplication {
	
	/**
	 * SG2DApplication constructor
	 * @param {object} config
	 * @param {string}		[config.canvasId]
	 * @param {number}		[config.cellsizepix=32]
	 * @param {object}		[config.camera] - Config or instanceof SG2DCamera
	 * @param {boolean}		[config.camera.rotation=true]
	 * @param {number}			[config.camera.rotate=0]
	 * @param {object}			[config.camera.position={x: 0, y: 0}]
	 * @param {number}			[config.camera.scale_min=1]
	 * @param {number}			[config.camera.scale_max=16]
	 * @param {flag}			[config.camera.movement_by_pointer=0]
	 * @param {number}			[config.camera.rotate_adjustment=0
	 * @param {object}		[config.clusters] - Config or instanceof SG2DClusters
	 * @param {number}			[config.clusters.areasize=128]
	 * @param {object}		[config.pointer] - Config or instanceof SG2DPointer
	 * @param {function}	[config.iterate]
	 * @param {function}	[config.resize]
	 * @param {object}		[config.layers={main: {}}]
	 * @param {object}		[config.pixi] - Config for PIXI.Application constructor
	 * @param {HTMLElement}	[config.pixi.resizeTo=canvas.parentElement]
	 * @param {number}			[config.pixi.backgroundColor=0x000000]
	 * @param {boolean}		[config.pixi.antialias=false]
	 * @param {boolean}		[config.pixi.autoStart=true]
	 * @param {number}			[config.pixi.width=100]
	 * @param {number}			[config.pixi.height=100]
	 * @param {object}		[config.matter = void 0] - Config for Matter.Engine constructor
	 * @param {array}		[plugins=void 0] - Array of string, example: ["sg2d-transitions", ...]
	 * @param {string|object}[sound=void 0] - Sound config file path or sound settings
	 * @param {object}			[sound.options={}]
	 * @param {string|object}		[sound.options.config=void 0] - File path to sound config or object sound config
	 * @param {string}				[sound.options.music_dir=void 0] - Music directory
	 * @param {string}				[sound.options.sounds_dir=void 0] - Sounds directory
	 * @param {string}				[sound.options.library_pathfile=void 0] - Path to the PIXI.Sound library file is applied only the first time the parameter is passed
	 * @param {object}			[sound.properties={}]
	 * @param {boolean}			[sound.properties.sounds=true]
	 * @param {boolean}			[sound.properties.music=true]
	 * @param {number}				[sound.properties.musicVolume=100]
	 * @param {number}				[sound.properties.soundsVolume=100]
	 * @param {boolean}			[sound.properties.muteOnLossFocus=true]
	 * @param {number}				[sound.properties.volumeDecreaseDistance=0]
	 * @param {boolean}			[sound.properties.environment2D=true]
	 * @param {boolean}			[sound.properties.bass=false]
	 * @param {string}				[sound.properties.view=void 0]
	 * @param {object}		[deferred=SG2D.Deferred()] - Promise that will be executed when the scene is created and run
	 */
	constructor(config) {
		
		if (sg2d_application_SG2DApplication._instance) throw "SG2D.Application Error! There is an instance of the class! You must execute .destroy() on the previous instance!";
		sg2d_application_SG2DApplication._instance = this;
		
		sg2d_application_SG2DApplication._initialized ? Promise.resolve() : sg2d_application_SG2DApplication._initialize();
		
		if (! config) throw "SG2D.Application Error! config is empty!";
		
		if (+config.cellsizepix) sg2d_application_SG2DApplication.setCellSizePix(config.cellsizepix);
		
		this.id = config.id ? config.id : ++sg2d_application_SG2DApplication._uid;
		
		let pixi = config.pixi = config.pixi || {};
		this.canvas = pixi.view = pixi.view || document.getElementById(config.canvasId) || document.querySelector("CANVAS");
		pixi.width = pixi.width !== void 0 ? pixi.width : 100;
		pixi.height = pixi.height !== void 0 ? pixi.height : 100;
		pixi.backgroundColor = pixi.backgroundColor !== void 0 ? pixi.backgroundColor : 0x000000;
		pixi.resizeTo = pixi.resizeTo !== void 0 ? pixi.resizeTo : this.canvas.parentElement;
		let autoStart = pixi.autoStart !== void 0 ? pixi.autoStart : true;
		pixi.autoStart = false;

		sg2d_application_SG2DApplication.drawSprite = sg2d_application_SG2DApplication._drawSprite.bind(this);
		sg2d_application_SG2DApplication.removeSprite = sg2d_application_SG2DApplication._removeSprite.bind(this);
		this.iterate = this.iterate.bind(this);
		this.iterate_out = config.iterate || function(){};
		this.resize_out = config.resize || function(){};
		this.canvas.oncontextmenu = function() { return false; };
		this.canvas.onselectstart = function() { return false; };
		
		SG2D.pixi = this.pixi = new PIXI.Application(pixi);
		
		if (config.matter) {
			SG2D.matter = this.matter = Matter.Engine.create(config.matter);
			
			Matter.Events.on(this.matter, "collisionStart", function(event) {
				for (var i = 0; i < event.pairs.length; i++) {
					var pair = event.pairs[i];
					if (pair.bodyA.parent.tile && pair.bodyB.parent.tile) {
						pair.bodyA.parent.tile.collision && pair.bodyA.parent.tile.collision(pair.bodyB.parent.tile, pair, event.pairs);
						pair.bodyB.parent.tile.collision && pair.bodyB.parent.tile.collision(pair.bodyA.parent.tile, pair, event.pairs);
					}
				}
			});
		}

		this.frame_index = 0;
		
		// Layers:
		
		if (! config.layers) config.layers = { main: {} };
		
		if (typeof config.layers === "number") {
			var _layers = [];
			for (var i = 0; i < config.layers; i++) _layers[i] = {};
			config.layers = _layers;
		}
		
		let bContainerFixedExists = false;
		for (var l in config.layers) {
			var layer_cfg = config.layers[l];
			if (layer_cfg.position === SG2D.LAYER_POSITION_FIXED) {
				bContainerFixedExists = true;
				break;
			}
		}
		
		if (bContainerFixedExists) {
			this.viewport = new PIXI.Container();
			this.pixi.stage.addChild(this.viewport);
		} else {
			this.viewport = this.pixi.stage;
		}
		this.viewport.sortableChildren = true;
		
		this.layers = {};
		
		let zIndex = 0;
		for (var l in config.layers) {
			var layer_cfg = config.layers[l];
			var layer = this.layers[l] = {
				position: layer_cfg.position || SG2D.LAYER_POSITION_ABSOLUTE,
				zIndex: layer_cfg.zIndex || ++zIndex,
				sortableChildren: layer_cfg.sortableChildren === void 0 ? true : layer_cfg.sortableChildren
			};
			var container = layer.container = (l === "main" ? this.viewport : new PIXI.Container());
			if (layer.sortableChildren !== void 0) container.sortableChildren = layer.sortableChildren;
			if (layer.zIndex !== void 0) container.zIndex = layer.zIndex;
			if (l !== "main") {
				if (layer.position === SG2D.LAYER_POSITION_FIXED) {
					this.pixi.stage.addChild(container);
				} else {
					this.viewport.addChild(container);
				}
			}
		}
		
		// /Layer.
		
		this.pixi.ticker.add(this.iterate); // TODO BUG: on focusout the tab is disabled until the tab is focusin
		
		this.clusters = config.clusters instanceof sg2d_clusters_SG2DClusters ? config.clusters : new sg2d_clusters_SG2DClusters(config.clusters);
		
		this.camera = config.camera instanceof sg2d_camera_SG2DCamera ? config.camera : new sg2d_camera_SG2DCamera(config.camera);
		this.camera._sg2dconnect && this.camera._sg2dconnect(this);
		
		this.pointer = config.pointer instanceof sg2d_pointer_SG2DPointer ? config.pointer : new sg2d_pointer_SG2DPointer(config.pointer);
		this.pointer._sg2dconnect && this.pointer._sg2dconnect(this);
		
		this.resize = sg2d_utils.debounce(this.resize, 100).bind(this);
		addEventListener("resize", this.resize);
		
		sg2d_application_SG2DApplication._pluginsPromise = SG2DPlugins.load(config.plugins);
		
		this.effects = config.effects instanceof sg2d_effects_SG2DEffects ? config.effects : new sg2d_effects_SG2DEffects(config.effects);
		this.effects._sg2dconnect && this.effects._sg2dconnect(this);
		
		if (typeof config.sound === "string") {
			config.sound = { options: { config: config.sound } };
		}
		if (typeof config.sound === "object") {
			sg2d_application_SG2DApplication._soundConfigPromise = sg2d_sound.load(config.sound.options, config.sound.properties);
		} else {
			sg2d_application_SG2DApplication._soundConfigPromise = Promise.resolve();
		}
		sg2d_sound._sg2dconnect(this);
		
		if (config.deferred) {
			this.deferred = config.deferred;
		} else {
			this.deferred = SG2D.Deferred();
		}
		
		this.state = sg2d_application_SG2DApplication.STATE_IDLE;
		if (autoStart) this.run();
	}
	
	run() {
		Promise.all([
			sg2d_application_SG2DApplication._initializationPromise,
			sg2d_application_SG2DApplication._pluginsPromise,
			sg2d_application_SG2DApplication._soundConfigPromise
		]).then(()=>{
			this.deferred.resolve(this);
			window.dispatchEvent(new Event('resize'));
			this.initClustersInCamera();
			this.pixi.start();
			this.state = sg2d_application_SG2DApplication.STATE_RUN;
		}, (e)=>{
			throw "Error 50713888! Message: " + e;
		});
	}
	
	initClustersInCamera() {
		let q = 0; // TODO DEL
		this.clusters.each((cluster)=>{
			if (cluster.drawed) {
				cluster.inCamera(true);
				q++;
			}
		});
	}

	iterate(t) {
		
		if (this.state !== sg2d_application_SG2DApplication.STATE_RUN) return;
		
		var tStart = sg2d_utils.getTime();

		this.frame_index++;
		
		if (this.matter) {
			this.matterIterate();
		}
		
		this.camera._iterate();
		if (sg2d_consts.DRAW_BODY_LINES) sg2d_debugging.redrawSG2DBodiesLines();
		
		this.pointer.iterate();
		
		for (var cluster of this.camera.clustersInCamera) {
			for (var tile of cluster.tiles) {
				if (tile.iterateAnimations) tile.iterateAnimations(this.frame_index);
			}
		}
		
		for (var effect of this.effects.effects) {
			effect.iterate && effect.iterate();
		}
		
		for (var tile of this.clusters.tilesset) {
			tile.iterate && tile.iterate();
		}
		
		this.iterate_out();

		var t = sg2d_utils.getTime();

		this.tUsed0 = t - tStart; // How long did the iteration calculation take without taking into account the rendering time of the web page along with the canvases
		this.tRequestAnimationFrame = (this.tPrevious ? t - this.tPrevious : 1); // Frame duration
		this.tPrevious = t;
	}
	
	matterIterate() {
		
		Matter.Engine.update(this.matter);
		
		this.aBodies = Matter.Composite.allBodies(this.matter.world);
		for (var i = 0; i < this.aBodies.length; i++) {
			var body = this.aBodies[i];
			if (body.isStatic) continue;
			
			var tile = body.tile;
			if (! tile) continue; // global border
			
			// TODO ON
			/*if (body.position.x < this.boundsDestroy.min.x || body.position.y < this.boundsDestroy.min.y || body.position.x > this.boundsDestroy.max.x || body.position.y > this.boundsDestroy.max.y) {
				tile.destroy();
				continue;
			}*/
			
			if (body.angle >= sg2d_math.PI2) { Matter.Body.setAngle(body, body.angle - sg2d_math.PI2); body.anglePrev = body.angle; }
			if (body.angle < 0) { Matter.Body.setAngle(body, body.angle + sg2d_math.PI2); body.anglePrev = body.angle; }
			
			// use SGModel-setter to detect changes
			tile.set("position", body.position, sg_model["a" /* default */].OPTIONS_PRECISION_5);
			tile.set("angle", body.angle / sg2d_math.PI180, sg_model["a" /* default */].OPTIONS_PRECISION_5);
			tile.set("velocity", body.velocity, sg_model["a" /* default */].OPTIONS_PRECISION_5);
			tile.set("angularVelocity", body.angularVelocity, sg_model["a" /* default */].OPTIONS_PRECISION_5);
			if (tile.changed) {
				tile.bounds.set(body.bounds);
				if (body.velocity) { // при движении тел bounds вытягивается в сторону движения!
					if (body.velocity.x > 0) tile.bounds.max.x -= body.velocity.x; else tile.bounds.min.x -= body.velocity.x;
					if (body.velocity.y > 0) tile.bounds.max.y -= body.velocity.y; else tile.bounds.min.y -= body.velocity.y;
				}
			} else {
				Matter.Body.setAngularVelocity(body, 0);
				Matter.Body.setVelocity(body, {x: 0, y:0});
				Matter.Body.setPosition(body, tile.properties.position);
				Matter.Body.setAngle(body, tile.properties.angle * sg2d_math.PI180);
			}
		}
	}

	pause() {
		this.pixi.stop();
		this.state = sg2d_application_SG2DApplication.STATE_PAUSE;
	}

	destroy() {
		
		this.state = sg2d_application_SG2DApplication.STATE_DESTROY;
		
		removeEventListener("resize", this.resize);
		this.pointer.destroy();
		this.pointer = null;
		this.camera.destroy();
		this.camera = null;
		this.clusters.destroy();
		this.clusters = null;
		
		sg2d_debugging.clear();
		
		 // To apply removeChild, you need to execute at least one iteration of this.pixi.render (), otherwise a bug - old pictures will flash on the canvas when the scene is restarted!
		for (var i = 0; i < this.viewport.children.length; i++) this.viewport.removeChild(this.viewport.children[i]);
		this.pixi.render();
		this.pixi.stop();
		setTimeout(()=>{
			this.pixi.destroy(void 0, {children: true});
			this.pixi = null;
			SG2D.pixi = null;
		}, 500);
		
		if (SG2D.matter) {
			Matter.World.clear(this.matter.world); // ?
			Matter.Engine.clear(this.matter);
			SG2D.matter = null;
		}
		
		sg2d_application_SG2DApplication.drawSprite = null
		sg2d_application_SG2DApplication.removeSprite = null
		sg2d_application_SG2DApplication.spritesCount = 0;
		sg2d_application_SG2DApplication._instance = null;
	}
	
	resize() {
		this.camera.onResize();
		this.resize_out();
	}
}

/** @private */
sg2d_application_SG2DApplication._initializationPromise = sg2d_utils._loadSystemTextures();

/** @private */
sg2d_application_SG2DApplication._instance = null;

sg2d_application_SG2DApplication.getInstance = function(bIgnoreEmpty) {
	if (this._instance) {
		return this._instance;
	} else if (! bIgnoreEmpty) {
		throw "Error! SG2D.Application._instance is empty!";
	}
	return null;
}

/** @public */
sg2d_application_SG2DApplication.STATE_IDLE = 0;
sg2d_application_SG2DApplication.STATE_RUN = 1;
sg2d_application_SG2DApplication.STATE_PAUSE = 2;
sg2d_application_SG2DApplication.STATE_DESTROY = 1<<31; // leftmost bit

/** @private */
sg2d_application_SG2DApplication._uid = 0;

/** @public */
sg2d_application_SG2DApplication.plugins = null;

/** @private */
sg2d_application_SG2DApplication._pluginsPromise = null;

/** @private */
sg2d_application_SG2DApplication._soundConfigPromise = null;

/** @private */
sg2d_application_SG2DApplication._initialized = false;

/** @private */
sg2d_application_SG2DApplication._initialize = function() {
	sg2d_application_SG2DApplication.plugins = SG2DPlugins;
	SG2DPluginBase.SGModel = sg_model["a" /* default */];
	SG2DPluginBase.SG2DConsts = sg2d_consts;
	SG2DPluginBase.SG2DUtils = sg2d_utils;
	SG2DPluginBase.SG2DClusters = sg2d_clusters_SG2DClusters;
	SG2DPluginBase.SG2DTile = sg2d_tile_SG2DTile;
	SG2DPluginBase.SG2DCamera = sg2d_camera_SG2DCamera;
	PIXI.utils.skipHello();
	this._initializationPromise.then(()=>{
		sg2d_application_SG2DApplication._initialized = true;
	});
}

/** @readonly */
sg2d_application_SG2DApplication.spritesCount = 0;

/** @private */
sg2d_application_SG2DApplication._drawSprite = function(sprite, layer) {
	if (layer === void 0 || ! sg2d_application_SG2DApplication._instance.layers[layer]) {
		sg2d_application_SG2DApplication._instance.viewport.addChild(sprite);
	} else {
		sg2d_application_SG2DApplication._instance.layers[layer].container.addChild(sprite);
	}
	sg2d_application_SG2DApplication.spritesCount++;

	if (sg2d_consts.DRAW_BODY_LINES) sg2d_debugging.drawSG2DBodyLines(sprite.tile);
}

/** @private */
sg2d_application_SG2DApplication._removeSprite = function(sprite) {
	if (! sprite || ! sprite.parent) debugger; // TODO DEL
	sprite.parent.removeChild(sprite);
	//sprite.destroy();
	sg2d_application_SG2DApplication.spritesCount--;

	if (sg2d_consts.DRAW_BODY_LINES) sg2d_debugging.undrawSG2DBodyLines(sprite.tile);
}

/** @public */
sg2d_application_SG2DApplication.setCellSizePix = function(v) {
	sg2d_consts.CELLSIZEPIX = +v;
	sg2d_consts.CELLSIZEPIX05 = (+v)>>1;
	sg2d_consts.CELLSIZELOG2 = Math.ceil(Math.log2(sg2d_consts.CELLSIZEPIX));
}
// CONCATENATED MODULE: ./src/sg2d-tilebody.js
/**
 * SG2DBody
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */








class sg2d_tilebody_SG2DTileBody extends sg2d_tile_SG2DTile {
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
		var cx = sg2d_utils.PXtoCX(pxy.x), cy = sg2d_utils.PXtoCX(pxy.y);
		for (var x = cx - cells_indent; x <= cx + cells_indent; x++) {
			for (var y = cy - cells_indent; y <= cy + cells_indent; y++) {
				if (cluster = sg2d_clusters_SG2DClusters.getCluster(x, y)) {
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

sg2d_tilebody_SG2DTileBody.isBody = true;

/** default MatterJS parameters */
sg2d_tilebody_SG2DTileBody.MATTER = {
	DENSITY: 1,
	FRICTION: 0,
	FRICTIONAIR: 0.1,
	FRICTIONSTATIC: 1,
	RESTITUTION: 0,
	SLOP: 0.05
};
// CONCATENATED MODULE: ./src/sg2d-fonts.js
/**
 * SG2DFonts
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */







class SG2DFonts {
	static addFont(options) {
		var font = SG2DFonts[options.name] = {};
		font.symbols = {};
		font.schema = options.schema;
		
		var m = options.texture.match(/(.+)_(\d+)x(\d+)(\w)?(\.\w+)?$/);
		if (m) {
			font.base_name = m[1];
			font.w = +m[2];
			font.h = +m[3];
			for (var index = 0; index < options.schema.length; index++) {
				font.symbols[options.schema[index]] = PIXI.Texture.from(font.base_name + "_" + (1+index));
			}
		}
	}
}

class sg2d_fonts_SG2DLabel {
	constructor(text, options) {
		this.options = options || {};
		options.x = options.x || 0;
		options.y = options.y || 0;
		options.scale = options.scale || 1;
		
		this.setText(text);
	}
	setText(text) {
		if (this.container) {
			this.container.removeChildren();
		} else {
			this.container = new PIXI.Container();
		}
		
		var font = SG2DFonts[this.options.font];
		if (! font) { console.warn("Error: font \"" + this.options.font + "\" not founded!"); return false; }
		
		this.container.x = this.options.x;
		this.container.y = this.options.y;
		
		var px = 0;
		var py = 0;
		text = '' + text;
		for (var i = 0; i < text.length; i++) {
			var c = text[i];
			var texture = font.symbols[c];
			if (texture) {
				var sprite = new PIXI.Sprite(texture);
				sprite.position.x = this.options.x + px;
				sprite.position.y = this.options.y;
				sprite.scale.set(this.options.scale);
				if (this.options.tint) sprite.tint = this.options.tint;
				this.container.addChild(sprite);
			} else {
				if (c !== " ") {
					console.warn("Error! The symbol \"" + c + "\" is missing in the font \"" + this.options.font + "\"!");
				}
			}
			px += font.w * this.options.scale;
		}
		
		var sg2d = this.options.sg2d || sg2d_application_SG2DApplication.getInstance();
		var container = (this.options.layer ? sg2d.layers[this.options.layer].container : sg2d.viewport);
		container.addChild(this.container);
	}
}

class sg2d_fonts_SG2DLabelCanvas {
	constructor(text, options) {
		this.options = options || {};
		this.canvas = sg2d_utils.createCanvas(1, 1, sg2d_utils.FLAG_CANVAS_ELEMENT);
		if (options.parent) {
			options.parent.append(this.canvas);
		}
		this.setText(text);
	}
	setText(text) {
		
		var font = SG2DFonts[this.options.font];
		if (! font) { console.warn("Error: font \"" + this.options.font + "\" not founded!"); return false; }
		
		var px = 0;
		var py = 0;
		text = '' + text;
		
		this.canvas.width = font.w * text.length;
		this.canvas.height = font.h;
		
		for (var i = 0; i < text.length; i++) {
			var c = text[i];
			var texture = font.symbols[c];
			if (texture) {
				sg2d_utils.drawTextureToCanvas(texture, this.canvas, {x: px, y: 0});
			} else {
				if (c !== " ") {
					console.warn("Error! The symbol \"" + c + "\" is missing in the font \"" + this.options.font + "\"!");
				}
			}
			px += font.w;
		}
	}
}
// CONCATENATED MODULE: ./src/sg2d-sprite.js
/**
 * SG2DSprite
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */





/**
 * SG2DSprite - custom sprite, for example, an icon opposite the resource counter
 */
class sg2d_sprite_SG2DSprite {
	/**
	 * @param {string|object} texture
	 * @param {object} options
	 * @param {number}			[options.x=0]
	 * @param {number}			[options.y=0]
	 * @param {(number|object)}	[options.scale=1]
	 * @param {(number|object)}	[options.anchor=1]
	 * @param {number}			[options.angle=0]
	 * @param {number}			[options.alpha=1]
	 * @param {boolean}		[options.visible=true]
	 * @param {boolean}		[options.interactive=false]
	 * @param {boolean}		[options.buttonMode=false]
	 * @param {function}		[options.pointerdown=void 0]
	 * @param {function}		[options.pointerup=void 0]
	 * @param {function}		[options.pointerupoutside=void 0]
	 * @param {function}		[options.pointerover=void 0]
	 * @param {function}		[options.pointerout=void 0]
	 * @param {object} [data=void 0]  Object properties go to this context
	 */
	constructor(texture, options, data = void 0) {
		options = options || sg2d_sprite_SG2DSprite._options;
		this.sprite = new PIXI.Sprite(typeof texture === "string" ? PIXI.Texture.from(texture) : texture);
		this.sprite.x = options.x || 0;
		this.sprite.y = options.y || 0;
		options.scale = options.scale || {};
		if (typeof options.scale === "number") options.scale = {x: options.scale, y: options.scale};
		this.sprite.scale.x = options.scale.x === void 0 ? 1 : options.scale.x;
		this.sprite.scale.y = options.scale.y === void 0 ? 1 : options.scale.y;
		options.anchor = options.anchor || {};
		if (typeof options.anchor === "number") options.anchor = {x: options.anchor || 0, y: options.anchor || 0};
		this.sprite.anchor.set(options.anchor.x, options.anchor.y);
		this.sprite.angle = options.angle === void 0 ? 0 : options.angle;
		this.sprite.alpha = options.alpha === void 0 ? 1 : options.alpha;
		this.sprite.visible = options.visible === void 0 ? true : options.visible;
		this.sprite.interactive = options.interactive ? true : false;
		this.sprite.buttonMode = options.buttonMode ? true : false;
		
		if (options.pointerdown) this.sprite.on("pointerdown", options.pointerdown);
		if (options.pointerup) this.sprite.on("pointerup", options.pointerup);
		if (options.pointerupoutside) this.sprite.on("pointerupoutside", options.pointerupoutside);
		if (options.pointerover) this.sprite.on("pointerover", options.pointerover);
		if (options.pointerout) this.sprite.on("pointerout", options.pointerout);
		
		var container = (options.layer ? sg2d_application_SG2DApplication.getInstance().layers[options.layer].container : sg2d_application_SG2DApplication.getInstance().viewport);
		container.addChild(this.sprite);
		
		if (typeof data === "object") Object.assign(this, data);
		this.sprite.sg2dSprite = this;
	}
}

sg2d_sprite_SG2DSprite._options = {};
// CONCATENATED MODULE: ./src/sg2d-message-toast.js
/**
 * SG2DMessageToast
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */



// Popup notification for a while, and then fade out
let SG2DMessageToast = {
	
	process: { state: 0, t: void 0, opacity: 1 },
	eDiv: void 0,
	eMessage: void 0,
	
	holdInterval: 500,
	
	fadeOutInterval: 1000,
	fadeOutSteps: 20,
	fadeOutIntervalStep: void 0,
	opacityStep: void 0,
	
	STATE_IDLE: 0,
	STATE_HOLD: 1,
	STATE_FADEOUT: 2,
	
	initialize: function() {
		if (! this.eDiv) {
			this.eDiv = document.querySelector("#message_toast");
			if (! this.eDiv) {
				document.body.insertAdjacentHTML("beforeend",`
<div id="message_toast" style="color: white; position: fixed; left: 50%; margin-right: -50%; background: transparent; transform: translate(-50%, 200%); display: none">
	<div class="content">
		<div class="js-message" style="color: #fff; font: 20pt bold Arial;"></div>
	</div>
</div>`
				);
				this.eDiv = document.querySelector("#message_toast");
			}
			
			this.eMessage = this.eDiv.querySelector(".js-message");
			this.fadeOutIntervalStep = ~~(this.fadeOutInterval / this.fadeOutSteps);
			this.opacityStep = 1 / SG2DMessageToast.fadeOutSteps;
		}
		
		this.startFadeOut = this.startFadeOut.bind(this);
		this.fadeOut = this.fadeOut.bind(this);
	},
	
	show: function(config) {
		
		this.initialize();
		
		if (this.process.state) {
			clearInterval(this.process.t);
			this.process.t = null;
		}
		
		this.process.state = this.STATE_HOLD;
		this.process.t = setTimeout(this.startFadeOut, this.holdInterval);
		
		this.eMessage.innerHTML = config.text;
		this.eDiv.style.display = "block";
		this.eDiv.style.opacity = 0.99;
	},
	
	startFadeOut: function() {
		this.process.t = setInterval(this.fadeOut, this.fadeOutIntervalStep);
	},
	
	fadeOut: function() {
		this.eDiv.style.opacity -= this.opacityStep;
		if (this.eDiv.style.opacity <= 0) {
			this.eDiv.style.opacity = 1;
			this.eDiv.style.display = "none";
			clearInterval(this.process.t);
			this.process.t = null;
			this.process.state = this.STATE_IDLE;
		}
	}
}

/* harmony default export */ var sg2d_message_toast = (SG2DMessageToast);
// CONCATENATED MODULE: ./src/sg2d.js
/**
 * SG2D 1.0.0
 * 2D game engine based on PixiJS and MatterJS, optimized by tile clustering
 * https://github.com/VediX/sg2d.github.io
 * SG2D may be freely distributed under the MIT license
 * (c) Kalashnikov Ilya 2019-2021
 */


























var sg2d_SG2D = {
	Model: sg_model["a" /* default */],
	Deferred: sg2d_deferred,
	Consts: sg2d_consts,
	Math: sg2d_math,
	Utils: sg2d_utils,
	Application: sg2d_application_SG2DApplication,
	Clusters: sg2d_clusters_SG2DClusters,
	Camera: sg2d_camera_SG2DCamera,
	Tile: sg2d_tile_SG2DTile,
	TileBody: sg2d_tilebody_SG2DTileBody,
	Pointer: sg2d_pointer_SG2DPointer,
	Effects: sg2d_effects_SG2DEffects,
	Plugins: SG2DPlugins,
	PluginBase: SG2DPluginBase,
	Debugging: sg2d_debugging,
	Bounds: SG2DBounds,
	Cluster: sg2d_cluster_SG2DCluster,
	Fonts: SG2DFonts,
	Label: sg2d_fonts_SG2DLabel,
	LabelCanvas: sg2d_fonts_SG2DLabelCanvas,
	Sprite: sg2d_sprite_SG2DSprite,
	MessageToast: sg2d_message_toast,
	Sound: sg2d_sound
};

sg2d_SG2D.pixi = null;
sg2d_SG2D.matter = null;
sg2d_SG2D.version =  true ? "1.0.0" : undefined;
sg2d_SG2D.LAYER_POSITION_ABSOLUTE = 0;
sg2d_SG2D.LAYER_POSITION_FIXED = 1;

if (typeof window === 'object' && window.document) window["SG2D"] = sg2d_SG2D;

/* harmony default export */ var src_sg2d = __webpack_exports__["default"] = (sg2d_SG2D);

/***/ })
/******/ ])["default"];
});