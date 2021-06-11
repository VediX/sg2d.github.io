/**
 * SG2DPluginBase 1.0.0
 * Base class for the plugin
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya
 */

"use strict";

export default class SG2DPluginBase {
	
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