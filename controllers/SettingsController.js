const fs = require("fs");
const ChannelInfo = require("../models/ChannelInfo.js");
const Sliders = require("../models/Sliders.js");
const CoreConfig = require("../models/CoreConfig.js");
const Social = require("../models/Social.js");
const Translations = require("../models/Translations.js");
// const fetch = require('node-fetch');
const https = require("https");
const { domainUrl, url } = require("../helper");

function Get_Settings(fullUrl, urlStore) {
  // console.log(process.env.domainName, "fullUrl");
  const storeName = process.env.databaseName;
  const p1 = new Promise((resolve, reject) => {
    ChannelInfo.find()
      .then((res) => resolve({ channel_info: res }))
      .catch((err) => reject(err));
  });

  const p2 = new Promise((resolve, reject) => {
    Sliders.find()
      .then((res) => resolve({ sliders: res }))
      .catch((err) => reject(err));
  });

  // const p3 = new Promise((resolve, reject) => {
  //   ////// console.log(fullUrl, urlStore, "fullUrlfullUrl");
  //   let rawdata = fetch(
  //     domainUrl(
  //       `${urlStore}/storage/${storeName}/cached/translations/translations.json`
  //     )
  //   );
  //   ////  let translations = JSON.parse(rawdata)
  //   resolve({ rawdata });
  // });

  const p4 = new Promise((resolve, reject) => {
    CoreConfig.find({
      code: {
        $in: [
          "general.info.general.phone",
          "general.info.general.footer_email",
          "general.info.general.footer_address",
          "general.content.custom_scripts.custom_css",
          "general.content.custom_scripts.custom_javascript",
        ],
      },
    })
      .then((res) => {
        const store_info = res
          .map(({ code, value }) => {
            let [, , , key] = code.split(".");
            if (key == "custom_javascript") {
              key = "custom_js";
            }
            return value ? { [key]: value } : '';
          })
          .reduce((acc, next) => {
            return {
              ...acc,
              ...next,
            };
          }, {});
        resolve({ store_info: store_info });
      })
      .catch((err) => reject(err));
  });

  const p5 = new Promise((resolve, reject) => {
    Social.find()
      .then((res) => resolve({ social: res }))
      .catch((err) => reject(err));
  });

  return new Promise((resolve, reject) => {
    Promise.all([p1, p2, p4, p5]).then((responseArray) => {
      // console.log(responseArray, 'responseArrayresponseArray')
      let customSettingsCollection = responseArray.reduce((acc, next) => {
        const [key] = Object.keys(next);
        return {
          ...acc,
          [key]: next[key],
        };
      }, {});
      // console.log(customSettingsCollection, '----___----___----')
      customSettingsCollection.folder_name = storeName;
      resolve(customSettingsCollection);
    });
  });
}

function Get_Core_Config() {
  return new Promise((resolve, reject) => {
    CoreConfig.find({
      code: {
        $in: [
          "catalog.products.homepage.out_of_stock_items",
          "catalog.inventory.stock_options.backorders",
          "catalog.products.guest-checkout.allow-guest-checkout",
          "theme.blog.active",
          "theme.contact_us.active",
          "sales.tracking.tracking.active",
          "theme.subscription.active",
          "catalog.products.guest-checkout.allow-guest-checkout"
        ],
      },
    })
      .then((res) => {
        const core_conf = res
          .map(({ code, value = "1" }) => {
            let key = code.replace(/\./g, "_");
            let replaceSlash = key.replace(/\-/g, "_");
            return { [replaceSlash]: value };
          })
          .reduce((acc, next) => {
            return {
              ...acc,
              ...next,
            };
          }, {});

        resolve(core_conf);
      })
      .catch((err) => reject(err));
  });
}

function Get_Translations(query) {
  return new Promise((resolve, reject) => {
    Translations.findOne({ lang: query.locale }).then((res) => {
      resolve({ [query.locale]: { translations: res.data } });
    });
  });
}
exports.Get_Translations = Get_Translations;
exports.Get_Settings = Get_Settings;
exports.Get_Core_Config = Get_Core_Config;
