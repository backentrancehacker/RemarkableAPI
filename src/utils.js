const fetch = require("node-fetch")

const userAgent = "remarkable-api"

const endpoints = {
  auth: "my.remarkable.com",
  device: "my.remarkable.com",
  storage: "document-storage-production-dot-remarkable-production.appspot.com",
  discover: "service-manager-production-dot-remarkable-production.appspot.com",
}

const encodeParams = (params) => (
  Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
)

const defaultHeaders = {
  "user-agent": userAgent,
  "content-type": "application/json",
  "Authentication": "Bearer"
}

const query = (endpoint, options) => {
  const { api, body, headers, ...other } = options
  const url = `https://${endpoints[endpoint]}/${api}`

  if(endpoints.hasOwnProperty(endpoint)) {
    return fetch(url, {
      method: "POST",
      headers: Object.assign({}, headers, defaultHeaders),
      body: JSON.stringify(body)
      ...other
    })
  }

  throw new Error(`${endpoint} is not a valid endpoint`)
}

module.exports = { 
  encodeParams, 
  userAgent,
  endpoints,
  query
}