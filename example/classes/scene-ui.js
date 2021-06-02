import SG2DSprite from './../../sg2d-sprite.js';
import {SG2DLabelCanvas, SG2DLabel} from "./../../sg2d-fonts.js";

export default class SceneUI {
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
		
		this.buttonA = new SG2DSprite("ui/button_A", options, { code: "KeyA", onTap: this.onTap, player: this.player });
		this.buttonW = new SG2DSprite("ui/button_W", options, { code: "KeyW", onTap: this.onTap, player: this.player });
		this.buttonD = new SG2DSprite("ui/button_D", options, { code: "KeyD", onTap: this.onTap, player: this.player });
		this.buttonS = new SG2DSprite("ui/button_S", options, { code: "KeyS", onTap: this.onTap, player: this.player });
		
		//this.buttonCameraMoveLeft = new SG2DSprite("ui/button_left", options, { code: "Numpad4" });
		//this.buttonCameraMoveRight = new SG2DSprite("ui/button_right", options, { code: "Numpad6" });
		//this.buttonCameraMoveUp = new SG2DSprite("ui/button_up", options, { code: "Numpad8" });
		//this.buttonCameraMoveDown = new SG2DSprite("ui/button_down", options, { code: "Numpad2" });
		//this.buttonCameraMoveToTank = new SG2DSprite("ui/button_down", options, { code: "Numpad5" });
		//this.buttonCameraScaleIn = new SG2DSprite("ui/button_plus", options, { code: "NumpadAdd" });
		//this.buttonCameraScaleOut = new SG2DSprite("ui/button_plus", options, { code: "NumpadSubtract" });
		
		// Place the CANVAS label in the DOM element using a graphical font
		document.querySelector("#title").innerText = "";
		this.sgTitle = new SG2DLabelCanvas(
			"SG2D EXAMPLE",
			{
				font: "metal_yellow_big",
				parent: document.querySelector("#title")
			}
		);
		
		//this.goldLabel = new SG2DLabel(0, { font: "metal_gold_med", x: 20, y: 38, angle: 0, layer: "interface" });
		
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
		this.isdown = true;
		this.tint = 0xFF6666;
		this.sg2dSprite.onTap(this.sg2dSprite.code, "keydown");
	}

	static onPointerUp() {
		this.isdown = false;
		this.tint = 0xFFFFFF;
		this.sg2dSprite.onTap(this.sg2dSprite.code, "keyup");
	}
	
	static onTap(code, type) {
		this.player.keyProcess({ code: code, type: type });
	}
	
	static resize() {
		let w = this.buttonA.sprite.width;
		let x_base = this.scene.canvas.width / 2 - w/2;
		let y_base = this.scene.canvas.height - w - 5;
		this.buttonA.sprite.position.set(x_base - w - 5, y_base);
		this.buttonD.sprite.position.set(x_base + w + 5, y_base);
		this.buttonW.sprite.position.set(x_base, y_base - w - 5);
		this.buttonS.sprite.position.set(x_base, y_base);
	}
}