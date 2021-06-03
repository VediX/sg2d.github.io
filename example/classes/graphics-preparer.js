import Deferred from "../../libs/deferred.js";
import SG2DFonts from "../../sg2d-fonts.js";

export default class GraphicsPreparer {
	static promise = Deferred();
	static cursors = {};
	static load() {
		let loader = PIXI.Loader.shared;
		loader.add([
			{ name: "assets", url: "res/assets.json" },
			{ name: "displacement_animation", url: "res/displacement_animation.jpg" }
		]).load(async(loader, resources)=>{

			// Parsing composite images, for example, "explosion_64x64.png" will be decomposed into several images
			SG2DUtils.parseTexturePack(resources);

			// Prepare the graphic font
			SG2DFonts.addFont({
				name: "metal_yellow_big",
				texture: "fonts/metal_yellow_big_48x50h",
				schema: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!().:"
			});

			// Get the mouse cursor icons
			this.cursors.default = "url('" + URL.createObjectURL(await SG2DUtils.getTextureAsBlob("ui/cursor_default")) + "'),auto";
			this.cursors.target = "url('" + URL.createObjectURL(await SG2DUtils.getTextureAsBlob("ui/cursor_target")) + "') 16 16,auto";
			this.cursors.move = "url('" + URL.createObjectURL(await SG2DUtils.getTextureAsBlob("ui/cursor_move")) + "') 16 16,auto";

			// Process sprites to eliminate stripe artifacts
			SG2DUtils.borderAlphaTextures([
				"lands/concrete", "lands/grass", "lands/sand",
				"elements/block-corner-45", "elements/block-corner-135", "elements/block-corner-225", "elements/block-corner-315"
			], 0.995);

			this.promise.resolve();
		});
		
		return this.promise;
	}
}