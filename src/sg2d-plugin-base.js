"use strict";

/**
 * Базовый класс для плагинов
 * @alias SG2D.PluginBase
 * @return {SG2D.PluginBase}
 */
class SG2DPluginBase {
	
	/**
	 * Промис готовности плагина. Используется для выполнения методов вашего плагина только после успешной загрузки и инициализации плагина.
	 * @param {function} [success=void 0]
	 * @param {function} [failed=void 0]
	 * @returns {Promise}
	 * @example
	 * import SG2DTransitions from "./sg2d/plugins/sg2d-transitions.js";
	 * ...
	 * SG2DTransitions.ready(()=>{
	 *	SG2DTransitions.run(sg2dApp.clusters);
	 * });
	 */
	static ready(success = void 0, failed = void 0) {
		if (! this._ready) {
			this._ready = new Promise((_success, _failed)=>{
				this.success = _success;
				this.failed = _failed;
			});
		}
		if (success || failed) {
			this._ready.then(success || (()=>{}), failed || (()=>{}));
		}
		return this._ready;
	}
	
	/**
	 * Конструктор. Переопределяется, обязательно с вызовом **super()**. В конструкторе должен быть вызван один из статических методов плагина - failed() или success(). В конструкторе можно выполнить некоторую инициализацию, например, сгенерировать графические маски.
	 * @example
	 * class SG2DTransitions extends SG2D.PluginBase {
	 *	...
	 *	constructor(...args) {
	 *		super(...args);
	 *		...
	 *		if (bError) {
	 *			SG2DTransitions.failed("Error: message error!");
	 *		} else {
	 *			SG2DTransitions.success();
	 *		}
	 *	}
	 *	...
	 * }
	 */
	constructor() {
		if (this.constructor._instance) throw "Error! A plugin class can only have one instance!";
		this.constructor._instance = this;
		this.constructor.ready();
	}
}

export default SG2DPluginBase;