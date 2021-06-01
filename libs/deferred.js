"use strict";

function Deferred() {
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

export default Deferred;