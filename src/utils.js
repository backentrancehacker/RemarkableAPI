const query = params => {
	const esc = encodeURIComponent;
	return Object.keys(params)
		.map(k => `${esc(k)}=${esc(params[k])}`)
		.join('&')
}

const endpoints = {
  device: "https://my.remarkable.com/token/json/2/device/new",
  store: "https://service-manager-production-dot-remarkable-production.appspot.com/service/json/1/document-storage",
  user: "https://my.remarkable.com/token/json/2/user/new"
}

const userAgent = "remarkable-api"

module.exports = { query, endpoints, userAgent }