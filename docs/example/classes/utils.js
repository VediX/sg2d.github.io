export default class Utils {
	static getSpreadingRandom(size = 10) {
		var	aSpreading = [{x: 0, y: 0}],
			aaSpreding = [[ aSpreading[0] ]];
		var q = 0, iCounter = 0;
		while (q < size) {
			if (++iCounter > 16384) break;
			var iSpread = Math.floor( Math.random() * aSpreading.length),
				oSpread = aSpreading[ iSpread ],
				angle = Math.floor(90 * Math.floor(Math.random() * 4));
			var	newX = oSpread.x + Math.round( SG2D.Math.sin(angle) ),
				newY = oSpread.y - Math.round( SG2D.Math.cos(angle) );
			if (aaSpreding[newX] && aaSpreding[newX][newY]) continue;
			if (! aaSpreding[newX]) aaSpreding[newX] = [];
			var o = { x: newX, y: newY };
			aSpreading.push(o);
			aaSpreding[newX][newY] = o;
			q++;
		}
		return aSpreading;
	}
}