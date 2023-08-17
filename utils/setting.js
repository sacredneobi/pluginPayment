const path = require("path");
const fs = require("fs");

const loadSetting = (dirName) => {
  process.setting = {};
  const fileSetting = `${dirName}${path.sep}setting.json`;
  if (fs.existsSync(fileSetting)) {
    try {
      const data = fs.readFileSync(fileSetting, { encoding: "utf8" });
      process.setting = data && data?.trim() !== "" ? JSON.parse(data) : {};
    } catch (err) {
      console.error("SETTING", err);
      process.setting = {};
    }
  }
};

module.exports = { loadSetting };
