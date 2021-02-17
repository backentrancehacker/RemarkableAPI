const fetch = require("node-fetch")
const uuid4 = require("uuid4")

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
  "Content-Type": "application/json",
  "Authorization": "Bearer"
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

const setUserToken = (token) => {
  defaultHeaders.Authorization = `Bearer ${token}`
  return token
}

const requestUpload = (storageHost) => {
  const ID = uuid4()
  
  const data = await query(storageHost, {
    api: "document-storage/json/2/upload/request",
    body: {
      ID,
      Version: 1
      Type: "DocumentType",
    }
  }).then(res => res.json())

  data.forEach(datum => {
    const { Success, Message } = datum
    if(!Success) {
      throw new Error(`upload request failed: ${Message.toLowerCase()}`)
    }
  })

  const uploadUrls = data.map(datum => datum.BlobURLPut)
  if(uploadUrls.length !== 1) {
    throw new Error("unexpected number of upload requests")
  }

  return [ ID, uploadUrls.shift() ]
}

module.exports = { 
  query,
  endpoints,
  encodeParams, 
  setUserToken,
  requestUpload
}