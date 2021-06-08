/**
 * SG2DMath
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya and VediX Systems
 */


"use strict";

let SG2DMath = {};

export default SG2DMath;
	
(function() {

	let _uid = 0;
	SG2DMath.uid = function() {
		return (++_uid);
	};
	
	let _ap = [];
	for (var dec = 0; dec <= 10; dec++) _ap[dec] = 10 ** dec;
	
	/**
	 * Round to decimal place
	 * @param {number} v
	 * @param {int} p
	 * @returns {number}
	 */
	SG2DMath.roundTo = function(v, dec) {
		var e = _ap[dec];
		return Math.round(v * e) / e;
	};
	
	SG2DMath.absDelta = function(v1, v2) {
		return Math.abs(v1 - v2);
	};

	SG2DMath.PI180 = Math.PI/180;
	SG2DMath.PI2 = Math.PI*2;
	SG2DMath.rad90 = 90 * SG2DMath.PI180;

	/*Math.toRad = function(a) {
		return a * SG2DMath.PI180;
	};*/
	
	SG2DMath.normalize_a = function(a, precision = 0) {
		while (a >= 360) a = a - 360;
		while (a < 0) a = a + 360;
		if (precision) a = SG2DMath.roundTo(a, precision);
		return a;
	};

	let _aSin = [];
	let _aCos = [];
	for (var a = 0; a <= 360; a++) {
		_aSin[a] = Math.sin(a * SG2DMath.PI180);
		_aCos[a] = Math.cos(a * SG2DMath.PI180);
	}
	let _aSin1 = [];
	let _aCos1 = [];
	for (var a = 0; a <= 3600; a++) {
		var _a = a / 10;
		_aSin1[a] = Math.sin(_a * SG2DMath.PI180);
		_aCos1[a] = Math.cos(_a * SG2DMath.PI180);
	}
	
	SG2DMath.sin = function(a, precision = 0) { // Accuracy to the tenth of a degree
		return (precision === 0 ? _aSin[SG2DMath.normalize_a(a, precision)] : _aSin1[ Math.round(10 * SG2DMath.normalize_a(a, 1)) ]);
	};
	SG2DMath.cos = function(a, precision = 0) {
		return (precision === 0 ? _aCos[SG2DMath.normalize_a(a, precision)] : _aCos1[ Math.round(10 * SG2DMath.normalize_a(a, 1)) ]);
	};
	
	/*Math.angle_p1p2_rad = function(p1, p2) { //not used!
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
	};*/
	SG2DMath.angle_p1p2_deg = function(p1, p2, precision = 0) {
		var angle_rad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		var angle_deg = SG2DMath.normalize_a(angle_rad / SG2DMath.PI180, precision);
		return angle_deg;
	};

	SG2DMath.distance_d = function(dx, dy) {
		return Math.sqrt(dx*dx + dy*dy);
	};
	SG2DMath.distance_p = function(p1, p2) {
		return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
	};
	
	// Get the minimum angle to get from a_start a_end
	SG2DMath.betweenAnglesDeg = function(a_start, a_end) {
		var da1 = a_end - a_start;
		var da2 = (a_end-360) - a_start;
		var da3 = a_end - (a_start-360);
		return (Math.abs(da1) < Math.abs(da2) ? (Math.abs(da3) < Math.abs(da1) ? da3 : da1) : (Math.abs(da3) < Math.abs(da2) ? da3 : da2));
	};

	// Direction of rotation (right / left) - which is faster
	SG2DMath.nearestDirRotate = function(rotate_current, rotate_target) {
		var a1 = SG2DMath.normalize_a(rotate_target - rotate_current);
		var a2 = SG2DMath.normalize_a(rotate_current - rotate_target);
		if (a1 === a2) return 0;
		return a1 > a2 ? -1 : 1;
	};
	
	SG2DMath.vectors45 = [{dx:1,dy:0},{dx:1,dy:1},{dx:0,dy:1},{dx:-1,dy:1},{dx:-1,dy:0},{dx:-1,dy:-1},{dx:0,dy:-1},{dx:1,dy:-1}]; // counterclockwise, starting from 0 deg
	SG2DMath.vectors90 = [{dx:1,dy:0},{dx:0,dy:1},{dx:-1,dy:0},{dx:0,dy:-1}]; // counterclockwise, starting from 0 deg

	/** @private */
	let _linePoints = [];
	/**
	 * Default point collection function
	 * @private
	 */
	SG2DMath._addLinePoint = function(x, y) {
		this.push({x: x, y: y});
	};
	
	/**
	* Forming an array of points of a solid line
	* @param {object} oPointStart
	* @param {object} oPointEnd
	* @param {mixed} dest fAddLinePoint or aDest or undefined
	* @return {array}
	*/
	SG2DMath.getLinePoints = function(oPointStart, oPointEnd, dest = void 0) {
		
		var fAddLinePoint = SG2DMath._addLinePoint;
		if (typeof dest === "function") fAddLinePoint = dest;
		else if (Array.isArray(dest)) fAddLinePoint = fAddLinePoint.bind(dest);
		else (_linePoints.length = 0, fAddLinePoint = fAddLinePoint.bind(_linePoints));
		
		fAddLinePoint(Math.round(oPointStart.x), Math.round(oPointStart.y));

		var x1 = oPointStart.x, y1 = oPointStart.y;
		var x2 = oPointEnd.x, y2 = oPointEnd.y;
		var Dx = (x2 - x1), Dy = (y2 - y1);
		var d = Math.sqrt(Dx*Dx + Dy*Dy);
		var dx = Dx / d, dy = Dy / d;
		var cx = x1, cy = y1;
		var cxPrev = Math.round(x1), cyPrev = Math.round(y1);
		var cxIntPrev = cxPrev, cyIntPrev = cyPrev;

		while (true) {
			cx += dx;
			cy += dy;

			var cxInt = Math.round(cx);
			var cyInt = Math.round(cy);

			if ( (cxInt === cxIntPrev) && (cyInt === cyIntPrev) ) continue;
			if ( ( (x2 > x1) && (cx > x2) ) || ( (x2 < x1) && (cx < x2) ) ) break;
			if ( ( (y2 > y1) && (cy > y2) ) || ( (y2 < y1) && (cy < y2) ) ) break;
			if ( (cxInt != cxIntPrev) && (cyInt != cyIntPrev) ) {
				var cx1Int = cxInt;
				var cy1Int = cyIntPrev;
				var d1 = Math.sqrt( Math.pow(cx1Int - cx, 2) + Math.pow(cy1Int - cy, 2) ) + Math.sqrt( Math.pow(cx1Int - cxPrev, 2) + Math.pow(cy1Int - cyPrev, 2) );
				var cx2Int = cxIntPrev;
				var cy2Int = cyInt;
				var d2 = Math.sqrt( Math.pow(cx2Int - cx, 2) + Math.pow(cy2Int - cy, 2) ) + Math.sqrt( Math.pow(cx2Int - cxPrev, 2) + Math.pow(cy2Int - cyPrev, 2) );
				if (d1 > d2) {
					fAddLinePoint(cx2Int, cy2Int);
					cxIntPrev = cx2Int;
					cyIntPrev = cy2Int;
				} else {
					fAddLinePoint(cx1Int, cy1Int);
					cxIntPrev = cx1Int;
					cyIntPrev = cy1Int;
				}
			}

			fAddLinePoint(cxInt, cyInt);

			cxPrev = cx;
			cyPrev = cy;
			cxIntPrev = cxInt;
			cyIntPrev = cyInt;
		}
		
		return _linePoints;
	};
	
	let _avgVertext = {x: void 0, y: void 0};
	
	/**
	 * Get the midpoint
	 * @param {array} vertexes
	 * @param {object} point
	 * @returns {object} return point object
	 */
	SG2DMath.avgVertext = function(vertexes, point) {
		if (! vertexes.length) { debugger; throw "Error 773734";}
		point = point || _avgVertext;
		_avgVertext.x = vertexes[0].x;
		_avgVertext.y = vertexes[0].y;
		for (var i = 1; i < vertexes.length; i++) {
			_avgVertext.x += vertexes[i].x;
			_avgVertext.y += vertexes[i].y;
		}
		_avgVertext.x = _avgVertext.x / vertexes.length;
		_avgVertext.y = _avgVertext.y / vertexes.length;
		return _avgVertext;
	};
})();

if (typeof window === "object") window.SG2DMath = SG2DMath;
if (typeof _root === "object") _root.SG2DMath = SG2DMath;