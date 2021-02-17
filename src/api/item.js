const fetch = require("node-fetch")
const fs = require("fs").promises
const { query } = require("../utils")

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

  async upload() {
    if(this.type == "CollectionType") {
      // TODO: uploading in collection
    }
    else {
      throw new Error("this item is not a folder; upload from the reMarkable instance instead")
    }
  }
  
  async update() {
    
  }

  async remove() {
    const { id, version } = this.meta

    const [ data ] = await query(this.storageHost, {
      api: "document-storage/json/2/delete",
      method: "PUT",
      body: {
        ID: id,
        Version: version
      }
    }).then(res => res.json())

    return data
  }
}

/*
	// await extract('reMarkable.zip', { dir: path.join(__dirname, 'reMarkable.pdf') })
 */


module.exports = Item