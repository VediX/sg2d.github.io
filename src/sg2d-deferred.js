"use strict";

/**
 * Промис с возможностью вызывать resolve/reject извне
 * @typedef SG2D.Deferred.Promise
 * @type {object}
 * @property {function} resolve(value) - Завершает промис с успехом
 * @property {function} reject(error) - Завершает промис с ошибкой
 * @property {function} then(callback) - Добавляет колбэк в список вызовов при успешном завершении промиса
 * @property {function} catch(callback) - Добавляет колбэк в список вызовов при аварийном завершении промиса
 * @property {function} isCompleted - Возвращает статус промиса (**true** для успешно завершенного промиса, **false** для не завершенного промиса или завершенного аварийно)
 */

/**
 * Создаёт экземпляр {@link SG2D.Deferred.Promise}
 * @class SG2D.Deferred
 * @return {SG2D.Deferred.Promise}
 */
function SG2DDeferred() {
	let thens = [];
	let catches = [];

	let status;
	let resolvedValue;
	let rejectedError;

	return {
		isCompleted: ()=>{
			return status === 'resolved';
		},
		resolve: value => {
			status = 'resolved';
			resolvedValue = value;
			thens.forEach(t => t(value));
			thens.length = 0; // Avoid memleaks.
		},
		reject: error => {
			status = 'rejected';
			rejectedError = error;
			catches.forEach(c => c(error));
			catches.length = 0; // Avoid memleaks.
		},
		then: cb => {
			if (status === 'resolved') {
				cb(resolvedValue);
			} else {
				thens.unshift(cb);
			}
		},
		catch: cb => {
			if (status === 'rejected') {
				cb(rejectedError);
			} else {
				catches.unshift(cb);
			}
		}
	}
}

export default SG2DDeferred;