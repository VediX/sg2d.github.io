/**
 * SG2DMessageToast
 * https://github.com/VediX/sg2d.github.io
 * (c) Kalashnikov Ilya
 */

"use strict";

// Popup notification for a while, and then fade out
let SG2DMessageToast = {
	
	process: { state: 0, t: void 0, opacity: 1 },
	eDiv: void 0,
	eMessage: void 0,
	
	holdInterval: 500,
	
	fadeOutInterval: 1000,
	fadeOutSteps: 20,
	fadeOutIntervalStep: void 0,
	opacityStep: void 0,
	
	STATE_IDLE: 0,
	STATE_HOLD: 1,
	STATE_FADEOUT: 2,
	
	initialize: function() {
		if (! this.eDiv) {
			this.eDiv = document.querySelector("#message_toast");
			if (! this.eDiv) {
				document.body.insertAdjacentHTML("beforeend",`
<div id="message_toast" style="color: white; position: fixed; left: 50%; margin-right: -50%; background: transparent; transform: translate(-50%, 200%); display: none">
	<div class="content">
		<div class="js-message" style="color: #fff; font: 20pt bold Arial;"></div>
	</div>
</div>`
				);
				this.eDiv = document.querySelector("#message_toast");
			}
			
			this.eMessage = this.eDiv.querySelector(".js-message");
			this.fadeOutIntervalStep = ~~(this.fadeOutInterval / this.fadeOutSteps);
			this.opacityStep = 1 / SG2DMessageToast.fadeOutSteps;
		}
		
		this.startFadeOut = this.startFadeOut.bind(this);
		this.fadeOut = this.fadeOut.bind(this);
	},
	
	show: function(config) {
		
		this.initialize();
		
		if (this.process.state) {
			clearInterval(this.process.t);
			this.process.t = null;
		}
		
		this.process.state = this.STATE_HOLD;
		this.process.t = setTimeout(this.startFadeOut, this.holdInterval);
		
		this.eMessage.innerHTML = config.text;
		this.eDiv.style.display = "block";
		this.eDiv.style.opacity = 0.99;
	},
	
	startFadeOut: function() {
		this.process.t = setInterval(this.fadeOut, this.fadeOutIntervalStep);
	},
	
	fadeOut: function() {
		this.eDiv.style.opacity -= this.opacityStep;
		if (this.eDiv.style.opacity <= 0) {
			this.eDiv.style.opacity = 1;
			this.eDiv.style.display = "none";
			clearInterval(this.process.t);
			this.process.t = null;
			this.process.state = this.STATE_IDLE;
		}
	}
}

export default SG2DMessageToast;