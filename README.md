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

## authentication
To use this module, you must retrieve a one-time code from the reMarkable [dashboard](my.remarkable.com). Confirming your one-time code with return a `userToken` that can be used to interact with the reMarkable. 
```
const Device = require("adcharity-remarkable-api")
const reMarkable = new Device()

device.authenticateUser("one-time code").then(code => {
  console.log(code)
})
```


Once you have your userToken, you can replace the above code and set the userToken directly.
```
const Remarkable = require('adcharity-remarkable-api')
const fs = require('fs')
const main = async () => {
	const device = new Remarkable()	
	device.userToken = fs.readFileSync('./userToken.txt', 'utf-8')
}
main()
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