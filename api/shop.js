/* eslint-disable arrow-body-style */
// eslint-disable-next-line no-unused-vars
import qs from "query-string";
import { getCategoryBySlug } from "../fake-server/endpoints/categories";
import { url, apiUrlWithStore, domainUrl ,megaUrl} from "../helper";
import {
  getDiscountedProducts,
  getLatestProducts,
  getPopularProducts,
  getTopRatedProducts,
} from "../fake-server/endpoints/products";
// const url = "https://zega-accessories.zegashop.com"
const shopApi = {
  /**
   * Returns array of categories.
   *
   * @param {object?} options
   * @param {number?} options.depth
   *
   * @return {Promise<Array<object>>}
   */
  getCategories: (options = {}) => {
    let locale = "";
    //// console.log(url, "urlurlurlurlurl");
    if (options.locale) {
      locale = `locale=${options.locale}`;
    }
    return fetch(`${url}/db/categories?${locale}`).then((response) =>
      response.json()
    );
  },
  customerResetPassword: (object) => {
    return fetch(`${megaUrl}/api/customer/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    }).then((response) => response.json());
  },
  getMenues: (options = {}) => {
    if (options.locale !== "catchAll") {
      let locale = "";
      if (options?.locale) {
        locale = `locale=${options.locale}`;
      }
      return fetch(`${url}/db/cms/menus?locale=${options.locale}`).then(
        (response) => response.json()
      );
    } else {
      return [];
    }
  },
  getBlogs: ({ locale, page, limit }) => {
    return fetch(
      `${url}/db/cms/blogs?locale=${locale}&page=${page}&limit=${limit}`
    ).then((responce) => responce.json());
  },
  getPagesWithoutBlog: ({ pageSlug, locale }) => {
    return fetch(`${url}/db/cms/page/${pageSlug}?locale=${locale}`).then(
      (responce) => responce.json()
    );
  },
  getBrands: (options = {}) => {
    return fetch(
      `${url}/db/attributes?code=brand&locale=${options.locale}`
    ).then((response) => response.json());
  },
  getPagesByIdsArray: ({ locale, ids }) => {
    return fetch(`${url}/db/get-pages?locale=${locale}&ids=${ids}`).then(
      (response) => response.json()
    );
  },
  geFilters: (options = {}, lang) => {
    if (options !== "all") {
      return fetch(`${url}/db/categories/${options}?locale=${lang}`).then(
        (response) => response.json()
      );
    } else {
      return fetch(`${url}/db/categories/all?locale=${lang}`).then((response) =>
        response.json()
      );
    }
  },
  /**
   * Returns category by slug.
   *
   * @param {string} slug
   * @param {object?} options
   * @param {number?} options.depth
   *
   * @return {Promise<object>}
   */
  getCategoryBySlug: (slug, options = {}) => {
    /**
     * This is what your API endpoint might look like:
     *
     * https://example.com/api/categories/power-tools.json?depth=2
     *
     * where:
     * - power-tools = slug
     * - 2           = options.depth
     */
    return fetch(`${url}/db/categories/slug/${slug}`).then((response) =>
      response.json()
    );

    // This is for demonstration purposes only. Remove it and use the code above.
    // return getCategoryBySlug(slug, options);
  },
  getConfigurabelConfigProduct: (id) => {
    return fetch(`${url}/db/product-configurable-config/${id}`).then((res) =>
      res.json()
    );
  },
  /**
   * Returns product.
   *
   * @param {string} slug
   *
   * @return {Promise<object>}
   */
  getProductBySlug: (slug, options = {}) => {
    let token = "";
    let lang = "en";
    // console.log(options, "optionsoptions");
    if (options.lang) {
      lang = options.lang;
    }
    ////console.log(lang, "lang");
    if (options.token) {
      token = `?token=${options.token}`;
    }
    // console.log(lang, "langlanglanglanglanglanglanglanglanglang");
    return fetch(`${url}/db/product/${slug}${token}?locale=${lang}`).then(
      (res) => res.json()
    );
  },
  /**
   * Returns array of related products.
   *
   * @param {string}  slug
   * @param {object?} options
   * @param {number?} options.limit
   *
   * @return {Promise<Array<object>>}
   */
  getFilters: (slug, options = {}) => {
    let lang = "hy";
    if (options.lang) {
      lang = options.lang;
    }

    let string = "";
    for (let key in options) {
      let value = options[key]?.code ? options[key]?.code : options[key];
      string += `&${key}=${value}`;
    }

    console.log(string, slug, "stringstringstring");
    return fetch(`${url}/db/filters?category_id=${slug}${string}`).then(
      (response) => response.json()
    );
  },

  getRelatedProducts: (categoryId, productId, options = {}) => {
    let lang = "en";
    let currency = "USD";
    if (options.lang) {
      lang = options.lang;
    }

    if (options.currency) {
      currency = options.currency.code;
    }
    return fetch(
      `${url}/db/related-products?limit=8&category_id=${categoryId}&product_id=${productId}&locale=${lang}&currency=${currency}`
    ).then((response) => response.json());
  },

  getUpSellProducts: (categoryId, productId, options = {}) => {
    let lang = "en";
    let currency = "USD";
    if (options.lang) {
      lang = options.lang;
    }

    if (options.currency) {
      currency = options.currency.code;
    }
    return fetch(
      `${url}/db/up-sell-products?limit=8&category_id=${categoryId}&product_id=${productId}&locale=${lang}&currency=${currency}`
    ).then((response) => response.json());
  },

  getCrossSellProducts: (categoryId, productId, options = {}) => {
    let lang = "en";
    let currency = "USD";
    if (options.lang) {
      lang = options.lang;
    }

    if (options.currency) {
      currency = options.currency.code;
    }
    return fetch(
      `${url}/db/cross-sell-products?limit=8&category_id=${categoryId}&product_id=${productId}&locale=${lang}&currency=${currency}`
    ).then((response) => response.json());
  },
  /**
   * Return products list.
   *
   * @param {object?} options
   * @param {number?} options.page
   * @param {number?} options.limit
   * @param {string?} options.sort
   * @param {Object.<string, string>?} filters
   *
   * @return {Promise<object>}
   */

  getSeachProducts: (query, options = {}) => {
    let locale = "en";
    let currency = "AMD";

    if (options.lang) {
      locale = options.lang;
    }

    if (options.currency) {
      currency = options.currency.code;
    }
    console.log(query, url, options.dbName, "queryqueryquery");
    return fetch(
      `/db/products?search=${query}&locale=${locale}&currency=${currency}`
    ).then((response) => response.json());
  },

  getProductsList: ({
    options = {},
    filters = {},
    location,
    /// locale,
    catID,
    // domain,
    dbName,
    window,
    limit,
  }) => {
    let currency = "AMD";
    if (options.currency) {
      currency = options.currency.code;
    }

    /// console.log(options.locale, "options.localeoptions.locale");
    const urlI = window && window.location ? window.location.href : "";
    let cat = qs.parse(location);
    let catId, index;
    index = urlI.indexOf("page");

    if (cat.category_id && urlI.indexOf("category_id") > 0) {
      catId = cat.category_id;
    }
    for (let filter in filters) {
      if (filters[filter] == "") {
        delete filters[filter];
      }
    }

    if (options.savings == "") {
      delete options.savings;
    }

    const categoryId = catId || catID;
    console.log(dbName ? `https://` + dbName : url, "getProductsList");
    if (
      qs.stringify(options) == "" &&
      qs.stringify(filters) == "" &&
      !location
    ) {
      return fetch(
        `${
          dbName ? `https://` + dbName : url
        }/db/products?limit=20&currency=${currency}&locale=${options.locale}${
          categoryId ? `&category_id=${categoryId}` : ""
        }`
      ).then((responce) => responce.json());
    } else {
      let string = `limit=20`;

      if (index > 0 && options?.page) {
        string += `&page=${options?.page}`;
        delete options["page"];
      }

      if (categoryId) {
        string += `&category_id=${categoryId}`;
      }

      if (qs.stringify(filters) != "") {
        string += `&${qs.stringify(filters)}`;
      }

      for (let key in options) {
        let value = options[key]?.code ? options[key]?.code : options[key];
        string += `&${key}=${value}`;
      }

      return fetch(
        `${dbName ? `https://` + dbName : url}/db/products?locale=${
          options.locale
        }&${string}`
      ).then((responce) => responce.json());
    }
  },
  getPaymentsMethods: (options = {}) => {
    let lang = "";
    if (options.local) {
      lang = options.local;
    }
    return fetch(url + `/api/payments?locale=${lang}`, {
      method: "GET",
    }).then((responce) => responce.json());
  },
  /**
   * Returns array of featured products.
   *
   * @param {object?} options
   * @param {number?} options.limit
   * @param {string?} options.category
   *
   * @return {Promise<Array<object>>}
   */
  getHomeProducts: (options = {}) => {
    let limit = 10;
    let lang = "en";
    let currency = "USD";

    if (options.lang) {
      lang = options.lang;
    }
    if (options.currency) {
      currency = options.currency.current.currentcode;
    }
    return fetch(
      `/db/home-products?locale=${lang}&currency=${currency}&limit=${limit}`
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));
  },
  getFeaturedProducts: (options = {}) => {
    let limit = 10;
    let lang = "en";
    let currency = "USD";

    if (options.lang) {
      lang = options.lang;
    }
    if (options.currency) {
      currency = options.currency.current.currentcode;
    }

    return fetch(
      `${url}/db/featured-products?locale=${lang}&currency=${currency}&limit=${limit}`
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));
  },
  /**
   * Returns array of latest products.
   *
   * @param {object?} options
   * @param {number?} options.limit
   * @param {string?} options.category
   *
   * @return {Promise<Array<object>>}
   */

  // getCrossSaleProducts: (slug, options = {}) => {
  //   let lang = "en";
  //   if (options.lang) {
  //     lang = options.lang;
  //   }
  //   return fetch(
  //     `${url}/api/relation?id=${slug}&locale=${lang}&relation=cross_sells`
  //   )
  //     .then((response) => response.json())
  //     .catch((err) => console.error(err));
  // },

  getNewProducts: (options = {}) => {
    let limit;
    let id = "";
    let lang = "en";
    let currency = "USD";

    if (options.lang) {
      lang = options.lang;
    }

    if (options.limit) {
      limit = options.limit;
    }

    if (options.currency) {
      currency = options.currency.current.code;
    }

    if (options.id) id = `category_id=${options.id}`;

    // newUrl for export during
    return fetch(
      `${url}/db/new-products?locale=${lang}&currency=${currency}&limit=${limit}`
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));

    // return fetch(`${url}/api/products?new=1&${id}&limit=${limit}`)
    //     .then((response) => response.json())
    //     .catch((err) => console.error(err));
  },
  getLatestProducts: (options = {}) => {
    let id = "";
    let limit = 10;
    let lang = "en";
    if (options.lang) {
      lang = options.lang;
    }

    if (options.limit) {
      limit = options.limit;
    }

    if (options.id) id = `category_id=${options.id}`;
    // return fetch(`${url}/api/products/232`)
    //     .then((response) => response.json()).catch(err => console.error(err))

    return (
      fetch(`${url}/db/products?${id}&limit=${limit}`)
        //     return fetch(`${url}/api/home/products?${id}&limit=${limit}`)
        .then((response) => response.json())
        .catch((err) => console.error(err))
    );
    // return fetch(`${url}/api/products?new=1&limit=${limit}&locale=${lang}`)
    //     .then((response) => response.json()).catch(err => console.error(err))

    // This is for demonstration purposes only. Remove it and use the code above.
    return getLatestProducts(options);
  },
  /**
   * Returns an array of top rated products.
   *
   * @param {object?} options
   * @param {number?} options.limit
   * @param {string?} options.category
   *
   * @return {Promise<Array<object>>}
   */
  getTopRatedProducts: (options = {}) => {
    /**
     * This is what your API endpoint might look like:
     *
     * https://example.com/api/shop/top-rated-products.json?limit=3&category=power-tools
     *
     * where:
     * - 3           = options.limit
     * - power-tools = options.category
     */
    // return fetch(`https://example.com/api/top-rated-products.json?${qs.stringify(options)}`)
    //     .then((response) => response.json());

    // This is for demonstration purposes only. Remove it and use the code above.
    return getTopRatedProducts(options);
  },
  /**
   * Returns an array of discounted products.
   *
   * @param {object?} options
   * @param {number?} options.limit
   * @param {string?} options.category
   *
   * @return {Promise<Array<object>>}
   */
  getDiscountedProducts: (options = {}) => {
    /**
     * This is what your API endpoint might look like:
     * https://example.com/api/shop/discounted-products.json?limit=3&category=power-tools
     *
     * where:
     * - 3           = options.limit
     * - power-tools = options.category
     */
    // return fetch(`https://example.com/api/discounted-products.json?${qs.stringify(options)}`)
    //     .then((response) => response.json());

    // This is for demonstration purposes only. Remove it and use the code above.

    return getDiscountedProducts(options);
  },
  /**
   * Returns an array of most popular products.
   *
   * @param {object?} options
   * @param {number?} options.limit
   * @param {string?} options.category
   *
   * @return {Promise<Array<object>>}
   */
  getPopularProducts: (options = {}) => {
    /**
     * This is what your API endpoint might look like:
     *
     * https://example.com/api/shop/popular-products.json?limit=3&category=power-tools
     *
     * where:
     * - 3           = options.limit
     * - power-tools = options.category
     */
    // return fetch(`https://example.com/api/popular-products.json?${qs.stringify(options)}`)
    //     .then((response) => response.json());

    //  .catch(error=>console.error(error));
    // This is for demonstration purposes only. Remove it and use the code above.
    return getPopularProducts(options);
  },
  /**
   * Returns search suggestions.
   *
   * @param {string}  query
   * @param {object?} options
   * @param {number?} options.limit
   * @param {string?} options.category
   *
   * @return {Promise<Array<object>>}
   */
  getSuggestions: (query, options = {}) => {
    let locale = "en";
    if (options.lang) {
      locale = options.locale;
    }
    return fetch(`${url}/db/search?search=${query}&locale=${locale}`)
      .then((response) => response.json())
      .catch((err) => console.error(err));
  },
  translations: (locale, dbName) => {
    console.log(domainUrl(`${dbName}/db/translations?locale=${locale}`));
    return fetch(domainUrl(`${dbName}/db/translations?locale=${locale}`))
      .then((response) => response.json())
      .catch((err) => console.error(err));
  },
};

export default shopApi;
