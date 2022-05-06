// const BlogsEn = require("../models/BlogsEn.js");
// const BlogsHy = require("../models/BlogsHy.js");
// const BlogsRu = require("../models/BlogsRu.js");

const Blogs = require("../models/Blogs.js");

function Get_Blogs({ locale, page = 1, limit = 6 }) {
  // const modulesInfo = {
  //     "en": BlogsEn,
  //     "hy": BlogsHy,
  //     "ru": BlogsRu,
  // }
  // const Module = modulesInfo[locale];
  //Create By Manvel for Front End developer

  return new Promise((resolve, reject) => {
    Blogs.countDocuments({}).exec((count_error, count) => {
      if (count_error) {
        return res.json(count_error);
      }
      const pageCount = Math.ceil(count / limit);
      const skip = (+page - 1) * limit;
      Blogs.find()
        .skip(skip)
        .limit(+limit)
        .exec((err, blogs) => {
          let translatedData = [];
          blogs.map((blog) => {
            // console.log(blog, "blog without slug")
            let translated = blog.translations.find((translate) => {
              if (translate.locale === locale) {
                const locale = JSON.parse(JSON.stringify({ ...translate, image: blog.image, created_at: blog.created_at }));
                translatedData.push(locale);
              }
            });
            // console.log("get_blogs",translated )
            translatedData.push(translated);
          });
          const newtranslatedData = translatedData.filter(function (element) {
            return element !== undefined;
          });
          // console.log(translatedData,"________________________________________________________________++++++")

          resolve({
            data: newtranslatedData,
            meta: {
              current_page: page,
              total: pageCount,
            },
            links: {},
          });
        });
    });
  });
}

function Get_Blog_By_Slug({ locale, url_key }) {
  // const modulesInfo = {
  //     "en": BlogsEn,
  //     "hy": BlogsHy,
  //     "ru": BlogsRu,
  // }
  // const Module = modulesInfo[locale];

  return new Promise((resolve, reject) => {
    Blogs.findOne({ url_key })
      .then((blog) => {
        // console.log(blog, "blog in blog controller")
        let translatedData = [];
        blog.translations.map((item) => {
          // console.log("get_blogs_slug",item);
          //   let translated = item.find((translate) => {

          if (item.locale === locale) {
            // consle.log(item, "item in XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
            const locale = JSON.parse(JSON.stringify({ ...item, image: blog.image, created_at: blog.created_at }));
            translatedData.push(locale);
          }
        });
        /// translatedData.push(locale);
        /// });
        const newtranslatedData = translatedData.filter(function (element) {
          return element !== undefined;
        });
        // console.log(newtranslatedData, "newtranslatedDatanewtranslatedDatanewtranslatedDatanewtranslatedDatanewtranslatedDatanewtranslatedData")

        /////   console.log(newtranslatedData, 'newtranslatedDatanewtranslatedDatanewtranslatedData')
        resolve({ data: newtranslatedData });
      })
      .catch((err) => reject(err));
  });
}

exports.Get_Blogs = Get_Blogs;
exports.Get_Blog_By_Slug = Get_Blog_By_Slug;
