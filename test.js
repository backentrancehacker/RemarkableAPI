const Device = require("./");
const fs = require("fs").promises;

const reMarkable = new Device();

(async () => {
  await reMarkable.refresh(process.env.USER_TOKEN);
  reMarkable.document().then(console.log)
})();