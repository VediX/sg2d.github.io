"use strict";

/**
 * Математические функции
 * @class
 * @alias SG2D.Math
 * @returns {SG2D.Math}
 */
let SG2DMath = {};

(function() {

	let _uid = 0;
	
	/**
	 * Генератор уникального числового целого значения
	 * @alias SG2D.Math.uid
	 * @returns {Number}
	 */
	SG2DMath.uid = function() {
		return (++_uid);
	};
	
	/**
	 * Функция для работы с битовыми масками - добавить биты
	 * @param {Number} value - Исходное значение
	 * @param {Number} flag - Добавляемые биты
	 */
	SG2DMath.addFlag = (value, flag)=>(value | flag);
	
	/**
	 * Функция для работы с битовыми масками - обнулить биты
	 * @param {Number} value - Исходное значение
	 * @param {Number} flag - Обнуляемые биты
	 */
	SG2DMath.removeFlag = (value, flag)=>(value & ~flag);
	
	/**
	 * Функция для работы с битовыми масками - установить биты в значение state={0|1}
	 * @param {Number} value - Исходное значение
	 * @param {Number} flag - Изменяемые биты
	 * @param {Number} [state=true] - Устанавливаемое значение бита
	 */
	SG2DMath.setFlag = (value, flag, state = true)=>(state ? SG2DMath.addFlag(value, flag) : SG2DMath.removeFlag(value, flag));
	
	/**
	 * Функция для работы с битовыми масками - проверить наличие битов (что не нулевые)
	 * @param {Number} value - Исходное значение
	 * @param {Number} flag - Проверяемые биты
	 */
	SG2DMath.hasFlag = (value, flag)=>(value & flag);
	
	/**
	 * Функция для работы с битовыми масками - возвращает ! hasFlag(..)
	 * @param {Number} value - Исходное значение
	 * @param {Number} flag - Проверяемые биты
	 */
	SG2DMath.noFlag = (value, flag)=>(! (value & flag)); // TODO: used?
	
	let _ap = [];
	for (var dec = 0; dec <= 10; dec++) _ap[dec] = 10 ** dec;
	
	/**
	 * Округлить до десятичного знака. Поддерживает округление до 10-го знака после запятой.
	 * @param {Number} v
	 * @param {Number} dec
	 * @return {Number}
	 */
	SG2DMath.roundTo = function(v, dec) {
		var e = _ap[dec];
		return Math.round(v * e) / e;
	};
	
	/**
	 * Получить модуль разницы между числами
	 * @param {Number} v1
	 * @param {Number} v2
	 * @return {Number}
	 */
	SG2DMath.absDelta = function(v1, v2) {
		return Math.abs(v1 - v2);
	};

	/**
	 * Константа для перевода радиан в градусы и наоборот (значение 0.017453292519943295)
	 * @const
	 * @type {Number}
	 */
	SG2DMath.PI180 = Math.PI/180;
	
	SG2DMath.PI2 = Math.PI*2;
	SG2DMath.rad90 = 90 * SG2DMath.PI180;
	
	/**
	 * Преобразовать градусы в радианы
	 * @param {Number} a
	 * @return {Number}
	 */
	SG2DMath.toRad = function(a) {
		return a * this.PI180;
	};
	
	/**
	 * Преобразовать радианы в градусы
	 * @param {Number} a
	 * @return {Number}
	 */
	SG2DMath.toDeg = function(a) {
		return a / this.PI180;
	};
	
	/**
	 * Нормализировать угол с округлением до заданного десятичного знака. Возвращается угол между 0 и 360 градусов.
	 * @param {Number} a
	 * @param {Number} [precision=0] - Точность
	 * @return {Number}
	 */
	SG2DMath.normalize_a = function(a, precision = 0) {
		while (a >= 360) a = a - 360;
		while (a < 0) a = a + 360;
		return this.roundTo(a, precision);
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
	
	/**
	 * Быстрая функция получения синуса угла. Поддерживается точность угла до одного знака после запятой.
	 * @param {Number} a - Угол в градусах
	 * @param {Number} [precision=0] - Точность. Может быть 0 или 1
	 * @return {Number}
	 */
	SG2DMath.sin = function(a, precision = 0) { // Точность до десятых долей градуса
		return (precision === 0 ? _aSin[this.normalize_a(a, precision)] : _aSin1[ Math.round(10 * this.normalize_a(a, 1)) ]);
	};
	
	/**
	 * Быстрая функция получения косинуса угла. Поддерживается точность угла до одного знака после запятой.
	 * @param {Number} a - Угол в градусах
	 * @param {Number} [precision=0] - Точность. Может быть 0 или 1
	 * @return {Number}
	 */
	SG2DMath.cos = function(a, precision = 0) {
		return (precision === 0 ? _aCos[this.normalize_a(a, precision)] : _aCos1[ Math.round(10 * this.normalize_a(a, 1)) ]);
	};
	
	/**
	 * Быстрая функция получения синуса угла.
	 * @param {Number} a - Угол в радианах
	 * @param {Number} [precision=0] - Точность угла в градусах. Может быть 0 или 1
	 * @return {Number}
	 */
	SG2DMath.sinrad = function() {
		arguments[0] = arguments[0] / this.PI180;
		return this.sin.apply(this, arguments);
	};
	
	/**
	 * Быстрая функция получения косинуса угла.
	 * @param {Number} a - Угол в радианах
	 * @param {Number} [precision=0] - Точность угла в градусах. Может быть 0 или 1
	 * @return {Number}
	 */
	SG2DMath.cosrad = function() {
		arguments[0] = arguments[0] / this.PI180;
		return this.cos.apply(this, arguments);
	};
	
	/*Math.angle_p1p2_rad = function(p1, p2) { //not used!
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
	};*/
	
	/**
	 * Угол между точками в градусах
	 * @param {object} p1
	 * @param {object} p2
	 * @param {Number} [precision=0] - Точность угла в градусах
	 * @return {Number}
	 */
	SG2DMath.angle_p1p2_deg = function(p1, p2, precision = 0) {
		var angle_rad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		var angle_deg = this.normalize_a(angle_rad / this.PI180, precision);
		return angle_deg;
	};
	
	/**
	 * Расстояние между точками
	 * @param {Number} dx - Разница координат по оси X
	 * @param {Number} dy - Разница координат по оси Y
	 * @return {Number}
	 */
	SG2DMath.distance_d = function(dx, dy) {
		return Math.sqrt(dx*dx + dy*dy);
	};
	
	/**
	 * Расстояние между точками
	 * @param {object} p1
	 * @param {object} p2
	 * @return {Number}
	 */
	SG2DMath.distance_p = function(p1, p2) {
		return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
	};
	
	/**
	 * Минимальный угол между a_start и a_end (градусы)
	 * @param {Number} a_start
	 * @param {Number} a_end
	 * @return {Number}
	 */
	SG2DMath.betweenAnglesDeg = function(a_start, a_end) {
		var da1 = a_end - a_start;
		var da2 = (a_end-360) - a_start;
		var da3 = a_end - (a_start-360);
		return (Math.abs(da1) < Math.abs(da2) ? (Math.abs(da3) < Math.abs(da1) ? da3 : da1) : (Math.abs(da3) < Math.abs(da2) ? da3 : da2));
	};

	/**
	 * Получить направление вращения (вправо / влево) при котором целевой угол будет достигнут быстрее
	 * @param {Number} rotate_current - Начальный угол
	 * @param {Number} rotate_target - Целевой угол
	 * @return {Number} Возвращает -1, 0 или 1
	 */
	SG2DMath.nearestDirRotate = function(rotate_current, rotate_target) {
		var a1 = this.normalize_a(rotate_target - rotate_current);
		var a2 = this.normalize_a(rotate_current - rotate_target);
		if (a1 === a2) return 0;
		return a1 > a2 ? -1 : 1;
	};
	
	/**
	 * 8 векторов. Против часовой стрелки, начиная с 0 градусов, шаг 45 градусов.
	 */
	SG2DMath.vectors45 = [{dx:1,dy:0},{dx:1,dy:1},{dx:0,dy:1},{dx:-1,dy:1},{dx:-1,dy:0},{dx:-1,dy:-1},{dx:0,dy:-1},{dx:1,dy:-1}];
	
	/**
	 * 4 вектора. Против часовой стрелки, начиная с 0 градусов, шаг 90 градусов.
	 */
	SG2DMath.vectors90 = [{dx:1,dy:0},{dx:0,dy:1},{dx:-1,dy:0},{dx:0,dy:-1}];

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
	* Формирует сплошную линию в виде массива точек
	* @param {object} oPointStart
	* @param {object} oPointEnd
	* @param {mixed} [dest] - Может быть функцией fAddLinePoint или массивом aDest
	* @return {array}
	*/
	SG2DMath.getLinePoints = function(oPointStart, oPointEnd, dest = void 0) {
		
		var fAddLinePoint = this._addLinePoint;
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
	 * Получить среднюю точку
	 * @param {array} vertexes
	 * @param {object} point
	 * @return {object}
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

export default SG2DMath;