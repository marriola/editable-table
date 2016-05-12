import $ from "jquery";

export class Ajax {
    constructor(base) {
	this.base = base;
    }

    call(suffix, method="PUT") {
	return new Promise((resolve, reject) => {
	    $.ajax({
		method,
		url: this.base + suffix,
		success: resolve,
		error: reject
	    });
	});
    }
}

String.prototype.padStart = String.prototype.padStart || function(len, fill=" ") {
    let pad = len - this.length;
    return fill.repeat(pad) + this;
}

export function randomKey() {
    return Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, "0");
}
