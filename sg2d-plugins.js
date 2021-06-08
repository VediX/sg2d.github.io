/**
 * SG2DPlugins 1.0.0
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

export default class SG2DPlugins {
	
	static files = {};
	static classes = {};
	static instances = {};
	
	/** @public */
	static load(plugins) {
		plugins = typeof plugins === "object"
		? (Array.isArray(plugins)
			? plugins.reduce((accumulator, currentValue)=>{
				accumulator[currentValue] = {};
				return accumulator
			}, {})
			: plugins)
		: {};
		let promises = [];
		for (let p in plugins) {
			if (! this.files[p]) {
				let promise = new Promise((success, failed)=>{
					this.files[p] = import('./plugins/'+p+'.js').then((result)=>{
						let _class = this.classes[result.default.name] = result.default;
						let instance = this.instances[result.default.code] = new _class();
						if (_class.ready) {
							_class.ready(success, failed);
						} else {
							throw "The plugin class \"" + _class.name + "\" must have a static ready() method! Maybe you didn't inherit the class from SG2DPluginBase or you didn't call super() in the constructor!";
						}
					});
				});
				promises.push(promise);
			}
		}

		return Promise.all(promises);
	}
}

if (typeof window === "object") window.SG2DPlugins = SG2DPlugins;