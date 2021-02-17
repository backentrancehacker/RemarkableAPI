# remarkable-api
The unofficial reMarkable API for Node.js

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
You can set the `userToken` of the device using the `refresh` method. This method will also reset the `storageHost` and `notificationsHost` that are required to upload documents and send messages to the reMarkable. 
```js
const Device = require("adcharity-remarkable-api")
const reMarkable = new Device()

reMarkable.refresh(process.env.USER_TOKEN) // recommended
reMarkable.userToken = process.env.USER_TOKEN // will not work
```

## Documents
Once authenticated, you can interact with the API. Currently, you can retrieve all documents, delete documents, and upload documents.
Remarkable devices only support pdf and epub files.

## Methods
```
device.getDocuments()
// returns an array of all documents on the device

device.uploadDocument('file  path', 'extension (default is pdf)')
// uploads a file, returns some general meta data about the file uploaded

device.deleteDocument('file id', 'version number')
// you can get the file id and version numbers from either getDocuments or after you upload a document.
```

## Other Reesource