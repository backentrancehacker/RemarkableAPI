const fetch = require("node-fetch")
const fs = require("fs").promises
const { query } = require("../utils")

const map = {
  "ID": "id",
  "Version": "version",
  "BlobURLGet": "blob",
  "BlobURLGetExpires": "blobExpiration",
  "ModifiedClient": "dateModified",
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

class Item {
  constructor(storageHost, meta) {
    this.storageHost = storageHost
    
    if(!meta.Success) {
      return null
    }

    this.meta = correct(meta)
  }

  async download(_fileName) {
    const fileName = _fileName.endsWith(".zip")
      ? _fileName
      : _fileName + ".zip"

    const blob = await fetch(this.meta.blob, {
      method: "GET"
    }).then(res => res.buffer())
    
    await fs.writeFile(fileName, blob)
    return fileName
  }

  extract(fileName, location) {
    
  }

  async upload() {
    if(this.type == "CollectionType") {
      // TODO: uploading in collection
    }
    else {
      throw new Error("this item is not a folder; upload from the reMarkable instance instead")
    }
  }
  
  async update(metadata) {
    const [ body ] = await query(this.storageHost, {
      api: "document-storage/json/2/upload/update-status",
      method: "PUT",
      body: [correct(metadata)]
    })

    return body.Success
  }

  async remove() {
    const { id, version } = this.meta

    const [ body ] = await query(this.storageHost, {
      api: "document-storage/json/2/delete",
      method: "PUT",
      body: [
        {
          ID: id,
          Version: version
        }
      ]
    }).then(res => res.json())

    return body.Success
  }
}

/*
	// await extract('reMarkable.zip', { dir: path.join(__dirname, 'reMarkable.pdf') })
 */


module.exports = Item