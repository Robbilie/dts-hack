
	"use strict";

	const request = require("request-promise-native");
	const { session } = require("electron").remote;
	const jsdom = require("jsdom");
	const { JSDOM } = jsdom;

	let webview = document.createElement("webview");
		webview.src = "https://meta.eveonline.com/session/sso?return_path=%2F";
		webview.partition = "dts";
		webview.addEventListener("did-finish-load", e => {
			if (webview.getURL() === "https://dts.ccpgames.com/login/eve") {
				let cookies = session.fromPartition("dts").cookies;
				cookies.get({ url: webview.getURL() }, (error, cookies) => {
					if (error)
						throw error;
					request("http://localhost:12345/" + cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(";")).then(res => {
						console.log(res);
						webview.loadURL("https://dts.ccpgames.com/logout/");
					});
				});
			}
		});

	window.addEventListener("load", () => {
		$("#container").appendChild(webview);
	});

	function getCharacterList (Cookie) {
		return new Promise((resolve, reject) => request({ method: "GET", url: "https://dts.ccpgames.com/login/eve", headers: { Cookie } }, (err, res, body) => {
			if (err)
				return reject(err);
			resolve(Array
				.from(new JSDOM(body).window.document.querySelectorAll(".character"))
				.map(({ children }) => ({ id: parseInt(children[2].value), name: children[1].innerHTML })));
		}));
	}