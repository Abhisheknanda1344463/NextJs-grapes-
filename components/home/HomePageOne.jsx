import React, { useEffect, useState, memo, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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
  const [confs, setConfs] = useState();
  const router = useRouter();
  const domain = useSelector((state) => state.general.domain);
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
    <FormattedMessage id="homepage_title_text" defaultMessage="" />
  );
  const homepage_intro_text = (
    <FormattedMessage id="homepage_intro_text" defaultMessage="" />
  );
  const history = useRouter();
  const prevCurrencyCodeRef = useRef();
  const prevLocaleCodeRef = useRef();
  const metaTags = props?.metas ? JSON.parse(props.metas[0].home_seo) : "";
  const messageTitle = homepage_title_text.props.defaultMessage;
  const messageIntro = homepage_intro_text.props.defaultMessage;

  const checkQuantity = (obj) => {
    return obj.filter((item, index) => {
      if (item.qty === 0) {
        if (
          (hasBackorder === "1" && hasOutOfStock === "1") ||
          (hasBackorder === "1" && hasOutOfStock !== "1")
        ) {
          // console.log("order - true, instock - true", index);
          return 10;
        } else if (hasBackorder !== "1" && hasOutOfStock !== "1") {
          // console.log("display: none, index -", index);
          return null || <></>;
        } else if (hasBackorder !== "1" && hasOutOfStock === "1") {
          // console.log("order - false, instock - false", index);
          return 30;
        }
      }
      return item;
    });
  };
  const getHomeProducts = () => {
    try {
      fetch(
        apiUrlWithStore(
          `/db/home-products?locale=${router.locale}&currency=AMD&limit=6`
        )
      )
        .then((response) => response.json())
        .then((res) => {
          if (res && res.newProduct) {
            const setBestArray = Object.values(res.newProduct).filter(
              (product) => {
                if (product?.name && product?.description) {
                  return product;
                }
              }
            );
            setBest(setBestArray);
          }
          if (res && res.featuredProducts) {
            const setfeaturedArray = Object.values(res.featuredProducts).filter(
              (product) => {
                if (product?.name && product?.description) {
                  return product;
                }
              }
            );
            setfeatured(setfeaturedArray);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (prevCurrencyCodeRef.current != "AMD") {
      prevCurrencyCodeRef.current = "AMD";
      prevLocaleCodeRef.current = router.locale;
    }
    if (!firstLoad) {
      getConfs();
      getHomeProducts();
    }
    setFirstLoad(false);
    ////  getFeaturedProducts();
  }, [router.locale]);

  const getConfs = () => {
    try {
      fetch(
        apiUrlWithStore(
          `/db/core-conf?locale=${router.locale}&currency=AMD&limit=6`
        )
      )
        .then((response) => response.json())
        .then((res) => dispatch({ type: "SET_CONFIGS", payload: res }));
    } catch (e) {
      console.log(e);
    }
  };
  // useEffect(() => {
  //   if (
  //     prevCurrencyCodeRef.current != currency.current.code ||
  //     prevLocaleCodeRef.current != selectedData
  //   ) {
  //     prevCurrencyCodeRef.current = currency.current.code;
  //     prevLocaleCodeRef.current = selectedData;
  //   }
  //   getConfs();
  // }, [router.locale]);

  return (
    <React.Fragment>
      <Head>
        <title>{dbName}</title>
        <meta name="title" content={metaTags.meta_title} />
        <meta name="description" content={metaTags.meta_description} />
        <meta name="keywords" content={metaTags.meta_keywords} />
        <meta
          name="image"
          content={`${dbName}/storage/${domain}/configuration/share_pic/share_pic.webp`}
        />
      </Head>
      <BlockSlideShow history={history} />
      {messageTitle || messageIntro ? (
        <div className="container welcome-title">
          <h1>{messageTitle !== "" && messageTitle}</h1>

          <p>{messageIntro !== "" && messageIntro}</p>
        </div>
      ) : null}

      {bestsellers?.length ? (
        <BlockProducts
          layout="large-first"
          customer={customer}
          title={newCollection}
          dbName={dbName}
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
