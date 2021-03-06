import store from "../store";
import shopApi from "../api/shop";
import { url as originalUrl } from "../helper";
import { changeLocale } from "../store/locale";

export const url = {
  home: () => "/",

  catalog: () => "/catalog",

  // category: (category, query) =>
  //   `/catalog/${category.slug}?cat_id=${category.id}`,
  category: (category) => {
    var newUrl = "";
    // console.log(
    //   category,
    //
    //   "queryqueryquery"
    // );
    if (category.query) {

      // query.map((el, index) => {
      //   if (index == 0) {
      //     newUrl = `?${Object.keys(el)}=${Object.values(el)}`;
      //   } else {
      //     newUrl += `&${Object.keys(el)}=${Object.values(el)}`;
      //   }
      // });
      return `/catalog/${category.slug ? category.slug : category.department.slug
        }?currencies=${category.query}`;
    } else {
      return `/catalog/${category.slug ? category.slug : category.department.slug
        }`;
    }
  },

  product: (product) => {
    // console.log(product, "plplplplplplplplppllplplplplplpplp")
    return `/products/${product.url_key}`;
    // return `/products/${product.product_id || product.id}`
  },
};

export function getCategoryParents(category) {
  return category.parent
    ? [...getCategoryParents(category.parent), category.parent]
    : [];
}

export function runFbPixelEvent(eventData) {
  const {
    general: { fbPixel },
  } = store.getState();
  setTimeout(() => {
    if (fbPixel) {
      typeof window != undefined ? fbq("track", eventData.name) : null;
    }
  }, 500);
}

export async function ApiCustomSettingsAsync(locale, dbName, selectedCurency) {
  const settingsResponse = await fetch(`${originalUrl}/db/custom-settingss`);
  // const translations = await shopApi.translations;
  // await fetch(`${originalUrl}/db/translations`);
  const customSettingsData = await settingsResponse.json();


  // store.createStore();
  const seettingData = await fetch(
    `${originalUrl}/db/core-conf?locale=${locale}`
  );
  let data = {};
  const seettingDataCore = await seettingData.json();
  const { channel_info } = customSettingsData;
  let dispatches = {
    serverSide: {
      setDomain: customSettingsData?.folder_name || false,
      setSocial: customSettingsData?.social || false,
      setFbPixel: customSettingsData?.store_info?.facebook_pixel_id || false,
      ///  setTranslations: customSettingsData?.translations || false,
    },
    clientSide: {
      setPopup: customSettingsData?.popup || false,
      setCoreConfigs: seettingDataCore || false,
      setCustomJs: customSettingsData?.custom_js || false,
      setBackorders: customSettingsData?.store_info?.Backorders || false,
      setCasheVersion: customSettingsData?.store_info?.cash_version || false,
      setSlideImages: customSettingsData?.sliders || false,
      setStoreConfigs: customSettingsData?.store_info || false,
    },
  };

  if (channel_info) {
    const {
      locales,
      currencies,
      currencies_new,
      base_currency_id,
      default_locale_id,
    } = channel_info[0];


    dispatches["clientSide"]["setLocaleList"] = locales || false;
    dispatches["clientSide"]["changeLocale"] =
      locale != "catchAll" ? locale : default_locale_id;
    dispatches["clientSide"]["setCurrencies"] = currencies || false;
    /* ******* REMEBER TO FIX IT ********/
    /***** this part is commented because it's overwrites the store // need changeRate *******/
    // dispatches["clientSide"]["changeCurrency"] = base_currency_id || false;
    dispatches["clientSide"]["setRate"] =
      {
        list: currencies_new,
        current: selectedCurency
          ? currencies_new.find((item) => item.code == selectedCurency)
          : currencies_new.find((item) => item.id === base_currency_id),
      } || false;


    data = {
      locale: locales.find((item) => {
        if (locale != "catchAll") {
          return item.code === locale;
        } else {
          return item.id === default_locale_id;
        }
      }),
      rate: {
        currencies_new,
        current: currencies_new.find((item) => item.id === base_currency_id),
      },
      currency: currencies.find((currency) => currency.id === base_currency_id),
    };
  }
  if (channel_info && data.locale.code && dbName) {
    const translations = await shopApi.translations(data.locale.code, dbName);

    dispatches["serverSide"]["setTranslations"] = translations || false;
  }

  return {
    data: data,
    dispatches: dispatches,
  };
}

export function ApiCustomSettings(customSettingsData) {
  let dispatches = {
    setPopup: customSettingsData.popup || false,
    setSocial: customSettingsData.social || false,
    setCustomJs: customSettingsData.custom_js || false,
    setDomain: customSettingsData.folder_name || false,
    setSlideImages: customSettingsData.sliders || false,
    setBackorders: customSettingsData.Backorders || false,
    setStoreConfigs: customSettingsData.store_info || false,
    setCasheVersion: customSettingsData.cash_version || false,
    setTranslations: customSettingsData.translations || false,
    setFbPixel: customSettingsData.facebook_pixel_id || false,
  };

  if (channel_info) {
    const { locales, currencies, base_currency_id, default_locale_id } =
      channel_info;
    // console.log(channel_info, "ApiCustomSettings(customSettingsData)")

    dispatches["setLocaleList"] = locales || false;
    dispatches["changeLocale"] = default_locale_id || false;
    dispatches["setCurrencies"] = currencies || false;

    /* ******* REMEBER TO FIX IT ********/
    /***** this part is commented because it's overwrites the store // need changeRate *******/
    // dispatches["changeCurrency"] = base_currency_id || false;
  }

  return {
    ...dispatches,
  };
}

export async function ApiCategoriesAndMenues(locale) {
  // console.log(locale, "locale");
  if (locale !== "catchAll") {
    const getCategories = await shopApi.getCategories({ locale: locale });
    const getMenues = await shopApi.getMenues({ locale: locale });
    const pageIds = getMenues.data.map((e) => e.page_id).join();

    const getPages = await shopApi.getPagesByIdsArray({
      locale: locale,
      ids: pageIds,
    });
    getMenues.data = getMenues.data.map((menu) => {
      const foundPage = getPages.find((page) => page.id == menu.page_id);
      if (foundPage) menu.url_key = foundPage.url_key;

      return menu;
    });
    // console.log(getMenues.data, "poxos");

    // [...new Map(getMenues.data.map(item => [item["id"], item])).values()]

    return {
      setCatgoies: getCategories.categories || false,
      // setMenuList: getMenues.data   || false,
      // FIX ME......... for FUTURE
      setMenuList:
        [
          ...new Map(getMenues.data.map((item) => [item["id"], item])).values(),
        ] || false,
    };
  }
}

export function genereateReadyArray(array) {
  return array.map((product) => {
    return Object.values(product)[0];
  });
}

export async function generalProcessForAnyPage(
  locale,
  dbName,
  selectedCurency
) {
  /// let locale = null;
  let currency = null;
  let dispatches = null;

  ////////TODO FIX THIS PART
  ////console.log(locale);
  const settingsResponse = await ApiCustomSettingsAsync(
    locale,
    dbName,
    selectedCurency
  );
  const { setCatgoies, setMenuList } = await ApiCategoriesAndMenues(
    locale !== "catchAll" ? locale : settingsResponse.data.locale.code
  );
  dispatches = {
    serverSide: {
      ...settingsResponse.dispatches.serverSide,
      setCatgoies,
      setMenuList,
    },
    clientSide: settingsResponse.dispatches.clientSide,
  };

  // console.log(settingsResponse.data.currency.code, "aaaaaaaaaaaa");
  // locale =
  //   stateLocale?.defaultLocale?.code ?? settingsResponse.data.locale.code;
  currency = settingsResponse.data.currency.code;

  return {
    locale: settingsResponse.data.locale.code,
    rate: settingsResponse.data.rate,
    currency,
    dispatches,
  };
}

export function removeCurrencyTemp(total) {
  let convertSymbols = total
    .toString()
    .replace("$", "")
    .replace(",", "")
    .replace("??", "");
  let result = convertSymbols.replace(/\s/g, "");
  return `${Number(result)} ??`;
}
