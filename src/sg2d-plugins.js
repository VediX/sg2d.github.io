"use strict";

/**
 * Загрузчик плагинов
 * @alias SG2D.Plugins
 */
class SG2DPlugins {}

/**
 * Промисы загрузки плагинов
 */
SG2DPlugins.files = {};

/**
 * Классы плагинов
 */
SG2DPlugins.classes = {};

/**
 * Экземпляры плагинов
 */
SG2DPlugins.instances = {};

/**
 * Подключить и выполнить скрипты плагинов. Возвращает промис, который выполняется когда все плагины подключены.
 * @protected
 * @return {Promise}
 */
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

export default SG2DPlugins;