import {useEffect, useState} from "react";
import ShopPageCategory from "../../components/shop/ShopPageCategory";
import {useRouter} from "next/router";
import shopApi from "../../api/shop";
import store from "../../store";
import moment from "moment"
import m from "moment-timezone"
import {ApiCustomSettingsAsync} from "../../services/utils";
import serverSideActions from "../../services/serverSide";
import allActions from "../../services/actionsArray";
import Head from 'next/head'

import clientSideActions from "../../services/clientSide";
import {generalProcessForAnyPage} from "../../services/utils";

export default function Catlog(props) {
  const {query} = useRouter();
  const router = useRouter();
  const {dispatch} = store;
  const [change, setChange] = useState(false);

  // useEffect(() => {
  //   /// window.history.replaceState(null, "", window.location.href);
  //   router.push(window.location.pathname, window.location.pathname);
  // }, [query, change]);

  useEffect(() => {
    for (let actionKey in props.dispatches) {
      dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [props.locale]);
  const logoPath = `configuration/logo/logo.webp`
  return (
    <>
      <Head>
        <title>{query.slug}</title>
        <meta property="og:title" name="title"
              content={props.metaOptions.meta_title ? props.metaOptions.meta_title : props.dbName}/>
        <meta property="og:description" name="description"
              content={props.metaOptions.meta_description ? props.metaOptions.meta_description : props.categoryTitle}/>
        <meta property="og:keywords" name="keywords"
              content={props.metaOptions.meta_keywords ? props.metaOptions.meta_keywords : props.categoryTitle}/>
        <meta
          property="og:image"
          name="image"
          content={`https://${props.dbName}/storage/${props.domain}/${props.metaOptions.image ? props.metaOptions.image : logoPath}`}
        />
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title"
              content={props.metaOptions.meta_title ? props.metaOptions.meta_title : props.dbName}/>
        <meta name="twitter:description"
              content={props.metaOptions.meta_description ? props.metaOptions.meta_description : props.categoryTitle}/>
        <meta name="twitter:image"
              content={`https://${props.dbName}/storage/${props.domain}/${props.metaOptions.image ? props.metaOptions.image : logoPath}`}/>
      </Head>
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
    </>
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

  var databaseName;

  if (dbName.includes(".zegashop.com")) {
    var dataName = dbName.split(".zegashop.com");

    databaseName = dataName[0];
    process.env.domainName = dbName;

    process.env.databaseName = databaseName;
  } else {
    process.env.domainName = dbName;
    databaseName = dbName.split(".")[0];
    if (databaseName == "www") {
      databaseName = dbName.split(".")[1];
    }
    process.env.databaseName = databaseName;
  }
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
    metaOptions,
    dispatches,
    brands = [],
    productsList = [],
    newdata = [];
  newdata = false;

  const settingsResponse = await ApiCustomSettingsAsync(selectedLocale);

  const categoriesResponse = await shopApi.getCategories({
    locale: selectedLocale,
  });

  function getItems(array) {
    array.forEach((e, i) => {
      if (e.slug == query.slug) {
        metaOptions = {
          meta_title: e.meta_title,
          meta_description: e.meta_description,
          meta_keywords: e.meta_keywords,
        }

      }
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

  await fetch(`https://${dbName}/api/test?slug=${query.slug}`)
    .then((response) => response.json())
    .then((response) => {

      categoryId = response.id;
      metaOptions.image = response.image
    })
    .catch((err) => console.error(err));
  await shopApi
    .getFilters(categoryId ? categoryId : query.cat_id, {
      lang: selectedLocale,
      currency: {code: settingsResponse.data.currency.code},
      limit: 8,
    })
    .then((data) => {
      brands = data;
    });

  await shopApi
    .getProductsList({
      options: {
        currency: {code: settingsResponse.data.currency.code},
        locale: selectedLocale,
      },
      location: "",
      dbName: dbName,
      catID: categoryId,
      window: null,
      limit: 18,
    })
    .then((responseProductList) => {
      dispatches = {
        ...dispatches,
        ...responseProductList.dispatches,
      };
      let currentDate = m(new Date()).tz("Asia/Yerevan").format('YYYY-MM-DD')
      if (Object.keys(filterValues).length > 0) {
        let date = new Date()
        let checkedFiltres = [];
        newdata = responseProductList.data.map((el, value) => {
          let checkFiltre = [];
          let checkFiltreConfig = [];
          checkedFiltres = Object.keys(filterValues).map((key, index) => {
            if (el.type == "simple") {
              checkFiltre[index] = Object.keys(el).filter((e) => {

                if (e == key) {
                  let splited = filterValues[key].split(",");
                  let checkData = splited.filter((s) => {
                    return s == el[e]
                  });


                  /*if (el.special_price && el.special_price_from && el.special_price_to) {
                    let date_from = m(el.special_price_from * 1000).tz("Asia/Yerevan").format('YYYY-MM-DD')
                    let date_to = m(el.special_price_to * 1000).tz("Asia/Yerevan").format('YYYY-MM-DD')
                    if (currentDate >= date_from && currentDate <= date_to) {
                      // checkData = splited.filter((s) => {
                      //   return s >= el[e]
                      // });
                      // console.log(checkData, 'checkDatacheckDatacheckData');
                    }
                  }*/

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
              let checkData = [];
              el.variants.map((response, keyIndex) => {
                checkData[index] = [];
                checkFiltre[index] = Object.keys(response).filter((e) => {
                  if (e == key) {
                    let splited = filterValues[key].split(",");

                    checkData[index][keyIndex] = splited.filter((s) => {
                      return s == response[e];
                    });
                    if (checkData[index][keyIndex].length > 0) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                });
              });

            }
          });
          var result = checkFiltre.filter((e) => e.length);
          if (checkFiltreConfig.length > 0) {
            var resultConfig = checkFiltreConfig.filter((e) => e.length);
          } else {
            var resultConfig = false;
          }
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
      currency: {code: settingsResponse.data.currency.code},
      productsList: productsList,
      brandList: brands,
      categoryId: categoryId,
      dbName: dbName,
      domain: databaseName,
      categoryTitle,
      dispatches: dispatchesNew,
      locale: selectedLocale,
      metaOptions,
    },
  };
}
