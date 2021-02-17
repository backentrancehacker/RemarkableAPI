class Document {
  constructor(storageHost, meta) {
    this.storageHost = storageHost
    this.meta = meta
  }
}

/*
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


module.exports = Document