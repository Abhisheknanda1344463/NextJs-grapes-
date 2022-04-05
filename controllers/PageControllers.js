const PagesEn = require("../models/PagesEn.js");
const PagesHy = require("../models/PagesHy.js");
const PagesRu = require("../models/PagesRu.js");
const Pages = require("../models/Pages.js");
const Channels = require("../models/Channels.js");

function Get_Page_By_Slug({ pageSlug, locale }) {
  // const modulesInfo = {
  //   "en": PagesEn,
  //   "hy": PagesHy,
  //   "ru": PagesRu,
  // };
  // const Module = modulesInfo[locale];

  return new Promise((resolve, reject) => {
    //// console.log(pageSlug, 'pageSlug')
    // console.log(search, "itemitem");
    const search =
      typeof parseInt(pageSlug) == "number" && parseInt(pageSlug)
        ? { id: parseInt(pageSlug) }
        : { url_key: pageSlug };

    Pages.findOne(search)
      .then((item) => {
        let translatedData = [];
        ////  console.log(item, "itemitem");
        item.translations.find((translate) => {
          if (translate.locale === locale) {
            const locale = JSON.parse(JSON.stringify(translate));
            translatedData.push(locale);
          }
        });
        const newtranslatedData = translatedData.filter(function (element) {
          return element !== undefined;
        });
        resolve({ data: newtranslatedData });
      })
      .catch((err) => reject(err));
  });
}

function Get_Pages_by_ids_array({ locale, ids }) {
  const modulesInfo = {
    en: PagesEn,
    hy: PagesHy,
    ru: PagesRu,
  };
  const Module = modulesInfo[locale];

  return new Promise((resolve, reject) => {
    Module.find({ locale, id: { $in: ids.split(",") } })
      .then((pages) => resolve(pages))
      .catch((err) => reject(err));
  });
}

function Get_Channels({ locale }) {
  return new Promise((resolve, reject) => {
    const metaData = [];
    Channels.find()
      .then((response) => {
        // response.find(item => {
        //   // console.log(item, '555555555555')
        //   item.translations.forEach(elem => {
        //     if(elem.locale === locale) {
        //       const localeMetas = JSON.parse(JSON.stringify(elem))
        //       // console.log(locale,"klgnjkfgjkgkkfjkghkkghjj")
        //       metaData.push(localeMetas)
        //     }
        //   })
        // })
        metaData.push(JSON.parse(JSON.stringify(response[0].translations[0])));
        // console.log(metaData, "________-----------_____")
        resolve({ data: metaData });
      })
      .catch((err) => reject(err));
  });
}

exports.Get_Channels = Get_Channels;
exports.Get_Pages_by_ids_array = Get_Pages_by_ids_array;
exports.Get_Page_By_Slug = Get_Page_By_Slug;
