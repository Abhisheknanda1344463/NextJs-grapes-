import React, { useEffect, useState, memo, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { setMetaPath, setMetaTags } from "../../store/general";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import BlockProducts from "../blocks/BlockProducts";
import BlockSlideShow from "../blocks/BlockSlideShow";
import { apiUrlWithStore, urlLink } from "../../helper";
// import BlockFeatures from "../blocks/BlockFeatures";
// import payload from "../builder/state.json";
// import Heading from "../builder/heading/Heading.jsx";
// import allActions from "../../services/actionsArray";

function HomePageOne(props) {
  const dispatch = useDispatch();
  const [bestsellers, setBest] = useState(props.newProducts);
  const [featured, setfeatured] = useState(props.featuredProducts);
  const [dbName, setDomain] = useState(props.dbName);
  const [domainName, _] = useState(props.domain);
  // console.log(props, "props domain")
  const [confs, setConfs] = useState();
  const router = useRouter();
  // const domain = useSelector((state) => state.general.domain);
  const hasBackorder = useSelector(
    (state) =>
      state.general.coreConfigs.catalog_inventory_stock_options_backorders
  );
  const hasOutOfStock = useSelector(
    (state) =>
      state.general.coreConfigs.catalog_products_homepage_out_of_stock_items
  );
  const selectedData = useSelector((state) => state.locale.code);
  const customer = useSelector((state) => state.customer);
  const currency = useSelector((state) => state.currency);
  const [firstLoad, setFirstLoad] = useState(props.firstLoad);
  const [componenet, setComponnent] = useState([]);
  const [componenetData, setComponnentData] = useState([]);
  const newCollection = (
    <FormattedMessage id="shop-title" defaultMessage="Shop" />
  );
  const saleCollection = (
    <FormattedMessage id="shop.one" defaultMessage="Saled products" />
  );
  const homepage_title_text = (
    <FormattedMessage id="homepage_title_text" defaultMessage="Home" />
  );
  const homepage_intro_text = (
    <FormattedMessage id="homepage_intro_text" defaultMessage="Home Page" />
  );
  const history = useRouter();
  const prevCurrencyCodeRef = useRef();
  const prevLocaleCodeRef = useRef();
  const metaTags = props?.metas ? JSON.parse(props.metas[0].home_seo) : "";
  const messageTitle = homepage_title_text.props.defaultMessage;
  const messageIntro = homepage_intro_text.props.defaultMessage;
  dispatch(setMetaPath(dbName));
  dispatch(setMetaTags(metaTags));

  useEffect(() => {
    if (prevCurrencyCodeRef.current != props.currency) {
      prevCurrencyCodeRef.current = props.currency;
      setBest(props.newProducts);
      setfeatured(props.featuredProducts);
      // prevLocaleCodeRef.current = router.locale;
    }
    // if (!firstLoad) {
    //   getHomeProducts();
    // }
    // setFirstLoad(false);
    ////  getFeaturedProducts();
  }, [router.locale, props.currency]);

  // const domName = dbName.split(".")[0];
  // console.log(domName, "dom name in reactr")
  return (
    <React.Fragment>
      <BlockSlideShow history={history} />
      {messageTitle || messageIntro ? (
        <div className="container welcome-title">
          <h1>{homepage_title_text}</h1>

          <p>{homepage_intro_text}</p>
        </div>
      ) : null}
      {bestsellers?.length ? (
        <BlockProducts
          layout="large-first"
          customer={customer}
          title={newCollection}
          dbName={dbName}
          rate={props.rate}
          // homepage_title_text={homepage_title_text}
          // homepage_intro_text={homepage_intro_text}
          products={bestsellers}
          addInClass={bestsellers.length <= 4 ? "small" : "larg"}
        />
      ) : null}
      {/* {Object.values(componenetData).length > 0 &&
        componenetData.map((item) => {
          const data = Object.values(item)[0];
          switch (data.content) {
            case "Heading":
              return <Heading item={data} />;
            default:
              return;
          }
        })} */}
      {featured?.length ? (
        <BlockProducts
          layout="large-first"
          customer={customer}
          dbName={dbName}
          rate={props.rate}
          products={featured}
          title={saleCollection}
          addInClass={featured.length <= 4 ? "small" : "larg"}
        />
      ) : null}

      {/* <BlockFeatures /> */}
    </React.Fragment>
  );
}

export default memo(HomePageOne);
