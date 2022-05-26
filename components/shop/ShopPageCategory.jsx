// react
import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useLayoutEffect,
} from "react";

// third-party
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import queryString from "query-string";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet-async";
import { FormattedMessage } from "react-intl";

// application
import shopApi from "../../api/shop";
import { url } from "../../services/utils";
import ProductsView from "./ProductsView";
import Pagination from "../shared/Pagination";
import PageHeader from "../shared/PageHeader";
import BlockLoader from "../blocks/BlockLoader";
import CategorySidebar from "./CategorySidebar";
import { sidebarClose } from "../../store/sidebar";
import WidgetFilters from "../widgets/WidgetFilters";
import CategorySidebarItem from "./CategorySidebarItem";
import {
  setInitialMinPrice,
  setInitialMaxPrice,
} from "../../store/general/generalActions";

// data stubs
function parseQueryOptions(history) {
  const query = queryString.parse(history);
  const optionValues = {};

  if (typeof query.brand === "string") {
    optionValues.brand = query.brand;
  }

  if (typeof query.savings === "string") {
    optionValues.savings = query.savings;
  }
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

function parseQueryFilters(history) {
  const query = queryString.parse(history);
  const filterValues = {};
  Object.keys(history).forEach((param) => {
    const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);
    if (!mr) {
      return;
    }
    const filterSlug = mr[1];
    filterValues[filterSlug] = history[param];
  });
  return filterValues;
}

function parseQuery(history) {
  return [parseQueryOptions(history), parseQueryFilters(history)];
}

function buildQuery(options, filters) {
  const params = {};

  if (options.savings !== "") {
    params.savings = options.savings;
  }
  if (options.brand !== "") {
    params.brand = options.brand;
  }

  if (options.search !== "") {
    params.search = options.search;
  }
  params.category_id = options.category_id;
  if (options.page !== "") {
    params.page = options.page;
  }

  if (options.limit !== 12) {
    params.limit = options.limit;
  }

  if (options.sort !== "default") {
    params.sort = options.sort;
  }

  Object.keys(filters)
    .filter((x) => x !== "category" && !!filters[x])
    .forEach((filterSlug) => {
      params[`filter_${filterSlug}`] = filters[filterSlug];
    });

  return queryString.stringify(params, { encode: false });
}

function buildInitialFilter(options, filters) {
  const params = {};

  if (options.savings !== "") {
    params.savings = options.savings;
  }
  if (options.brand !== "") {
    params.brand = options.brand;
  }

  if (options.search !== "") {
    params.search = options.search;
  }
  params.category_id = options.category_id;
  if (options.page !== "") {
    params.page = options.page;
  }

  if (options.limit !== 12) {
    params.limit = options.limit;
  }

  if (options.sort !== "default") {
    params.sort = options.sort;
  }

  Object.keys(filters)
    .filter((x) => x !== "category" && !!filters[x])
    .forEach((filterSlug) => {
      params[filterSlug] = filters[filterSlug];
    });

  return queryString.stringify(params, { encode: false });
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
  productsListIsLoading: false,
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

export function reducer(state, action) {
  switch (action.type) {
    case "FETCH_CATEGORY_SUCCESS":
      return {
        ...state,
        init: true,
        categoryIsLoading: false,
        category: action.category,
      };
    case "FETCH_PRODUCTS_LIST":
      return { ...state, productsListIsLoading: true };
    case "FETCH_PRODUCTS_LIST_SUCCESS":
      return {
        ...state,
        productsListIsLoading: false,
        productsList: action.productsList,
      };
    case "SET_OPTION_VALUE":
      return {
        ...state,
        options: { ...state.options, page: 1, [action.option]: action.value },
      };
    case "SET_FILTER_VALUE":
      return {
        ...state,
        options: { ...state.options, page: 1 },
        filters: {
          ...state.filters,
          [action.filter]:
            state.filters[action.filter] && action.filter !== "price"
              ? state.filters[action.filter] +
                (action.value ? "," + action.value : "")
              : action.value,
        },
      };

    case "REMOVE_FILTER_VALUE":
      let dot = state.filters[action.filter].split(",");
      const index = dot.indexOf(action.value);
      if (index > -1) {
        dot.splice(index, 1);
      }
      dot = dot.join(",");
      return {
        ...state,
        options: { ...state.options, page: 1 },
        filters: { ...state.filters, [action.filter]: dot },
      };

    case "RESET_FILTERS":
      return { ...state, options: {}, filters: {} };
    case "RESET":
      return state.init ? initialState : state;
    default:
      throw new Error();
  }
}

function init(state) {
  const [options, filters] = parseQuery(state);
  return { ...state, options, filters };
}

function ShopPageCategory(props) {
  const {
    locale,
    columns,
    currency,
    viewMode,
    brandList,
    categorySlug,
    productsList: allProduct,
    dbName,
    setChange,
    page: setPageNumber,
    sidebarPosition,
    initialMaxPrice,
    initialMinPrice,
    setInitialMinPrice,
    setInitialMaxPrice,
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const history = useRouter();
  const [brands, setBrands] = useState(brandList);
  const [catID, setCatID] = useState(props.categoryId);
  const [catTitle, setTitle] = useState(props.categoryTitle);
  const { page: selectedPage } = router.query;
  const [page, setPage] = useState(selectedPage);

  const offcanvas = columns === 3 ? "mobile" : "always";
  const prevPageRef = useRef();
  const prevCatIdRef = useRef();
  const prevLocaleRef = useRef();
  const prevCurrencyRef = useRef();
  const prevCategorySlugRef = useRef();
  const prevStateOptionsRef = useRef({ current: null });
  const prevStateFiltersRef = useRef({ current: null });
  const prevLocationSearchRef = useRef({ current: null });

  // ////Areg dont change
  const [productsList, setProductsList] = useState(allProduct);

  const [maxPrice, setMaxPrice] = useState(
    allProduct.dispatches.setInitialMaxPrice
  );
  const [minPrice, setMinPrice] = useState(
    allProduct.dispatches.setInitialMinPrice
  );
  const [filtersData, setFilters] = useState();
  const { query } = useRouter();
  // const [dataFromQuery, setDataFromQuery] = useState({});

  useEffect(() => {
    //Commented By Tigran And Manvel need to refactor
    let params = Object.keys(router.query).length > 0 ? router.query : "";
    let data = init(params);
    for (const [key, value] of Object.entries(data.filters)) {
      dispatch({
        type: "SET_FILTER_VALUE",
        filter: key,
        value: value,
      });
    }

    prevPageRef.current = page;
    prevLocaleRef.current = router.locale;
    prevCatIdRef.current = catID;
    prevCurrencyRef.current = currency.code;
    prevCategorySlugRef.current = categorySlug;
    prevStateFiltersRef.current = state.filters || null;
    prevStateOptionsRef.current = state.options || null;
    prevLocationSearchRef.current = history.search || null;
  }, []);

  useEffect(() => {
    if (
      prevStateOptionsRef.current != state.options ||
      prevPageRef.current != page
    ) {
      const query = buildQuery({ ...state.options, page: page }, state.filters);
      // setDataFromQuery(buildQuery({...state.options, page: page}, state.filters))
      prevStateFiltersRef.current = state.filters;
      prevStateOptionsRef.current = state.options;
      const location = `${window.location.pathname}${
        query
          ? `?cat_id=${props.categoryId}&${query}`
          : `?cat_id=${props.categoryId}`
      }`;
      router.push(location, location);
    }
  }, [state.filters, state.options, page]);

  useEffect(() => {
    prevCategorySlugRef.current = categorySlug;
    setProductsList(allProduct);
  }, [router.locale, categorySlug, state.options, allProduct]);

  useEffect(() => {
    setBrands(brandList);
    setMaxPrice(allProduct.dispatches.setInitialMaxPrice);
    setMinPrice(allProduct.dispatches.setInitialMinPrice);
  }, [router.locale, categorySlug, state.options]);

  if (state.productsListIsLoading && !productsList) {
    return <BlockLoader />;
  }

  const breadcrumb = [
    {
      title: <FormattedMessage id="home" defaultMessage="Գլխավոր" />,
      url: url.home(),
    },
    {
      title: (
        <FormattedMessage
          id={
            props.categorySlug.charAt(0).toUpperCase() +
            props.categorySlug.slice(1)
          }
          defaultMessage={props.categoryTitle}
        />
      ),
      url: url.catalog(),
    },
  ];
  let pageTitle = "Shop";
  let content = null;

  // const setSavings = (e, type) => {
  //   e.preventDefault();
  //   let inp = document.getElementById("savings_fm_id");
  //   if (type == 0) {
  //     if (inp.checked === true)
  //       dispatch({
  //         type: "SET_OPTION_VALUE",
  //         option: "savings",
  //         value: "",
  //       });
  //     else
  //       dispatch({
  //         type: "SET_OPTION_VALUE",
  //         option: "savings",
  //         value: true,
  //       });
  //   } else {
  //     if (inp.checked === false)
  //       dispatch({
  //         type: "SET_OPTION_VALUE",
  //         option: "savings",
  //         value: "",
  //       });
  //     else
  //       dispatch({
  //         type: "SET_OPTION_VALUE",
  //         option: "savings",
  //         value: true,
  //       });
  //   }
  // };

  const productsView = (
    <ProductsView
      catID={catID}
      categorySlug={categorySlug}
      /// isLoading={state.productsListIsLoading}
      productsList={productsList}
      options={state.options}
      filters={state.filters}
      dispatch={dispatch}
      layout={viewMode}
      grid={`grid-${columns}-${columns > 3 ? "full" : "sidebar"}`}
      offcanvas={offcanvas}
      pageFrom="category"
    />
  );

  const sidebarComponent = (
    <CategorySidebar offcanvas={offcanvas}>
      <CategorySidebarItem>
        <div
          className={`widget-categories widget-categories--history--${history} widget`}
        >
          {/* <div className="savings_fms">
            <label
              // className="m-0 mr-2"
              style={{ color: "inherit", display: "flex", alignItems: "center",justifyContent: "space-between", width: "100%", paddingRight:"5px"}}
              onClick={(e) => setSavings(e, 0)}
            >
              <h4
                style={{
                  color: "inherit",
                }}
                className="widget__title"
              >
                <FormattedMessage
                  id="filter-sale"
                  key="Sale"
                  defaultMessage="Sale"
                />
              </h4>

            <span className="input-check__body">
            <input
              className="input-check__input"
              type="checkbox"
              id="savings_fm_id"
              // id="input-check__input"
              checked={state.options.savings ? true : false}
              onClick={(e) => setSavings(e, 1)}
            />
          </div> */}
          <div>
            <WidgetFilters
              filters={brands}
              dispatch={dispatch}
              stateFilters={state}
              values={state.filters}
              catID={catID}
              maxPrice={maxPrice}
              minPrice={minPrice}
              initialMaxPrice={props.initialMaxPrice}
              initialMinPrice={props.initialMinPrice}
            />
          </div>
        </div>
      </CategorySidebarItem>
    </CategorySidebar>
  );

  if (columns > 3 && productsList.length > 0) {
    content = (
      <div className="container_fm">
        <div className="block">{productsView}</div>
        {sidebarComponent}
      </div>
    );
  } else {
    const sidebar = (
      <div className="shop-layout__sidebar">{sidebarComponent}</div>
      // <></>
    );
    content = (
      <div className="container_fm category-container">
        <div className="category-title">
          <h1>
            <FormattedMessage
              id={
                props.categorySlug.charAt(0).toUpperCase() +
                props.categorySlug.slice(1)
              }
              defaultMessage={props.categoryTitle}
            />
          </h1>
        </div>

        <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
          {/*{console.log(brands.length, "brands length")}*/}
          {brands.length > 0 ? sidebarPosition === "start" && sidebar : " "}
          <div className="shop-layout__content">
            <div className="block block-fms">{productsView}</div>
          </div>
          {sidebarPosition === "end" && sidebar}
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="cat_blocks_fms">
        <PageHeader header={pageTitle} breadcrumb={breadcrumb} />
        {content}
        <div className="block">
          <div className="posts-view">
            <div className="posts-view__pagination">
              {productsList &&
              //////FIXME CHANGE TO LIMIT
              productsList.data.length < 20 &&
              page == 1 ? (
                <></>
              ) : (
                <Pagination
                  current={page}
                  siblings={2}
                  total={props.productsList.total}
                  onPageChange={(nextPage) => setPage(nextPage)}
                />
              )}
              {/*<Pagination*/}
              {/*  current={page}*/}
              {/*  siblings={2}*/}
              {/*  total={props.productsList.total}*/}
              {/*  onPageChange={(nextPage) => setPage(nextPage)}*/}
              {/*/>*/}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

ShopPageCategory.propTypes = {
  /**
   * Category slug.
   */

  categorySlug: PropTypes.string,
  /**
   * number of product columns (default: 3)
   */
  columns: PropTypes.number,
  /**
   * mode of viewing the list of products (default: 'grid')
   * one of ['grid', 'grid-with-features', 'list']
   */
  viewMode: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

ShopPageCategory.defaultProps = {
  columns: 3,
  viewMode: "grid",
  sidebarPosition: "start",
};

const mapStateToProps = (state) => {
  return {
    sidebarState: state.sidebar,
    page: state.category,
    locale: state.locale.code,
    currency: state.currency.current,
    initialMaxPrice: state.general.initialMaxPrice,
    initialMinPrice: state.general.initialMinPrice,
  };
};

const mapDispatchToProps = (dispatch) => ({
  sidebarClose: (payload) => dispatch(sidebarClose(payload)),
  setInitialMinPrice: (payload) => dispatch(setInitialMinPrice(payload)),
  setInitialMaxPrice: (payload) => dispatch(setInitialMaxPrice(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategory);
