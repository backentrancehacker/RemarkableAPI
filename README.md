# AdCharity Remarkable API
Unofficial Remarkable Tablet API

## Benefits
* Promised based
* Simple usage based around "Documents"

## Installation
```
npm install adcharity-remarkable-api
```

## Getting Started
Start by installing the api. Next, initialize a new reMarkable device like so.
```
const Remarkable = require('adcharity-remarkable-api')
const main = async () => {
	const device = new Remarkable()
}
main()
```

## Authentication
Get a one-time code from my.remarkable.com
When you are authenticated, you should save the userToken in a file or somewhere safe. The userToken is how you will interact with the Remarkable.
```
const Remarkable = require('adcharity-remarkable-api')
const fs = require('fs')
const main = async () => {
	const device = new Remarkable()	
	const userToken = await device.authenticateUser('one-time-code')
	fs.writeFileSync('./userToken.txt', userToken)
}
main()
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