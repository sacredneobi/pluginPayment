const { EventEmitter } = require("events");
const fs = require("fs");
const path = require("path");

let config = {
  name: "_XXX_",
  version: "x.x.x",
  description: "test module",
  type: "xxx",
};

const fileConfig = path.resolve(`${__dirname}/../package.json`);

if (fs.existsSync(fileConfig)) {
  try {
    config = JSON.parse(fs.readFileSync(fileConfig, "utf8"));
  } catch (error) {
    console.logErr(error);
  }
}

console.success = function (name, ...args) {
  console.log(
    `\x1b[32m[${config?.name?.toUpperCase()}][SUCCESS][PLUGIN][${name}]\x1b[0m:`,
    ...args
  );
};

console.error = function (name, ...args) {
  console.log(
    `\x1b[31m[${config?.name?.toUpperCase()}][ERROR][PLUGIN][${name}]\x1b[0m:`,
    ...args
  );
};

console.done = function (name, ...args) {
  console.log(
    `\x1b[34m[${config?.name?.toUpperCase()}][DONE][PLUGIN][${name}]\x1b[0m:`,
    ...args
  );
};

console.debug = function (name, ...args) {
  console.log(`----------------------------------------`);
  console.log(
    `\x1b[34m[${config?.name?.toUpperCase()}][DEBUG][PLUGIN][${name}]\x1b[0m:`,
    ...args
  );
  console.log(`----------------------------------------`);
};

class PluginEvent extends EventEmitter {
  _isDebug = false;

  constructor(plugin) {
    super();
    this.init(plugin);
  }

  init(plugin) {
    console.done("LOADING", plugin.name);
    process.on("message", async (data) => {
      const { eventId, eventName, ...other } = data;

      if (this._isDebug) {
        console.debug("GET DATA PLUGIN", JSON.stringify(data));
      }

      const event = (data) => {
        if (this._isDebug) {
          console.debug(
            "SEND DATA PLUGIN",
            JSON.stringify({ eventId, ...data })
          );
        }
        process.send({ eventId, data });
      };

      this.emit(eventName, other, event);
    });

    this.on("getName", (data, event) => {
      event(plugin);
      this._isDebug = data?.isDebug ? data?.isDebug : false;
    });
  }
}

const pluginEvent = new PluginEvent({
  name: config.caption,
  version: config.version,
  description: config.description,
  icon: config.icon,
  type: config.typeModule,
});

const myArgs = process.argv.slice(2);

if (myArgs.includes("isSingle")) {
  console.done("SINGLE", `run as single project`);

  setTimeout(() => {
    pluginEvent.emit(
      "getData",
      config?.testData ? config?.testData : {},
      (data) => {
        console.done("TO MAIN", JSON.stringify(data, null, 2));
      }
    );
  }, 1000);

  if (config?.testData?.interval) {
    const { time } = config?.testData?.interval;

    console.logDone("INTERVAL", `set interval to ${time} ms`);

    setInterval(() => {
      const { isSingle, ...other } = config?.testData ? config?.testData : {};
      if (isSingle) {
        pluginEvent.emit("getData", other, (data) => {
          console.done("TO MAIN", JSON.stringify(data, null, 2));
        });
      }
    }, time);
  }
}

module.exports = { pluginEvent };
