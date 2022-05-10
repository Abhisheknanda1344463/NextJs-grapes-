import { useEffect, useState } from "react";
import ShopPageCategory from "../../components/shop/ShopPageCategory";
import { useRouter } from "next/router";
import shopApi from "../../api/shop";
import store from "../../store";
import { ApiCustomSettingsAsync } from "../../services/utils";
import serverSideActions from "../../services/serverSide";
import allActions from "../../services/actionsArray";

import clientSideActions from "../../services/clientSide";
import { generalProcessForAnyPage } from "../../services/utils";

export default function Catlog(props) {
  const { query } = useRouter();
  const router = useRouter();
  const { dispatch } = store;
  const [change, setChange] = useState(false);
  ////console.log(props.locale, "props.localeprops.locale");
  // console.log(props, "props in categories");
  // useEffect(() => {
  //   /// window.history.replaceState(null, "", window.location.href);
  //   router.push(window.location.pathname, window.location.pathname);
  // }, [query, change]);

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);

  return (
    <ShopPageCategory
      columns={3}
      viewMode="grid"
      sidebarPosition="start"
      categorySlug={query.slug}
      locale={props.locale}
      dbName={props.dbName}
      setChange={setChange}
      productsList={props.productsList}
      data={props.productsList.data}
      page={props.productsList.page}
      {...props}
    />
  );
}

export async function getServerSideProps({
  ///query: { slug },
  locale,
  locales,
  req,
  query,
  res,
}) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const dbName = req.headers["x-forwarded-host"];
  /////FIXME WE DONT NEED ALL THIS DATA
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);

  const filterValues = {};
  Object.keys(query).forEach((param) => {
    if (param == "page") {
      const filterSlug = param;
      filterValues[filterSlug] = query[param];
    } else {
      const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);
      if (!mr) {
        return;
      }
      const filterSlug = mr[1];
      filterValues[filterSlug] = query[param];
    }
  });

  /// return filterValues;
  const selectedLocale = locale != "catchAll" ? locale : defaultLocaleSelected;
  let categoryId,
    categoryTitle,
    dispatches,
    brands = [],
    productsList = [],
    newdata = [];
  // console.log(
  //   selectedLocale,
  //   locale,
  //   defaultLocaleSelected,
  //   "selectedLocaleselectedLocaleselectedLocale"
  // );

  const settingsResponse = await ApiCustomSettingsAsync(selectedLocale);

  const categoriesResponse = await shopApi.getCategories({
    locale: selectedLocale,
  });

  function getItems(array) {
    array.forEach((e, i) => {
      if (e.slug == query.slug && e.children?.length === 0) {
        categoryId = e.id;
        categoryTitle = e.name;
        return false;
      } else {
        getItems(e.children);
      }
    });
  }

  if (categoriesResponse?.categories) {
    getItems(categoriesResponse.categories[0].children);
  }

  await shopApi
    .getFilters(categoryId ? categoryId : query.cat_id, {
      lang: selectedLocale,
      currency: { code: settingsResponse.data.currency.code },
      limit: 8,
    })
    .then((data) => {
      brands = data;
    });

  await shopApi
    .getProductsList({
      options: {
        currency: { code: settingsResponse.data.currency.code },
        locale: selectedLocale,
      },
      location: "",
      dbName: dbName,
      catID: query.cat_id,
      window: null,
      limit: 6,
    })
    .then((responseProductList) => {
      dispatches = {
        ...dispatches,
        ...responseProductList.dispatches,
      };
      if (Object.keys(filterValues).length > 0) {
        let checkedFiltres = [];
        newdata = responseProductList.data.map((el, value) => {
          let checkFiltre = [];
          let checkFiltreConfig = [];
          checkedFiltres = Object.keys(filterValues).map((key, index) => {
            if (el.type == "simple") {
              checkFiltre[index] = Object.keys(el).filter((e) => {
                if (e == key) {
                  let splited = filterValues[key].split(",");
                  let checkData = splited.filter((s) => s == el[e]);
                  if (checkData.length > 0) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              });
            } else if (el.type == "configurable") {
              var asd = shopApi
                .getFlatProduct(el.product_id, selectedLocale)
                .then((flat) => {
                  checkFiltreConfig[index] = flat.filter((e) => {
                    ///  if (e[key]) {
                    let splited = filterValues[key].split(",");
                    let checkData = splited.filter((s) => s == e[key]);
                    console.log(checkData, "checkDatacheckData");
                    if (checkData.length > 0) {
                      return true;
                    } else {
                      return false;
                    }
                    // } else {
                    //   return false;
                    // }
                  });

                  console.log(response, "asd");
                });
            }
          });
          var result = checkFiltre.filter((e) => e.length);
          if (checkFiltreConfig.length > 0) {
            var resultConfig = checkFiltreConfig.filter((e) => e.length);
          } else {
            var resultConfig = false;
          }
          console.log(resultConfig, "resultConfig");
          if (
            result.length == Object.keys(filterValues).length ||
            resultConfig.length == Object.keys(filterValues).length
          ) {
            return el;
          }
        });
        const results = newdata.filter((element) => {
          return element !== undefined;
        });
        productsList = responseProductList;
        productsList.data = results;
      } else {
        productsList = responseProductList;
      }
    });

  /////REMEBER WE NEED THIS BUT NEED TO OPTIMI
  const dispatchesNew = {
    ...dispatches,
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };
  return {
    props: {
      currency: { code: settingsResponse.data.currency.code },
      productsList: productsList,
      brandList: brands,
      categoryId: query.cat_id,
      dbName: dbName,
      categoryTitle,
      dispatches: dispatchesNew,
      locale: selectedLocale,
    },
  };
}
