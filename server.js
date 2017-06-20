
	"use strict";

	const http = require("http");
	const request = require("request-promise-native");
	const jsdom = require("jsdom");
	const { JSDOM } = jsdom;

	http.createServer((req, res) => {
		request({ method: "GET", url: "https://dts.ccpgames.com/login/eve", headers: { Cookie: req.url.slice(1) } }).then(body => {
			let characters = Array
				.from(new JSDOM(body).window.document.querySelectorAll(".character"))
				.map(({ children }) => ({ id: parseInt(children[2].value), name: children[1].innerHTML }));
			console.log(JSON.stringify(characters, null, 2));
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("okay");
		});
	}).listen(12345);
