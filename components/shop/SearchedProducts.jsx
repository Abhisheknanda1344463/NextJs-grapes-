import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import queryString from "query-string";
import ProductsView from "./ProductsView";
import shopApi from "../../api/shop";
import { reducer } from "./ShopPageCategory";
import { FormattedMessage } from "react-intl";

export default function SearchedProducts(props) {
  const { searchedItem } = props;
  const currency = useSelector((state) => state.currency);

  function init(state) {
    const [options, filters] = parseQuery(window.location.search);
    return { ...state, options, filters };
  }

  function parseQuery(location) {
    return [parseQueryOptions(location), parseQueryFilters(location)];
  }

  function parseQueryOptions(location) {
    const query = queryString.parse(location);
    const optionValues = {};

    if (typeof query.category_id === "string") {
      optionValues.category_id =
        typeof query.category_id === "number"
          ? parseInt(query.category_id)
          : query.category_id;
    }
    if (typeof query.search === "string") {
      optionValues.search = query.search;
    }
    if (typeof query.page === "string") {
      optionValues.page = parseFloat(query.page);
    }
    if (typeof query.limit === "string") {
      optionValues.limit = parseFloat(query.limit);
    }
    if (typeof query.sort === "string") {
      optionValues.sort = query.sort;
    }

    return optionValues;
  }

  function parseQueryFilters(location) {
    const query = queryString.parse(location);
    const filterValues = {};

    Object.keys(query).forEach((param) => {
      const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

      if (!mr) {
        return;
      }

      const filterSlug = mr[1];

      filterValues[filterSlug] = query[param];
    });

    return filterValues;
  }

  const initialState = {
    init: false,
    /**
     * Indicates that the category is loading.
     */
    categoryIsLoading: true,
    /**
     * Category object.
     */
    category: null,
    /**
     * Indicates that the products list is loading.
     */
    productsListIsLoading: true,
    /**
     * Products list.
     */
    productsList: null,
    /**
     * Products list options.
     *
     * options.page:  number - Current page.
     * options.limit: number - Items per page.
     * options.sort:  string - Sort algorithm.
     */
    options: {},
    /**
     * Products list filters.
     *
     * filters[FILTER_SLUG]: string - filter value.
     */
    filters: {},
  };

  const customer = useSelector((state) => state.customer);
  // const [state, dispatch] = useReducer(reducer, initialState, init);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fill, Setfill] = useState([]);

  const currentLanguage = useSelector((state) => state.locale.code);
  const [products, setProducts] = useState();

  useEffect(() => {
    const options = { lang: currentLanguage, currency: currency.current.code };
    shopApi.getSeachProducts(searchedItem, options).then((items) => {
      setProducts(items);
    });
  }, [searchedItem]);

  let foundProducts;
  if (products) {
    foundProducts = (
      <div>
        <h2 className="text-center mb-5">
          <FormattedMessage
            id="search-resaults"
            defaultMessage="Search results"
          />
        </h2>
        <ProductsView
          customer={customer}
          productsList={products}
          options={state.options}
          filters={fill}
          dispatch={dispatch}
          forPage={"search"}
        />
      </div>
    );
  }

  if (!products) {
    foundProducts = (
      <div className="search-loading-empty">
        <div className="block-loader__spinner" />;
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div className="shop-layout__content">
          <div className="">
            {products && products.data.length <= 0 ? (
              <div className="text-center">
                <h1>
                  <FormattedMessage
                    id="noMatching"
                    defaultMessage="No matching items"
                  />
                </h1>
              </div>
            ) : (
              foundProducts
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
