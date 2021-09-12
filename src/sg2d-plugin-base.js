"use strict";

/**
 * Базовый класс для плагинов
 * @alias SG2D.PluginBase
 * @return {SG2D.PluginBase}
 */
class SG2DPluginBase {
	
	/** @public */
	//static code = ""; // override
	
	/** @private */
	//static _instance = null; // override
	
	/** @private */
	//static _ready = null; // override
	
	/**
	 * Промис готовности плагина
	 * @param {function} [_success=void 0]
	 * @param {function} [_failed=void 0]
	 * @returns {Promise}
	 */
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
	
	/**
	 * Overridden with a call to super()
	 */
	constructor() {
		if (this.constructor._instance) throw "Error! A plugin class can only have one instance!";
		this.constructor._instance = this;
		this.constructor.ready();
	}
}

export default SG2DPluginBase;