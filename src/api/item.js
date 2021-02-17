const fetch = require("node-fetch")
const fs = require("fs").promises

const { query } = require("../utils")
const map = {
  "ID": "id",
  "BlobURLGet": "blob",
  "BlobURLGetExpires": "blobExpiration",
  "ModifiedClient": "lastModified",
  "Type": "type",
  "VissibleName": "visibleName",
  "CurrentPage": "currentPage",
  "Bookmarked": "bookmarked",
  "Parent": "parent"
}

const correctInfo = (_meta, invert) => {
  const meta = {}

  for(const [key, value] of Object.entries(_meta)) {
    const mapped = invert
      ? Object.keys(map).find(prop = map[prop] == key)
      : map[key]

    if(mapped) {
      meta[mapped] = value
    }
  }

  return meta
}

class Item {
  constructor(storageHost, meta) {
    this.storageHost = storageHost
    
    if(!meta.Success) {
      return null
    }

    this.meta = correctInfo(meta)
  }
  async download(_fileName) {
    const fileName = _fileName.endsWith(".zip")
      ? _fileName
      : _fileName + ".zip"

    const blob = await fetch(this.meta.blob, {
      method: "GET"
    }).then(res => res.buffer())
    
    await fs.writeFile(fileName, blob)
  }
  async update() {

  }
  async remove() {
    
  }
}

/*

	// const url = document.BlobURLGet

	// const blob = await fetch(url, {
	// 	method: 'GET',
	// 	headers: {
	// 		'User-Agent': 'adcharity-remarkable-api',
	// 		Authorization: `Bearer ${device.userToken}`
	// 	}
	// }).then(res => res.buffer())

	// await fs.writeFile('reMarkable.zip', blob)

	// await extract('reMarkable.zip', { dir: path.join(__dirname, 'reMarkable.pdf') })
{
    "ID": "ec53580c-3579-4fe7-a096-fd1de8011b70",
    "Version":0,
    "Message": "Not found or access denied",
    "Success":false,
    "BlobURLGet":"",
    "BlobURLGetExpires":"0001-01-01T00:00:00Z",
    "ModifiedClient":"0001-01-01T00:00:00Z",
    "Type":"",
    "VissibleName":"",
    "CurrentPage":0,
    "Bookmarked":false,
    "Parent":""
}
 */


module.exports = Item