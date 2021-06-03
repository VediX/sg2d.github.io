import SG2DSprite from './../../sg2d-sprite.js';
import {SG2DLabelCanvas, SG2DLabel} from "./../../sg2d-fonts.js";

export default class SceneUI {
	
	static TYPE_PLAYER = 1;
	static TYPE_CAMERA = 2;
	
	static toApply(scene, player) {
		
		this.scene = scene;
		this.player = player;
		
		let options = {
			layer: "interface",
			scale: 0.7,
			interactive: true,
			buttonMode: true,
			pointerdown: this.onPointerDown,
			pointerup: this.onPointerUp,
			pointerupoutside: this.onPointerUp,
			pointerover: this.onPointerOver,
			pointerout: this.onPointerOut,
			alpha: 0.5
		};
		
		this.buttonA = new SG2DSprite("ui/button_A", options, { sceneUI: this, code: "KeyA", type: SceneUI.TYPE_PLAYER });
		this.buttonW = new SG2DSprite("ui/button_W", options, { sceneUI: this, code: "KeyW", type: SceneUI.TYPE_PLAYER });
		this.buttonD = new SG2DSprite("ui/button_D", options, { sceneUI: this, code: "KeyD", type: SceneUI.TYPE_PLAYER });
		this.buttonS = new SG2DSprite("ui/button_S", options, { sceneUI: this, code: "KeyS", type: SceneUI.TYPE_PLAYER });
		
		this.buttonCameraMoveLeft = new SG2DSprite("ui/button_left", options, { sceneUI: this, code: "CameraMoveLeft", type: SceneUI.TYPE_CAMERA });
		this.buttonCameraMoveRight = new SG2DSprite("ui/button_right", options, { sceneUI: this, code: "CameraMoveRight", type: SceneUI.TYPE_CAMERA });
		this.buttonCameraMoveUp = new SG2DSprite("ui/button_up", options, { sceneUI: this, code: "CameraMoveUp", type: SceneUI.TYPE_CAMERA });
		this.buttonCameraMoveDown = new SG2DSprite("ui/button_down", options, { sceneUI: this, code: "CameraMoveDown", type: SceneUI.TYPE_CAMERA });
		this.buttonCameraMoveToPlayer = new SG2DSprite("ui/button_center", options, { sceneUI: this, code: "CameraMoveToPlayer", type: SceneUI.TYPE_CAMERA });
		this.buttonCameraScaleIn = new SG2DSprite("ui/button_plus", options, { sceneUI: this, code: "CameraScaleIn", type: SceneUI.TYPE_CAMERA });
		this.buttonCameraScaleOut = new SG2DSprite("ui/button_minus", options, { sceneUI: this, code: "CameraScaleOut", type: SceneUI.TYPE_CAMERA });
		
		// Place the CANVAS label in the DOM element using a graphical font
		document.querySelector("#title").innerText = "";
		this.sgTitle = new SG2DLabelCanvas("SG2D EXAMPLE", {
			font: "metal_yellow_big",
			parent: document.querySelector("#title")
		});
		
		this.scoreLabel = new SG2DLabel("SCORE:", {
			font: "metal_yellow_big",
			x: 5, y: 5, scale: 0.4, angle: 0, layer: "interface", tint: 0xAAFFAA
		});
		this.scoreValue = new SG2DLabel("0", {
			font: "metal_yellow_big",
			x: 60, y: 5, scale: 0.4, angle: 0, layer: "interface", tint: 0xFF44FF
		});
		
		this.resize();
		
		return this;
	}
	
	static onPointerOver() {
		this.alpha = 1;
	}

	static onPointerOut() {
		this.alpha = 0.5;
	}
	
	static onPointerDown() {
		this.tint = 0xFF6666;
		switch (this.sg2dSprite.type) {
			case SceneUI.TYPE_PLAYER: this.sg2dSprite.sceneUI.player.keyProcess({ code: this.sg2dSprite.code, type: "keydown" }); break;
			case SceneUI.TYPE_CAMERA:
				switch (this.sg2dSprite.code) {
					case "CameraScaleIn": this.sg2dSprite.sceneUI.scene.camera.zoomInc(1); break;
					case "CameraScaleOut": this.sg2dSprite.sceneUI.scene.camera.zoomInc(-1); break;
					case "CameraMoveLeft": this.sg2dSprite.sceneUI.scene.camera.moveOffset(void 0, -180); break;
					case "CameraMoveRight": this.sg2dSprite.sceneUI.scene.camera.moveOffset(void 0,0); break;
					case "CameraMoveUp": this.sg2dSprite.sceneUI.scene.camera.moveOffset(void 0,90); break;
					case "CameraMoveDown": this.sg2dSprite.sceneUI.scene.camera.moveOffset(void 0,-90); break;
					case "CameraMoveToPlayer": this.sg2dSprite.sceneUI.scene.camera.set("offset", {x: 0, y: 0}); break;
				}
				break;
		}
	}

	static onPointerUp() {
		this.tint = 0xFFFFFF;
		switch (this.sg2dSprite.type) {
			case SceneUI.TYPE_PLAYER: this.sg2dSprite.sceneUI.player.keyProcess({ code: this.sg2dSprite.code, type: "keyup" }); break;
		}
	}
	
	static resize() {
		let w = this.buttonA.sprite.width;
		let x_base = this.scene.canvas.width / 2 - w/2;
		let y_base = this.scene.canvas.height - w - 5;
		this.buttonA.sprite.position.set(x_base - w - 5, y_base);
		this.buttonD.sprite.position.set(x_base + w + 5, y_base);
		this.buttonW.sprite.position.set(x_base, y_base - w - 5);
		this.buttonS.sprite.position.set(x_base, y_base);
		
		x_base = this.scene.canvas.width - w - 5;
		y_base = this.scene.canvas.height - 5;
		this.buttonCameraScaleOut.sprite.position.set(x_base, y_base - w - w);
		this.buttonCameraScaleIn.sprite.position.set(x_base, y_base - w);
		
		x_base = w + 5;
		y_base = this.scene.canvas.height - w - w - 10;
		this.buttonCameraMoveLeft.sprite.position.set(x_base - w - 5, y_base);
		this.buttonCameraMoveRight.sprite.position.set(x_base + w + 5, y_base);
		this.buttonCameraMoveUp.sprite.position.set(x_base, y_base - w - 5);
		this.buttonCameraMoveDown.sprite.position.set(x_base, y_base + w + 5);
		this.buttonCameraMoveToPlayer.sprite.position.set(x_base, y_base);
	}
}