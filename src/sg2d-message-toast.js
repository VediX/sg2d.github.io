"use strict";

/**
 * Всплывающее на некоторое время уведомление, которое затем плавно исчезает
 * @namespace SG2D.MessageToast
 */
let SG2DMessageToast = {
	
	process: { state: 0, t: void 0, opacity: 1 },
	eDiv: void 0,
	eMessage: void 0,
	
	/**
	 * Задержка перед началом исчезновения в мс
	 * @memberof SG2D.MessageToast
	 * @var {Number} holdInterval=500
	 */
	holdInterval: 500,
	
	/**
	 * Время за которое текст меняет прозрачность с 0 до 100%
	 * @memberof SG2D.MessageToast
	 * @var {Number} fadeOutInterval=1000
	 */
	fadeOutInterval: 1000,
	
	fadeOutSteps: 20,
	fadeOutIntervalStep: void 0,
	opacityStep: void 0,
	
	STATE_IDLE: 0,
	STATE_HOLD: 1,
	STATE_FADEOUT: 2,
	
	_initialize: function() {
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
	
	/**
	 * Показать текстовое уведомление
	 * @memberof SG2D.MessageToast
	 * @method show
	 * @param {object} config
	 * @param {string} config.text
	 * @example
	 * SG2D.MessageToast.show({ text: "Scale: " + camera.getScale().percent + "%" });
	 */
	show: function(config) {
		
		this._initialize();
		
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
	
	/** @private */
	startFadeOut: function() {
		this.process.t = setInterval(this.fadeOut, this.fadeOutIntervalStep);
	},
	
	/** @private */
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