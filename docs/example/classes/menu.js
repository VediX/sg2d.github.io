import GraphicsPreparer from "./graphics-preparer.js";

export default class Menu {
	static promise = SG2D.Deferred();
	static load() {
		Promise.all([
			GraphicsPreparer.promise
		]).then(()=>{
			//TODO...
			this.promise.resolve();
		});
		
		return this.promise;
	}
}