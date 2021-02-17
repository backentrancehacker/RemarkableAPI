const fetch = require("node-fetch")

const endpoints = {
  auth: "my.remarkable.com",
  service: "service-manager-production-dot-remarkable-production.appspot.com",
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

const query = (endpoint, options) => {
  const { api, body, headers, ...other } = options
  const url = `https://${
    endpoints.hasOwnProperty(endpoint)
      ? endpoints[endpoint]
      : endpoint
  }/${api || ""}`
  
  const payload = {
    method: "POST",
    headers: Object.assign({}, defaultHeaders, headers),
    body: JSON.stringify(body),
     ...other
  }

  console.log("URL", url)
  console.log("PAYLOAD", payload)

  return fetch(url, payload)
}

module.exports = { 
  encodeParams, 
  endpoints,
  query
}