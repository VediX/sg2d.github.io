/**
 * SG2DPlugins 1.0.0
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya
 */

"use strict";

export default class SG2DPlugins {}
	
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