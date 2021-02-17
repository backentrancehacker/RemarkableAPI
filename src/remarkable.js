const path = require("path")
const uuid4 = require("uuid4")
const AdmZip = require("adm-zip")

const {
  query,
  encodeParams
} = require('./utils')


// user: token/json/2/user/new
// device: token/json/2/device/new
// discover: service/json/1/document-storage


const confirmCode = async (code) => {
  const token = await query("device", {
    code,
    deviceID: uuid4(),
    deviceDesc: "desktop-linux",
  }).then(res => res.text())

  ["invalid", "unknown", "you"].forEach(error => {
    if(token.startsWith(error)) {
      throw new Error("invalid one-time code")
    }
  })

  return token
}

class Device {
  name = userAgent
  version = "1.0.1"
  description = "The unofficial reMarkable API for Node.js"

  constructor(userToken) {
    this.userToken = userToken
  }

  async authenticate(code) {
    const token = await confirmCode(code)
    const refresh = await query("user", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    if(refresh.status !== 200) {
      throw new Error(`unexpected authentication response code ${refresh.status}`)
    }

    this.userToken = await refresh.text()
    this.storageHost = await this.#discoverStorage()
    return this.userToken
  }

  async #discoverStorage(force) {
    if(this.storageHost && !force) {
      return this.storageHost
    }

    const storageHost = await query("discover", {
      api: `service/json/1/document-storage?${encodeParams({
        environment: "production",
        group: "auth0|5a68dc51cb30df3877a1d7c4",
        apiVer: 2
      })}`
    }).then(res => res.json())

    if(storageHost.status !== 200) {
      throw new Error(`unexpected storage host response code ${storageHost.status}`)
    }

    return `https://${storageHost.Host}`
  }
}


/*
class Remarkable {
	constructor() {
		this.version = '1.0.0';
		this.name = 'adcharity-remarkable-api';
		this.description = 'Unofficial Remarkable Tablet API';
	}
	async getDocuments(options) {
		this.storageHost = await this.getStorageHost();

		const {id, withBlob} = options || {};
		const query = typeof options == 'undefined' ? '' : utils.query ({
			doc: id,
			withBlob: !!withBlob
		});

		const url = `${this.storageHost}/document-storage/json/2/docs?${query}`;

		const documents = await fetch(url, {
			headers: {
				'User-Agent': userAgent,
				Authorization: `Bearer ${this.userToken}`
			}
		}).then(res => res.json());

		return documents;
	}
	async uploadRequest() {
		this.storageHost = await this.getStorageHost();
				
		const url = `${this.storageHost}/document-storage/json/2/upload/request`;
		
		const docId = uuid4();

		const data = await fetch(url, {
			method: 'PUT',
			headers: {
				'User-Agent': userAgent,
				Authorization: `Bearer ${this.userToken}`
			},
			body: JSON.stringify([{
				ID: docId,
				Type: 'DocumentType',
				Version: 1
			}])
		}).then(res => res.json());

		data.forEach(datum => {
			if(datum.Success !== true) {
				throw new Error(`Upload request failed: ${datum.Message}`);
			}
		});

		const uploadUrls = data.map(datum => datum.BlobURLPut);
		if(uploadUrls.length !== 1) {
			throw new Error('Unexpected number of upload URLs returned');
		}

		return {
			docId,
			uploadUrl: uploadUrls[0]
		}
	}
	async updateDocument(metadata) {
		this.storageHost = await this.getStorageHost();
				
		const url = `${this.storageHost}/document-storage/json/2/upload/update-status`;

		const data = await fetch(url, {
			method: 'PUT',
			headers: {
				'User-Agent': userAgent,
				Authorization: `Bearer ${this.userToken}`
			},
			body: JSON.stringify([{
				ID: metadata.id,
				Version: metadata.version,
				ModifiedClient: metadata.dateModified,
				Type: metadata.type,
				VissibleName: metadata.visibleName,
				CurrentPage: metadata.currentPage,
				Bookmarked: metadata.bookmarked,
				Parent: metadata.parent,
			}])
		}).then(res => res.json());

		return data[0];
	}
	async deleteDocument(id, version) {
		this.storageHost = await this.getStorageHost();
				
		const url = `${this.storageHost}/document-storage/json/2/delete`;

		const data = await fetch(url, {
			method: 'PUT',
			headers: {
				'User-Agent': userAgent,
				Authorization: `Bearer ${this.userToken}`
			},
			body: JSON.stringify([{
				ID: id,
				Version: version
			}])
		}).then(res => res.json());

		return data[0]
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

  		const { docId, uploadUrl } = await this.uploadRequest();
		
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