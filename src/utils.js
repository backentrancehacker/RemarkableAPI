const query = params => {
	const esc = encodeURIComponent;
	return Object.keys(params)
		.map(k => `${esc(k)}=${esc(params[k])}`)
		.join('&')
}

const resources = () => {
	return [
		""
	]
}

const endpoint = {
	device: 'https://my.remarkable.com/token/json/2/device/new',
	user: 'https://my.remarkable.com/token/json/2/user/new',
	store: 'https://service-manager-production-dot-remarkable-production.appspot.com/service/json/1/document-storage'
}

module.exports = {
	query,
	resources
}