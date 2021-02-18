const path = require("path")
const uuid4 = require("uuid4")
const AdmZip = require("adm-zip")
const pkg = require("../package.json")

const {
  query,
  correct,
  register,
  encodeParams,
  setUserToken,
  requestUpload
} = require("./utils")

const Item = require("./api/item") 

// user: token/json/2/user/new
// device: token/json/2/device/new
// discover: service/json/1/document-storage

class Device {
  constructor(userToken='') {
    Object.assign(this, {
      userToken,
      name: pkg.name,
      version: pkg.version,
      description: pkg.description
    })
  }

  async register(code) {
    const token = await query("auth", {
      api: "token/json/2/device/new",
      body: {
        code,
        deviceID: uuid4(),
        deviceDesc: "desktop-linux"
      }
    })
    
    if(token.status !== 200) {
      throw new Error("invalid one-time code")
    }

    return token.text()
  }

  async refresh(token) {
    const refresh = await query("auth", {
      api: "token/json/2/user/new",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    if(refresh.status !== 200) {
      throw new Error(`unexpected authentication response code ${refresh.status}`)
    }

    return Promise.all([
      refresh.text(),
      this.discover("storage"),
      this.discover("notifications")
    ]).then((values) => {
      this.userToken = values.shift()
      return setUserToken(this.userToken)
    })
  }

  async discover(type, force) {
    const hostName = `${type}Host`

    if(this[hostName] && !force) {
      return this[hostName]
    }

    const api = type == "storage"
      ? (
        `service/json/1/document-storage?${encodeParams({
          group: "auth0|5a68dc51cb30df3877a1d7c4",
          environment: "production",
          apiVer: 2
        })}`
      )
      : (
        `service/json/1/notifications?${encodeParams({
          group: "auth0|7C5a68dc51cb30df1234567890",
          environment: "production",
          apiVer: 1
        })}`
      )

    const { Status, Host } = await query("service", { 
      api 
    }).then(res => res.json())  

    if(Status == "OK") {
      this[hostName] = Host
      return this[hostName]
    }

    throw new Error(`could not fetch ${type} host`)
  }

  async _fetchDocuments(options) {
    const documents = await query(this.storageHost, {
      api: `document-storage/json/2/docs?${encodeParams(options)}`,
      method: "GET"
    }).then(res => res.json())

    return documents.map(item => (
      new Item(this.storageHost, item)
    )).filter(v => v !== null)
  }

  async item(id) {
    return (await this._fetchDocuments({ 
      doc: id, withBlob: true 
    }))[0]
  }

  async items() {
    return (await this._fetchDocuments({ 
      withBlob: true 
    }))
  }

  async upload(fileName) {
    const fileType = fileName.split('.').pop()

    if(!["pdf", "epub"].includes(fileType)) {
      throw new Error(`${fileName} must be a pdf or epub`)
    }

    const [docID, uploadUrl] = await requestUpload(this.storageHost)

    const zip = new AdmZip()

    zip.addFile(`${docID}.content`, Buffer.from(JSON.stringify({
      extraMetadata: {},
      fileType,
      lastOpenedPage: 0,
      lineHeight: -1,
      margins: fileType == "pdf" ? 180 : 100,
      pageCount: 0,
      textScale: 1,
      transform: {},
    })))
    zip.addFile(`${docID}.pagedata`, Buffer.from(''))
    zip.addLocalFile(fileName, "", fileType)

    await query(uploadUrl, {
			method: "PUT",
      buffer: true,
			body: zip.toBuffer()
		})

    const [ body ] = await query(this.storageHost, {
      api: "document-storage/json/2/upload/update-status",
      method: "PUT",
      body: [correct({
        id: docID,
        parent: "",
        version: 1,
        bookmarked: false,
        type: "DocumentType",
        visibleName: fileName,
        lastModified: new Date().toISOString()
      }, true)]
    }).then(res => res.json())

    return ({
      id: docID,
      visibleName: fileName
    })
  }

  async directory(dirName) {
    // TODO: create directory
  }
}

module.exports = Device