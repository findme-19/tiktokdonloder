var axios = require("axios");
var cheerio = require("cheerio");
async function tikitod(yuerel) {
	return new Promise(async (resolve, reject) => {
		try {
			var a = await axios.request("https://ssstik.io/id", {
				method: "GET",
				headers: {
					"user-agent": "Mozilla/5.0 (Linux; Android 11; V2038; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Mobile Safari/537.36"
				}
			})
			var roti = a.headers['set-cookie'][0].split(";")[0] + ";" + a.headers['set-cookie'][1].split(";")[0] + ";" + a.headers['set-cookie'][2].split(";")[0]
			var url = cheerio.load(a.data)("form[id='_gcaptcha_pt']").attr('hx-post')
			try {
				var b = await axios.request("https://ssstik.io" + url, {
					method: "POST",
					headers: {
						"hx-target": "target",
						"hx-current-url": "https://ssstik.io/id",
						"user-agent": "Mozilla/5.0 (Linux; Android 11; V2038; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Mobile Safari/537.36",
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
						"hx-trigger": "_gcaptcha_pt",
						"hx-request": "true",
						cookie: roti,
						referer: "https://ssstik.io/id",
						accept: "*/*",
						host: "ssstik.io"
					},
					data: new URLSearchParams(Object.entries({
						"id": yuerel,
						"locale": "id",
						ts: 0,
						tt: 0,
						gc: 0
					}))
				})
				var anu = cheerio.load(b.data)
				var data = {
					username: anu(".result_overlay > h2").text(),
					imeguser: anu(".u-round.u-l").attr("src"),
					deskvid: anu(".maintext").text(),
					nowmhd: anu(".pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link.without_watermark_hd.vignette_active").attr("href"),
					nowm: anu(".pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link.without_watermark_direct").attr("href"),
					mp3: anu(".pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link.music.vignette_active").attr("href")
				}
				console.log(data)
				return resolve(data)
			} catch (e) {
				console.log(e);
				if (e.response) {
					return reject(false)
				} else {
					return reject(false)
				}
			}
		} catch (e) {
			console.log(e);
			if (e.response) {
				return reject(false)
			} else {
				return reject(false)
			}
		}
	})
}
module.exports = tikitod;
