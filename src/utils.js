const fetch = require("node-fetch")

const endpoints = {
  auth: "my.remarkable.com",
  storage: "document-storage-production-dot-remarkable-production.appspot.com",
  discover: "service-manager-production-dot-remarkable-production.appspot.com",
}

const encodeParams = (params) => (
  Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
)

const defaultHeaders = {
  "User-Agent": "node-remarkable-api",
  "Content-Type": "application/json"
}

/**
 * method: 'POST',
			headers: {
				'User-Agent': userAgent,
				'Content-Type': 'application/json',
				'Authentication': 'Bearer'
			},
			body: JSON.stringify({
				code,
				deviceDesc: 'desktop-linux',
				deviceID: uuid4()
			})
 * 
 */

const query = (endpoint, options) => {
  const { api, body, headers, ...other } = options
  const url = endpoint.startsWith("https://")
    ? endpoint
    : `https://${endpoints[endpoint]}/${api}`

  const payload = {
    method: "POST",
    headers: Object.assign({}, defaultHeaders, headers),
    body: JSON.stringify(body),
     ...other
  }

  return fetch(url, payload)
}

module.exports = { 
  encodeParams, 
  endpoints,
  query
}