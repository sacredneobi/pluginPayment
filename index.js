const fs = require("fs");
const path = require("path");
const { pluginEvent, loadSetting } = require("./utils");

//Путь для разных вариантов способа загрузки как готового пакета и как проекта исходника
const dirName =
  process.env.isFork === "true" ? __dirname : path.dirname(process.argv[0]);

//загрузка настроек если таковые есть файл setting.json в папке с плагином
loadSetting(dirName);

pluginEvent.on("getData", async (data, answer) => {
  const { login, password, pluginData, type, order, transactionId } = data;

  console.debug("SETTING", JSON.stringify(data));

  //Конвертация PluginData в нем могут быть дополнительные настройки для сервиса
  let newPluginData = {};
  try {
    newPluginData = pluginData ? JSON.parse(pluginData) : {};
  } catch (err) {
    console.error("PLUGIN_DATA", err);
  }

  if (type === "getLink") {
    answer({
      url: "http://payment.xxx",
      transactionId: "XXX",
      done: true,
      other: { todo: "redirect" },
      externalService: false,
      ext: true,
    });
  } else if (type === "checkPayment") {
    answer({
      isPayment: true,
      failed: false,
      done: true,
      other: { transaction: "XXX" },
    });
  } else {
    // Заглушка на случай не обработанного типа операции
    answer({ isPayment: false });
  }
});
