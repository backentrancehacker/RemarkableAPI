# remarkable-api
The unofficial reMarkable API for Node.js

## version 2
Version 2 will introduce breaking changes to the API. It is currently a work in progress.

## installation
```
npm install adcharity-remarkable-api
```

## intializing a new device
After you install the `remarkable-api` module, you can create a new reMarkable device.
```js
const Device = require("adcharity-remarkable-api")
const reMarkable = new Device()
```

## registering a device
To use this module, you must retrieve a one-time code from the reMarkable [dashboard](https://my.remarkable.com/connect/desktop). Confirming your one-time code will return a `userToken` that can be used to interact with the device. You should store this token somewhere safe, such as in an environmental variable. 
```js
const Device = require("adcharity-remarkable-api")
const reMarkable = new Device()

reMarkable.register("one-time code").then(code => {
  console.log(code)
})
```

## setting user token
You can set the `userToken` of the device using the `refresh` method. This method will also reset `storageHost` and `notificationsHost`, which are required to upload documents and send messages to the reMarkable. 
```js
...
reMarkable.refresh(process.env.USER_TOKEN)
reMarkable.userToken = process.env.USER_TOKEN // will not work
```

## items
`items` will return an array of all documents and collections (or folders) on your reMarkable. 
```js
...
(async () => {
  await reMarkable.refresh(process.env.USER_TOKEN);
  reMarkable.items().then(everything => {
    console.log(everything);
  });
})();
```

## item
If you have an `id` for a particular document, you can fetch it with `item`. It will return a signle document or collection.
```js
(async () => {
  await reMarkable.refresh(process.env.USER_TOKEN);
  reMarkable.item("4c8566a1-1d89-4e3d-80e6-5f6bb125c5a7").then(console.log);
})();
```

## item class
Unlike v1 of the reMarkable api, everything returned from `items` or `item` is encapsulated within an `Item` class. This class contains methods that will allow you to delete or modify a particular document.

### original metadata
The metadata initially retrieved from reMarkable's cloud servers contains odd capitilizations and spelling errors. Some of the data is not completely necessary and pertains to the details of the request (and not the document itself). 
```js
{
  "ID": "ec53580c-3579-4fe7-a096-fd1de8011b70", // id
  "Version": 0, // version
  "Message": "", // removed
  "Success": false, // removed
  "BlobURLGet": "", // blob
  "BlobURLGetExpires": "0001-01-01T00:00:00Z", // blobExpiration
  "ModifiedClient": "0001-01-01T00:00:00Z", // lastModified
  "Type": "", // type
  "VissibleName": "", // visibleName
  "CurrentPage": 0, // currentPage
  "Bookmarked": false, // bookmarked
  "Parent": "" // parent
}
```

### metadata
Metadata in an `Item` is non-standard; it does not follow other reMarkable apis. It has been modified to address spelling mistakes (such as `VissibleName`) and make the data more convenient for JavaScript programmers. 

* `id`: used to identify documents, can be stored and passed into `item`
* `type`: `DocumentType` or `CollectionType`
* `blob`: where the file is located
* `blobExpiration`: when the blob will expire
* `lastModified`: when the file was last edited
* `visibleName`: file or directory visibleName
* `currentPage`: opened page
* `bookmarked`: starred or not
* `parent`: parent directory 

## resources & alternative apis
https://akeil.de/posts/remarkable-cloud-api/  
https://github.com/Ogdentrod/reMarkable-typescript  
https://github.com/splitbrain/ReMarkableAPI