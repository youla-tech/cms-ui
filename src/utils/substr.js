export function substr(obj) {
	let str = "";
	let length = obj.length ? obj.length : 10;
	let rgb = obj.rgb ? obj.rgb : 'black';
	if (obj && obj.str) {
		if (obj.str.length > length) {
			str = obj.str.substring(0, length) + "....";
			return ("<span style=color:" + rgb + " title='" + obj.str + "'>" + str + "</span>");
		}
		else {
			return ("<span style=color:" + rgb + " title='" + obj.str + "'>" + obj.str + "</span>");
		}
	} else {
		return str;
	}
}
