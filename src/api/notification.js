const WebSocket = require("ws")

let wss = {}

class Notification {
  constructor() {

  }
}

const setWebSocket = (notificationsHost) => {
  wss = new WebSocket(`wss://${notificationsHost}`, {
    perMessageDeflate: false
  })
}

module.exports = {
  Notification,
  setWebSocket
}