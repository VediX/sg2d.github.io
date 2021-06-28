/**
 * SG2D Example
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */

"use strict";

import GraphicsPreparer from "./classes/graphics-preparer.js";
import SceneEffects from "./classes/scene-effects.js";
import SceneUI from "./classes/scene-ui.js";
import Area from "./classes/area.js";
import Menu from "./classes/menu.js";
import Player from "./classes/player.js";

class Application {
	
	constructor() {
		
		window.app = this;
		
		let btnPlay = document.querySelector("#btnPlay");
		btnPlay.dataset.state = "ready";
		
		btnPlay.addEventListener("click", ()=>{
			
			btnPlay.dataset.state = "loading";
			
			Promise.all([
				GraphicsPreparer.load(),
				SG2D.Sound.load({
					music_dir: "./res/music/",
					sounds_dir: "./res/sounds/",
					config: "./res/sound.json"
				}, {
					sounds: true,
					music: true,
					musicVolume: 10,
					volumeDecreaseDistance: 10, // units changes in clusters
					environment2D: true,
					view: "scene" // You can start the melodies in this way or in another way, see below
				}),
				Menu.load()
			]).then(()=>{
				document.querySelector("#loader_screen").style.display = "none";
				document.querySelector("#game_screen").style.display = "block";
				this.createScene();
				//SG2D.Sound.musicPlay("scene"); // The second way to play the melody in a circle for the specified view
			});
		});
	}
	
	createScene() {
		
		this.scene =  new SG2D.Application({
			canvasId: "canvas",
			cellsizepix: 64,
			clusters: {
				areasize: 64
			},
			pixi: { // config passed to PIXI.Application constructor
				antialias: true,
				autoStart: false
			},
			matter: {
				gravity: { x: 0, y: 0 },
				broadphase: { bucketWidth: 64, bucketHeight: 64 }
			},
			camera: {
				rotation: true,
				rotate: 45,
				position: {x: 224, y: 224}, // Start position of the camera. Default [0, 0]
				scale_min: 2,
				scale_max: 8,
				movement_by_pointer: SG2D.Camera.MOVEMENT_BY_POINTER_RIGHT,
				rotate_adjustment: -90 // Base offset of the camera angle in degrees. Default 0
			},
			pointer: {
				cursors: {
					default: GraphicsPreparer.cursors.default,
					hover: GraphicsPreparer.cursors.target,
					move: GraphicsPreparer.cursors.move
				}
			},
			iterate: this.iterate.bind(this),
			resize: this.resize.bind(this),
			layers: {
				bottom: {},
				fluids: {},
				grounds: {},
				roads: {},
				bodies: {},
				trees: {},
				animations: {},
				interface: { position: SG2D.LAYER_POSITION_FIXED, zIndex: 10 }
			},
			plugins: ["sg2d-transitions"],
			sound: true // or for example: { sounds_dir: "./res/sounds/level1/", config: "./res/sounds_for_level1.json" }
		});
		
		let camera = this.scene.camera;

		// Print information to the console about the current scaling
		camera.on("scale", (scale)=>{
			SG2D.MessageToast.show({ text: "Scale: " + camera.getScale().percent + "%" });
		}, void 0, void 0, true);

		// Generate the map
		this.area = Area.build(this.scene.clusters);

		// Graphic effects
		this.sceneEffect = SceneEffects.toApply(this.scene);
		
		this.player = new Player({
			position: this.scene.clusters.getCluster(5,5).position,
			angle: 45
		}, {
			pointer: this.scene.pointer,
			camera: camera
		});
		
		this.sceneUI = SceneUI.toApply(this.scene, this.player);
		
		this.scene.run();
		
		camera.followTo(this.player);
		/* TODO:
		camera.setRelativity({
			follow: this.player, // The camera can move smoothly behind player. Also, camera can be moved to any on map, after which it will also move in parallel with player
			scaling: this.player, //TODO: The camera is zoomed relative to cursor position, or relative to tile
			rotation: this.player //TODO: The camera is rotated either relative to center of the screen, or relative to player
		});*/
		
		return this.scene;
	}
	
	iterate() {
		if (this.scene.frame_index % 30 === 0) {
			document.querySelector("#info > span:nth-child(1)").innerText = (1 / this.scene.tRequestAnimationFrame).toFixed(0); // FPS
			document.querySelector("#info > span:nth-child(2)").innerText =SG2D.Application.spritesCount; // Sprites count
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