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

const requestUpload = async (storageHost) => {
  const ID = uuid4()

  const [ body ] = await query(storageHost, {
    api: "document-storage/json/2/upload/request",
    body: {
      ID,
      Version: 1,
      Type: "DocumentType",
    }
  }).then(res => res.json())

  const { Success, Message, BlobURLPut } = body

  if(!Success) {
    throw new Error(`upload request failed: ${ Message.toLowerCase() }`)
  }

  return [ ID, BlobURLPut ]
}

const map = {
  "ID": "id",
  "Version": "version",
  "BlobURLGet": "blob",
  "BlobURLGetExpires": "blobExpiration",
  "ModifiedClient": "lastModified",
  "Type": "type",
  "VissibleName": "visibleName",
  "CurrentPage": "currentPage",
  "Bookmarked": "bookmarked",
  "Parent": "parent",
}

const correct = (_meta, invert) => {
  const meta = {}

  for(const [key, value] of Object.entries(_meta)) {
    const mapped = invert
      ? Object.keys(map).find((prop) => map[prop] == key)
      : map[key]

    if(mapped) {
      meta[mapped] = value
    }
  }

  return meta
}

module.exports = { 
  query,
  correct,
  endpoints,
  encodeParams, 
  setUserToken,
  requestUpload
}