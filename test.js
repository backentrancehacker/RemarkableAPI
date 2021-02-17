const Device = require("./");
const fs = require("fs").promises;

const reMarkable = new Device();

(async () => {
  await reMarkable.refresh(process.env.USER_TOKEN);
  reMarkable.item("4c8566a1-1d89-4e3d-80e6-5f6bb125c5a7").then(console.log)
})();