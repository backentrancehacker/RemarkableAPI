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
Unlike v1 of the reMarkable api, all items returned from `items` or `item` are classes that will allow you to delete or modify the document. 