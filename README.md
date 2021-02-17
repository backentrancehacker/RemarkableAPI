# remarkable-api
The unofficial reMarkable API for Node.js

## installation
```
npm install adcharity-remarkable-api
```

## creating a new device
After you install the `remarkable-api` module, you can initialize a new reMarkable device.
```
const Device = require("adcharity-remarkable-api")
const reMarkable = new Device()
```

## registering a device
To use this module, you must retrieve a one-time code from the reMarkable [dashboard](https://my.remarkable.com/connect/desktop). Confirming your one-time code will return a `userToken` that can be used to interact with the device. You should store this token somewhere safe, such as in an environmental variable. 
```
const Device = require("adcharity-remarkable-api")
const reMarkable = new Device()

reMarkable.register("one-time code").then(code => {
  console.log(code)
})
```

## setting user token
The `Device` class will accept a `userToken`. To ensure the token is still valid, you can also use the `refresh` method.

```
const Device = require('adcharity-remarkable-api')
const reMarkable = new Device(process.env.USER_TOKEN)

reMarkable.refresh(process.env.USER_TOKEN).then(userToken => {
  // returns the userToken back
})
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