var axios = require("axios");
var cheerio = require("cheerio");
async function ssstik(yuerel) {
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
					data: new URLSearchParams({
						"id": yuerel,
						"locale": "id",
						ts: 0,
						tt: 0,
						gc: 0
					})
				})
				var anu = cheerio.load(b.data)
				var data = {
					author: {
						nickname: anu(".result_overlay > h2").text(),
						avatar: anu(".u-round.u-l").attr("src")
					},
					description: anu(".maintext").text(),
					video: {
						no_watermark_hd: anu(".pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link.without_watermark_hd.vignette_active").attr("href"),
						no_watermark_raw: anu(".pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link.without_watermark_direct").attr("href"),
						mp3: anu(".pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link.music.vignette_active").attr("href")
					}
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
async function decodeSnap(...args) {
	/* 
	 * referensi https://github.com/bochilteam
	 */
	function _0xe78c(
		d,
		e,
		f
	) {
		var g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
		var h = g.slice(0, e)
		var i = g.slice(0, f)
		var j = d.split('').reverse().reduce(function(a, b, c) {
			if (h.indexOf(b) !== -1) return a += h.indexOf(b) * (Math.pow(e, c))
		}, 0)
		var k = ''
		while (j > 0) {
			k = i[j % f] + k
			j = (j - (j % f)) / f
		}
		return k || '0'
	}

	function _0xc60e(
		h,
		u,
		n,
		t,
		e,
		r
	) {
		r = ''
		for (var i = 0, len = h.length; i < len; i++) {
			var s = ''
			while (h[i] !== n[e]) {
				s += h[i]
				i++
			}
			for (var j = 0; j < n.length; j++) {
				s = s.replace(new RegExp(n[j], 'g'), j.toString())
			}
			r += String.fromCharCode((_0xe78c(s, e, 10) - t))
		}
		return decodeURIComponent(encodeURIComponent(r))
	}
	return _0xc60e(...args)
}
async function snaptik(yuerel) {
	return new Promise(async (resolve, reject) => {
		var a = await axios.request("https://snaptik.app/ID", {
			method: "GET",
			headers: {
				"user-agent": "Mozilla/5.0 (Linux; Android 11; V2038; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Mobile Safari/537.36"
			}
		})
		var roti = a.headers['set-cookie'][0].split(";")[0]
		var token = cheerio.load(a.data)("input[name='token']").attr("value")
		console.log({
			roti,
			token
		})
		var b = await axios.request("https://snaptik.app/abc.php", {
			method: "GET",
			headers: {
				"user-agent": "Mozilla/5.0 (Linux; Android 11; V2038; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Mobile Safari/537.36",
				cookie: roti,
				Host: "snaptik.app"
			},
			params: {
				url: yuerel,
				lang: "ID",
				token: token
			}
		})

		var decodeParams = b.data.split('))</script>')[0]
			.split('decodeURIComponent(escape(r))}(')[1]
			?.split(',')?.map(v => v.replace(/^"/, '')
				.replace(/"$/, '').trim())
		if (!Array.isArray(decodeParams) || decodeParams.length !== 6) return reject(`failed to parse decode params!\n${b.data}`)
		var decode = await decodeSnap(...decodeParams)
		var result = decode.split('; elem.innerHTML = \\\'')?.[1].split('\\\'; parent.ga(')?.[0]?.replace(/\\(\\)?/g, '')
		if (!result) return reject(`failed to parse html from decode!\n${decode}`)
		var $ = cheerio.load(result)
		var snaptik_middle = $('.snaptikvid > div.snaptik-middle')
		var d = $('#download-block > .abuttons').find('a')
		var no_watermark2 = d.eq(1).attr('href')
		var no_watermark_raw = d.eq(3).attr('href')
		if (!/https?:\/\//.test(no_watermark2)) no_watermark2 = `https://snaptik.app${no_watermark2}`
		if (!/https?:\/\//.test(no_watermark_raw)) no_watermark_raw = `https://snaptik.app${no_watermark_raw}`
		return resolve({
			author: {
				nickname: snaptik_middle.find('h3').text()
			},
			description: snaptik_middle.find('span').text(),
			video: {
				no_watermark: d.eq(0).attr('href'),
				no_watermark2,
				no_watermark_raw
			}
		})
	})
}
async function tikmate(yuerel) {
	return new Promise(async (resolve, reject) => {
		var a = await axios.request("https://api.tikmate.app/api/lookup", {
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				accept: "*/*"
			},
			data: new URLSearchParams({
				url: yuerel
			})
		})
		return resolve({
			author: {
				avatar: a.data.author_avatar
			},
			detail_video: {
				dibuat: a.data.create_time,
				komentar: a.data.comment_count + " Komentar",
				suka: a.data.like_count + " Suka",
				dibagikan: a.data.share_count + "x"
			},
			video: {
				nowm: "https://tikmate.app/download/" + a.data.token + "/" + a.data.id + ".mp4",
				nowm_hd: "https://tikmate.app/download/" + a.data.token + "/" + a.data.id + ".mp4?hd=1"
			}
		})
	})
}
/** usage
 * var a = await ssstik("https://vt.tiktok.com/ZSdfPds4S/")
 * var b = await snaptik("https://vt.tiktok.com/ZSdfPds4S/")
 * var c = await tikmate("https://vt.tiktok.com/ZSdfPds4S/")
 * console.log({
 *	a,
 *	b, 
 *      c
 * })
 **/

module.exports = {
	ssstik,
	snaptik,
	tikmate
}
