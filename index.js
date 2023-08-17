const fs = require("fs");
const path = require("path");
const { pluginEvent, loadSetting } = require("./utils");

//Путь для разных вариантов способа загрузки как готового пакета и как проекта исходника
const dirName =
  process.env.isFork === "true" ? __dirname : path.dirname(process.argv[0]);

//загрузка настроек если таковые есть файл setting.json в папке с плагином
loadSetting(dirName);

pluginEvent.on("getData", async (data, answer) => {
  /*
  login - из формы оплаты
  password - из формы оплаты
  pluginData - из формы оплаты
  type - тип операции, getLink - получение ссылки на оплаты, checkPayment - проверка оплаты по транзакции
  order - состав заказа
  {
    currency,              //Код валюты с формы магазина
    id,                    //Номер заказа
    description,           //Описание из заказа и ник клиента
    items: [               //Список позиций, в том числе и доставки
      { 
        label,             //Название позиции
        amount             //Сумма позиции
      }
    ],
    sum: {                 //Суммы раздельно
      promo,               //Промокод
      delivery,            //Стоимость доставки
      deliveryZone,        //Стоимость доставки по зоне
      full,                //Полная сумма заказа
    },
    client: {              //Клиент
      caption,             //Заголовок клиента
      description,         //Описание клиента
      userName,            //Ник клиента
    },
    delivery: {            //Доставка
      caption,             //Название
      description,         //Описание
    },
    deliveryAddress: {     //Адрес доставки
      pluginData,          //Данные из плагина доставки
      pluginId,            //Идентификатор доставки из плагина доставки
      full,                //Полный адрес
      coordinates,         //Координаты доставки
      street,              //Улица
      house,               //Дом
      apartment,           //Квартира
      entrance,            //Подъезд
      floor,               //Этаж
      doorCode,            //КОд домофона
    }
  }
  transactionId - заполнен при проверки оплаты
  */
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
    // {
    //   url: "http://payment.xxx",     //Ссылка для перехода на форму оплаты
    //   transactionId: "XXX",          //Номер транзакции, нужен для проверки факта оплаты по статусу
    //   done:true,                     //Факт успешного завершения
    //   other:{"todo":"redirect"},     //Произвольные данные которые будут сохранены для заказа в
    //   ext: true,                     // ext - для открытия во встроенном окне, false или убрать для открытия как отдельного окна
    //   error: "text error"            //Текст ошибка при создании ссылки
    // }

    answer({
      url: "http://payment.xxx",
      transactionId: "XXX",
      done: true,
      other: { todo: "redirect" },
      ext: true,
    });
  } else if (type === "checkPayment") {
    // {
    //   isPayment:true,                //Успешная оплата
    //   failed:false,                  //Если была ошибка
    //   done:true,                     //Завршения операции
    //   other:{"transaction":"XXX"}   //Произвольные данные которые будут сохранены для заказа в
    //   error: "text error"            //Текст ошибка при создании ссылки
    // }

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
