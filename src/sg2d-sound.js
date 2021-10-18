"use strict";

import SGModel from './libs/sg-model/sg-model.js';
import SG2DUtils from './sg2d-utils.js';
import SG2DMath from './sg2d-math.js';
import SG2DCamera from './sg2d-camera.js';

/**
 * Звуки и музыка. Поддержка 2D окружения
 * @class
 * @alias SG2D.Sound
 * @returns {SG2D.Sound}
 */
var SG2DSound = { EMPTY: true };

function _SG2DSound() {
	
	Object.assign(this, new SGModel({
		music: true,
		musicVolume: 100, // from 0 to 100
		sounds: true,
		soundsVolume: 100, // from 0 to 100
		bass: false,
		muteOnLossFocus: true,
		volumeDecreaseDistance: 10, // Units changes in clusters. Distance at which the sound can no longer be heard. If value is 0, sound does not subside with increasing distance
		environment2D: true,
		
		/* // TODO: **
		 * Координаты относительно которых рассчитывается дистанция до источника звука
		 * @example
		 * ```js
		 * player.on("position", (position)=>{ this.set("environment2DPosition", position); }); // Пример обновления координат в экземпляре SG2D.Sound
		 * ```
		 */
		//environment2DPosition: { x: 0, y: 0 }, TODO
		
		view: "", // Current view code
		_focusLoss: false // global mute when focus loss browser
	}));
	
	this.sounds = {};
	this.musics = {}; // flat list of all music ([] * PIXI.sound.Sound)
	this.music_views = {}; // Views and list music
	this.music_view = null; // Current view object
	
	// @protected
	this.bass = void 0;
	
	this._options = {
		config: void 0,
		music_dir:  void 0,
		sounds_dir: void 0,
		library_pathfile: void 0
	};
	
	this._initializationRunned = false;
	
	this._gestureDetected = false;
	
	/**
	 * Загрузчик звуковой библиотеки и установщик параметров. SG2D.Sound.load() можно вызывать много раз для загрузки индивидуальной конфигурации, например, для каждого уровня игры.
	 * @function SG2D.Sound#load
	 * @param {object}		[options={}] - Настройки путей
	 * @param {object|string}	[options.config="./res/sound.json"] - Объект конфигурации или путь к JSON-файлус конфигурацией
	 * @param {string}			[options.music_dir="./res/music/"] - Основная директория с музыкой
	 * @param {string}			[options.sounds_dir="./res/sounds/"] - Основная директория со звуками
	 * @param {string}			[options.library_pathfile="./libs/pixi/pixi-sound.js"] - Путь к файлу библиотеки PIXI.Sound применяется только при первой передаче параметра
	 * @param {object}		[properties={}] - Начальные параметры звука
	 * @param {boolean}		[properties.sounds=true] - Включить звуки
	 * @param {boolean}		[properties.music=true] - Включить музыку
	 * @param {number}			[properties.musicVolume=100] - Громкость музыки от 0 до 100
	 * @param {number}			[properties.soundsVolume=100] - Громкость звуков от 0 до 100
	 * @param {boolean}		[properties.muteOnLossFocus=true] - Выключать звук при потере фокуса приложения
	 * @param {number}			[properties.volumeDecreaseDistance=0] - Громкость звука зависит от расстояния до источника звука
	 * @param {boolean}		[properties.environment2D=true] - Включить 2D звуковое окружение
	 * @param {boolean}		[properties.bass=false] - Усиленные низкие частоты
	 * @param {string}		[properties.view=void 0] - Текущий view
	 * @return {Promise}
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
				this._loadConfig(this._options.config, resolve, reject);
			});
		} else {
			promise = Promise.resolve();
		}
		
		return promise;
	};
	
	this._libraryLoaded = false;
	
	this._libraryLoad = (options = {}, resolve, reject)=>{
		
		let promise;
		
		if (! this._libraryLoaded) {
			this._libraryLoaded = true;
			
			promise = SG2DUtils.loadJS(this._options.library_pathfile, (event)=>{
				
				this.visibilityChange();
				
				this.bass = [
					new PIXI.sound.filters.ReverbFilter(1, 100),
					new PIXI.sound.filters.EqualizerFilter(13, 15, 6, -1, 0, 0, 0, 0, 0, 0)
				];
				
				if (options.config) {
					this._loadConfig(options.config, resolve, reject);
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
	
	this._sg2dconnect = (sg2d)=>{
		this.sg2d = sg2d;
	};
	
	this._loadConfig = (config, resolve, reject)=>{
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
	 * Запуск проигрывания музыки
	 * @function SG2D.Sound#musicPlay
	 * @param {string|bool}	[viewcode=true] - Код страницы или true. Если true, то воспроизводится текущая музыка.
	 * @param {object}		[options={}] - Параметры переданные в метод play(), например громкость звука, скорость воспроизведения, время начала и окончания.
	 * @param {boolean}	[strict=false] - При true если мелодия не загружена, то консоль выдаст ошибку.
	 * @return {boolean} true, если успешно
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
		
		this.set("view", this.music_view.viewcode, void 0, SGModel.FLAG_NO_CALLBACKS);
		
		this.music_view.status = true;
		
		if (! this.music_view.list.length) return false;
		
		if (this.properties.music && PIXI.sound) {
			
			options = SGModel.defaults(options, {
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
	
	
	this._sound = { file: "" };
	
	this._config = {};
	
	/**
	 * Play sound
	 * @function SG2D.Sound#play
	 * @param {string|object} Sound name or base sound object from sounds.json
	 * @param {object} config_or_tile Sound settings overriding basic sounds.json or Tile instance
	 * @param {object} tile If a tile is specified, then position is taken from it to calculate the distance and sound volume
	 * @return {object} Экземпляр звука PIXI Sound
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
				let camera = SG2DCamera.getInstance(true);
				if (tile && camera) {
					let maxd = this.properties.volumeDecreaseDistance * 64;
					let pp = camera.get("position");
					let tp = tile.get("position");
					let d = SG2DMath.distance_p(pp, tp);
					options.volume *= Math.max(0, 1 - d / maxd);
				}
				if (SG2DCamera.getInstance(true)) {
					options.volume = options.volume * SG2DCamera.get("scale") / SG2DCamera.SCALE_NORMAL;
				}
			}
			
			options.speed = config.speed || sound.speed || 1;
			options.start = config.start || sound.start || 0;
			if (config.end) options.end = config.end; else if (sound.end) options.end = sound.end;
			
			instance = sound.sound.play(options);
			
			if (tile) tile.sound_instance = instance;
			
			// 2D Environment
			if (this.properties.environment2D) {
				let camera = SG2DCamera.getInstance(true);
				if (tile && camera) {
					// TODO: PIXI.Sound does not currently support instance-level filters!
					//tile.sound.filters[0].pan = Math.min(1, Math.max(-1, 3*(dx - ppx)/visd));
					// START OF CRAWLER: // TODO are waiting for the official release, or you need to look at https://codepen.io/Rumyra/pen/qyMzqN/ or https://howlerjs.com/
					let pan = SG2DMath.sin( SG2DMath.angle_p1p2_deg(camera.get("position"), tile.get("position"), 0) - SG2DCamera.get("rotate") );
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
	
	_SG2DSound.prototype = SGModel.prototype;
	SG2DSound = new _SG2DSound();
}

export default SG2DSound;