/**
 * SG2D Example
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

import SG2D from "../sg2d.js";
import SG2DTile from "../sg2d-tile.js";
import SG2DCamera from "../sg2d-camera.js";

import GraphicsPreparer from "./classes/graphics-preparer.js";
import SceneEffects from "./classes/scene-effects.js";
import SceneUI from "./classes/scene-ui.js";
import Area from "./classes/area.js";
import Menu from "./classes/menu.js";
import Player from "./classes/player.js";

class Application {
	
	static AREASIZE = 128;
	static CELLSIZEPIX = 64;
	
	constructor() {
		
		window.app = this;
		
		Promise.all([
			GraphicsPreparer.load(),
			Menu.load()
		]).then(this.createScene.bind(this));
	}
	
	createScene() {
		//PIXI.settings.ROUND_PIXELS = true; // If true, PixiJS will use Math.floor () x / y values when rendering, stopping pixel interpolation
		//PIXI.settings.ANISOTROPIC_LEVEL = 16; // Default anisotropic filtering level for textures. Typically 0 to 16
		//PIXI.settings.CAN_UPLOAD_SAME_BUFFER = true; // Can we load the same buffer in one frame?
		//PIXI.settings.FILTER_RESOLUTION = 1;
		//PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.POW2; // If set to true, WebGL will try to make textures anti-aliased by default (PIXI.MIPMAP_MODES.POW2 | PIXI.MIPMAP_MODES.ON | PIXI.MIPMAP_MODES.OFF)
		//PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR; // LINEAR (smooth) | NEAREST (pixel)
		//PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.CLAMP; // CLAMP | REPEAT | MIRRORED_REPEAT
		//PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.MEDIUM;
		this.scene =  new SG2D({
			canvasId: "canvas",
			cellsizepix: Application.CELLSIZEPIX,
			pixi: { // config passed to PIXI.Application constructor
				antialias: true,
				autoStart: false
			},
			camera: {
				rotation: true,
				rotate: 0,
				position: {x: 224, y: 224}, // Start position of the camera. Default [0, 0]
				scale_min: 2,
				scale_max: 16,
				movement_by_pointer: SG2DCamera.MOVEMENT_BY_POINTER_RIGHT,
				rotate_adjustment: -90 // Base offset of the camera angle in degrees. Default 0
			},
			clusters: {
				areasize: Application.AREASIZE
			},
			mouse: {
				cursors: {
					default: GraphicsPreparer.cursors.default,
					hover: GraphicsPreparer.cursors.target,
					move: GraphicsPreparer.cursors.move
				}
			},
			iterate: this.iterate.bind(this),
			resize: this.resize.bind(this),
			layers_enabled: true,
			layers: {
				grounds: {},
				fluids: {},
				roads: {},
				bodies: {},
				animations: {},
				interface: { position: SG2D.LAYER_POSITION_FIXED, zindex: 10 }
			},
			plugins: ["sg2d-transitions"]
		});
		
		let camera = this.scene.camera;

		// Print information to the console about the current scaling
		/*camera.on("scale", (scale)=>{
			console.log("New camera scale: " + camera.getScale().percent + "%");
		}, void 0, void 0, true);*/

		// Generate the map
		Area.build(this.scene.clusters);

		// Graphic effects
		this.sceneEffect = SceneEffects.toApply(this.scene);
		
		this.player = new Player({ position: this.scene.clusters.getCluster(5,5).position, angle: 0 }, { mouse: this.scene.mouse, camera: camera });
		
		/**
		* The camera can move smoothly behind the player.
		* The camera can be moved anywhere on the map, after which it will also move in parallel with the player.
		* The camera is rotated either relative to the center of the screen, or relative to the player (TODO).
		* The camera is zoomed relative to the cursor position (TODO).
		*/
		camera.followTo(this.player);
		
		this.sceneUI = SceneUI.toApply(this.scene, this.player);
		
		this.scene.run();
	}
	
	iterate() {
		for (var tile of this.scene.clusters.tilesset) {
			tile.iterate && tile.iterate();
		}
		
		if (this.scene.frame_index % 30 === 0) {
			document.querySelector("#info > span").innerText = (1 / this.scene.tRequestAnimationFrame).toFixed(0); // FPS info
		}
	}
	
	resize() {
		this.sceneUI.resize();
	}
	
	destroy() {
		this.player.destroy();
		this.scene.destroy();
	}
}

new Application();