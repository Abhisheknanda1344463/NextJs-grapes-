var express = require("express");
var router = express.Router();

const ProductControllers = require("../controllers/PorductController");
const CategoryControllers = require("../controllers/CategoryController");
const SettingsController = require("../controllers/SettingsController");
const FilterControllers = require("../controllers/FilterControllers");
const PageControllers = require("../controllers/PageControllers");
const BlogControllers = require("../controllers/BlogControllers");
const { listenerCount } = require("process");

function ApiMenuAndCategories(CategoryesMenus) {
  return new Promise((resolve, reject) => {
    console.log(menus, "CategoryesMenus");
    CategoryControllers.Get_Categoryes(CategoryesMenus).then((category) => {
      CategoryControllers.Get_Menus(CategoryesMenus).then((menus) => {
        // console.log(menus, 'menusmenusmenusmenus');
        resolve({
          category: category,
          menus: menus,
        });
      });
    });
  });
}

// ###################################################################### pages
router.get("/cms/blogs", function (req, res) {
  BlogControllers.Get_Blogs(req.query).then((response) => {
    res.send(response);
  });
});

router.get("/cms/blog/:blogSlug", function (req, res) {
  BlogControllers.Get_Blog_By_Slug({
    locale: req.query.locale,
    url_key: req.params.blogSlug,
  }).then((response) => {
    res.send(response);
  });
});

router.get("/get-pages", function (req, res) {
  PageControllers.Get_Pages_by_ids_array(req.query).then((response) => {
    res.send(response);
  });
});

router.get("/cms/page/:pageSlug", function (req, res) {
  const { locale } = req.query;
  const { pageSlug } = req.params;

  PageControllers.Get_Page_By_Slug({
    locale,
    pageSlug,
  }).then((response) => {
    res.send(response);
  });
});

// ###################################################################### products

router.get("/translations", function (req, res) {
  SettingsController.Get_Translations(req.query).then((response) =>
    res.send(response)
  );
});
router.get("/products", function (req, res) {
  ProductControllers.Get_Product_list(req.query).then((response) =>
    res.send(response)
  );
});
router.get("/related-products", function (req, res) {
  ProductControllers.Get_Related_Products(req.query).then((response) => {
    res.send(response);
  });
});
router.get("/up-sell-products", function (req, res) {
  ProductControllers.Get_Up_Sell_Products(req.query).then((response) => {
    res.send(response);
  });
});
router.get("/cross-sell-products", function (req, res) {
  ProductControllers.Get_Cross_Sell_Products(req.query).then((response) => {
    res.send(response);
  });
});
router.get("/featured-products", function (req, res) {
  ProductControllers.Get_featured_Products(req.query).then((response) =>
    res.send(response)
  );
});
router.get("/new-products", function (req, res) {
  ProductControllers.Get_New_Products(req.query).then((response) => {
    res.send(response);
  });
});
router.get("/product/:productSlug", function (req, res) {
  ProductControllers.Get_Products_By_Slug(req.params, req.query).then(
    (response) => {
      res.send(response);
    }
  );
});

router.get("/product-configurable-config/:id", function (req, res) {
  ProductControllers.Get_Configurable_Config(req.params.id).then((response) => {
    res.send(response);
  });
});



// router.get("/bundle-product/:id", function(req, res) {
//   ProductControllers.Get_Bundle_Prods(req.params, req.query).then(response => {
//     res.send(response)
//   })
// });

router.get("/bundle-product/:id", function (req, res) {

  const { locale } = req.query;
  const { id } = req.params;
  console.log(locale , "req.queryreq.queryreq.query")

  ProductControllers.Get_Bundle_Prods({
    locale,
    id,
  }).then((response) => {
    res.send(response);
  });
});


// ###################################################################### general

router.get("/categories", function (req, res) {
  CategoryControllers.Get_Categoryes(req.query).then((response) => {
    res.send(response);
  });
});
router.get("/cms/menus", function (req, res) {
  CategoryControllers.Get_Menus(req.query).then((response) =>
    res.send(response)
  );
});

router.get("/filters", function (req, res) {
  FilterControllers.Get_Filters(req.query).then((response) => {
    // console.log(response, "========response = routing");
    res.send(response);
  });
});

router.get("/custom-settingss", function (req, res) {
  /////REMEMBER IMPORTANT PART
  // console.log(process.env.databaseName, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  const urlStore = req.headers["x-forwarded-host"];
  SettingsController.Get_Settings(process.env.databaseName, urlStore)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(
        error,
        "-----#############------error-----#############------"
      );
    });
});

router.get("/general-data", function (req, res) {
  SettingsController.Get_Settings().then((settings) => {
    const data = JSON.parse(JSON.stringify(settings));
    const { channel_info } = data;
    const { default_locale_id, locales } = channel_info[0];
    const locale = locales.find((locale) => locale.id === default_locale_id);
    const CategoryesMenus = { locale: locale.code };
    const general = ApiMenuAndCategories(CategoryesMenus);
    res.send({
      settings: settings,
      ...general,
    });
  });
});

router.get("/home-products", function (req, res) {
  const options = {
    locale: req.query.locale,
    currency: req.query.currency,
    limit: 8,
  };
  ProductControllers.Get_New_And_Futured_Products(options).then((products) => {
    res.send({
      featuredProducts: products.featured,
      newProduct: products.new,
      minPrices: products.status,
    });
  });
});
//create by Tigran (frontend Developer)

router.get("/get-meta", function (req, res) {
  const options = {
    locale: req.query.locale,
  };
  PageControllers.Get_Channels(options).then((meta) => {
    // console.log(meta, "metametameta");
    res.send({
      data: meta.data,
    });
  });
});
//created by Manvel
// router.get('/get-crosell-upsell-products', function (req, res) {
//   const options = {
//     locale: req.query.locale,
//     product_id: req.query.product_id,
//     currency: req.query.currency,
//   };
//   ProductControllers.Get_UpSell_And_CrossSell_Products(options).then((products) => {
//     res.send(products)
//     // res.send({
//     //   // crossell: products.crossell,
//     //   // newProduct: products.new,
//     // });
//   })

// router.get('/setting-config', function (req, res) {
//   SettingsController
//     .then(test => {
//       console.log(test, 'kdaklsgjsfkaklsgafkl')
//       res.send(test)
//     })
// })

router.get("/product-type", function (req, res) {
  ProductControllers.Get_Product_Type(req.query).then((resp) => {
    res.send(resp);
  });
});

/********** getting core configuration for enable/disable things *********/
router.get("/core-conf", function (req, res) {
  SettingsController.Get_Core_Config(req.query).then((rep) => res.send(rep));
});

// ProductControllers.Get_New_Products(productsOptions).then(
//   (newProduct) => {
//     ProductControllers.Get_featured_Products(productsOptions).then(
//       (featuredProducts) => {
//         res.send({
//           featuredProducts,
//           newProduct,
//         });
//       }
//     );
//   }
// );

module.exports = router;
