const path = require("path")
const uuid4 = require("uuid4")
const AdmZip = require("adm-zip")

const {
  query,
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
      version: "2.0.0",
      name: "remarkable",
      description: "The unofficial reMarkable API for Node.js"
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

  async upload(document) {
    const [ documentID, uploadUrl ] = requestUpload(this.storageHost)
    const zip = new AdmZip()
    const metadata = {
      
    }

    // TODO: uploading in reMarkable
  }

  async createDirectory(fileName) {

    // TODO: create directory
  }
}


/*
class Remarkable {
	async updateDocument(metadata) {

	}
	async uploadDocument(document, ext) {
		const docZip = new AdmZip();
		const metadata = {
			extraMetadata: {},
			fileType: ext || 'pdf',
			lastOpenedPage: 0,
			lineHeight: -1,
			margins: 180,
			textScale: 1,
			transform: {}
		};
		
		docZip.addFile(`${docId}.content`, Buffer.from(JSON.stringify(metadata)));
		docZip.addFile(`${docId}.pagedata`, Buffer.from(''));
  		docZip.addLocalFile(document, '', `${docId}.${ext || 'pdf'}`);
		
		await fetch(uploadUrl, {
			method: 'PUT',
			body: docZip.toBuffer(),
			headers: {
				'User-Agent': userAgent,
				Authorization: `Bearer ${this.userToken}`
			},
		});

		await this.updateDocument({
			id: docId,
			parent: '',
			visibleName: path.basename(document, path.extname(document)),
			version: 1,
			type: 'DocumentType',
			dateModified: (new Date()).toISOString()
		});
	}
}
*/

module.exports = Device