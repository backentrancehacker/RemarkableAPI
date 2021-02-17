const Device = require("./");
const fs = require("fs").promises;

const reMarkable = new Device();

console.log(reMarkable);

(async () => {
  await reMarkable.refresh(process.env.USER_TOKEN);
})();