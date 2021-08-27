/**
 * SGModelView 1.0.3
 * Add-on over SGModel that allows you to bind data in JavaScript with visual elements of HTML document using MVVM pattern.
 * https://github.com/VediX/SGModel
 * (c) 2021 Kalashnikov Ilya
 * SGModelView may be freely distributed under the MIT license
 */

"use strict";

import SGModel from "./sg-model.js";

export default class SGModelView extends SGModel {
	
	/**
	 * Overriding the set method
	 */
	set(name, ...args) {
		if (super.set.apply(this, arguments) && (this._binderInitialized)) {
			this._refreshElement(name);
		}
	}
	
	/**
	 * Perform Data and View Binding (MVVM)
	 * @param {string|HTMLElement} [root=void 0]
	 */
	bindHTML(root = void 0) {
		
		if (! this._binderInitialized) {
			if (typeof document === "undefined") throw "Error! document is undefined!";
			this._onChangeDOMElementValue = this._onChangeDOMElementValue.bind(this);
			this._elementsHTML = {};
			this._binderInitialized = true;
		}
		
		if (! root) root = document.body;
		if (typeof root === "string") root = document.querySelector(root);
		for (var name in this._elementsHTML) {
			this._elementsHTML[name].removeEventListener("change", this._onChangeDOMElementValue);
			this._elementsHTML[name].removeEventListener("input", this._onChangeDOMElementValue);
			delete this._elementsHTML[name];
		}
		this._bindElements([root]);
	}
	
	/** @private */
	_bindElements(elements) {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			
			if (element.nodeType !== 1) continue;
			
			var sgProperty = element.getAttribute("sg-property");
			var sgType = element.getAttribute("sg-type");
			var sgFormat = element.getAttribute("sg-format");
			//var sgAttributes = element.getAttribute("sg-attributes"); // TODO
			var sgCSS = element.getAttribute("sg-css");
			
			if (this.has(sgProperty)) {
				this._elementsHTML[sgProperty] = element;
				element._sg_property = sgProperty;
				element._sg_type = sgType;
				if (sgCSS) {
					for (var p in this.properties) {
						var re = new RegExp("^"+p+"$|^"+p+"\\W|\\W"+p+"$|\\W"+p+"\\W", "g");
						sgCSS = sgCSS.replace(re, "this.properties."+p);
					}
					element._sg_css = (new Function("return " + sgCSS)).bind(this);
					element._sg_css_static_classes = [...element.classList];
				}
				element._sg_format = this[sgFormat];
				switch (sgType) {
					case "dropdown":
						var eItems = document.querySelectorAll("[sg-dropdown=" + sgProperty + "]");
						for (var i = 0; i < eItems.length; i++) {
							eItems[i].onclick = this._dropdownItemClick;
						}
						element.addEventListener("change", this._onChangeDOMElementValue);
						break;
					default: {
						if (element.type) {
							var sEvent = "";
							switch (element.type) {
								case "range": sEvent = "input"; break;
								case "radio": case "checkbox": case "text": case "button": case "select-one": case "select-multiple": sEvent = "change"; break;
							}
							if (sEvent) {
								element.addEventListener(sEvent, this._onChangeDOMElementValue);
							}
						}
					}
				}
				this._refreshElement(sgProperty);
			}
			this._bindElements(element.children);
		}
	}
	
	/** @private */
	_refreshElement(name) {
		
		var element = this._elementsHTML[name];
		if (! element) return;
		
		var value = this.properties[name];
		
		switch (element._sg_type) {
			case "dropdown":
				var eItems = document.querySelectorAll("[sg-dropdown=" + name + "]");
				for (var i = 0; i < eItems.length; i++) {
					var sgValue = eItems[i].getAttribute("sg-value");
					if (sgValue == value) {
						element.value = value;
						element.innerHTML = eItems[i].innerHTML;
						break;
					}
				}
				break;
			default: {
				if (element.type) {
					switch (element.type) {
						case "radio": case "checkbox": element.checked = value; break;
						case "range": case "text": case "button": case "select-one": element.value = value; break;
						case "select-multiple": {
							if (! Array.isArray(value)) { debugger; break; }
							for (var i = 0; i < element.options.length; i++) {
								let selected = false;
								for (var j = 0; j < value.length; j++) {
									if (element.options[i].value == value[j]) {
										selected = true;
										break;
									}
								}
								element.options[i].selected = selected;
							}
							break;
						}
					}
				} else {
					element.innerHTML = (element._sg_format ? element._sg_format(value) : value);
				}
			}
		}
		
		if (element._sg_css) {
			let result = element._sg_css();
			for (var i = 0; i < element.classList.length; i++) {
				if (element._sg_css_static_classes.indexOf(element.classList[i]) === -1) {
					element.classList.remove(element.classList[i]);
				}
			}
			if (! Array.isArray(result)) {
				result = result.split(" ");
			}
			for (var i = 0; i < result.length; i++) {
				element.classList.add(result[i]);
			}
		}
	}
	
	/** @private */
	_onChangeDOMElementValue(event) {
		let elem = event.currentTarget;
		switch (elem.type) {
			case "checkbox": this.set(elem._sg_property, elem.checked); break;
			case "radio":
				let form = this._findParentForm(elem);
				let radioButtons = form.querySelectorAll("input[name=" + elem.name+"]");
				for (var i = 0; i < radioButtons.length; i++) {
					var _elem = radioButtons[i];
					if (_elem.getAttribute("sg-property") !== elem.getAttribute("sg-property") && _elem._sg_property) {
						this.set(_elem._sg_property, _elem.checked);
					}
				}
				this.set(elem._sg_property, elem.checked);
				break;
			case "range": case "text": case "button": case "select-one": this.set(elem._sg_property, elem.value); break;
			case "select-multiple":
				let result = [];
				for (var i = 0; i < elem.selectedOptions.length; i++) {
					result.push( elem.selectedOptions[i].value );
				}
				this.set(elem._sg_property, result);
				break;
		}
	}
	
	/** @private */
	_dropdownItemClick() {
		let button = this.parentNode.parentNode.querySelector("button");
		button.value = this.getAttribute("sg-value");
		button.innerHTML = this.innerHTML;
		button.dispatchEvent(new Event('change'));
	}
	
	/** @private */
	_findParentForm(elem) {
		let parent = elem.parentNode;
		if (parent) {
			if (parent.tagName === "FORM") {
				return parent;
			} else {
				return this._findParentForm(parent);
			}
		} else {
			return document.body;
		}
	}
}

if (typeof exports === 'object' && typeof module === 'object') module.exports = SGModelView;
else if (typeof define === 'function' && define.amd) define("SGModelView", [], ()=>SGModelView);
else if (typeof exports === 'object') exports["SGModelView"] = SGModelView;
else if (typeof window === 'object' && window.document) window["SGModelView"] = SGModelView;
else this["SGModelView"] = SGModelView;