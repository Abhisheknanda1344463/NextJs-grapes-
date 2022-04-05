const CategoriesEn = require("../models/CategoriesEn.js");
const CategoriesHy = require("../models/CategoriesHy.js");
const CategoriesRu = require("../models/CategoriesRu.js");

// const MenuEn = require("../models/MenusEn.js");
// const MenuHy = require("../models/MenusHy.js");
// const MenuRu = require("../models/MenusRu.js");
const Menus = require("../models/Menus.js");
const Pages = require("../models/Pages.js");
function Get_Menus(props) {
  // const modulesInfo = {
  //   "en": MenuEn,
  //   "hy": MenuHy,
  //   "ru": MenuRu,
  // }
  // const Module = modulesInfo[props.locale];
  //created By Manvel for Front End Developer
  let newPages = new Promise((resolve, reject) => {
    Pages.find()
      .then((pages) => {
        resolve(pages);
      })
      .catch((err) => reject(err));
  });
  return newPages.then((result) => {
    return new Promise((resolve, reject) => {
      Menus.find()
        .then((res) => {
          let pages = result;
          var newData = [];

          pages.map((page) => {
            let dataRes = res.find((menu) => {
              const data = JSON.parse(JSON.stringify(menu));
              //// console.log(data);
              if (data.page_id && page.id === data.page_id) {
                data["page_key"] = page.url_key;
              }
              newData.push(data);
            });
            newData.push(dataRes);
          });
          const data = newData.filter(function (element) {
            return element !== undefined;
          });

          let translatedData = [];
          data.map((item) => {
            let translated = item.translations.find((translate) => {
              if (translate.locale === props.locale) {
                const locale = JSON.parse(JSON.stringify(translate));
                locale["page_key"] = item.page_key;
                locale["type"] = item.type;
                locale["url_key"] = item.url_key;
                translatedData.push(locale);
              }
            });
            translatedData.push(translated);
          });
          const newtranslatedData = translatedData.filter(function (element) {
            return element !== undefined;
          });

          resolve({ data: newtranslatedData });
        })
        .catch((err) => reject(err));
    });
  });
}

function Get_Categoryes(props) {
  const modulesInfo = {
    en: CategoriesEn,
    hy: CategoriesHy,
    ru: CategoriesRu,
  };

  const Module = modulesInfo[props.locale];
  // console.log(props.locale, "props.locale");
  return new Promise((resolve, reject) => {
    Module.find()
      .then((res) => {
        resolve(res[0].data);
      })
      .catch((err) => reject(err));
  });
}

exports.Get_Menus = Get_Menus;
exports.Get_Categoryes = Get_Categoryes;
