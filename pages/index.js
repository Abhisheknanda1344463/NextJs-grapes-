import React, { useEffect } from "react";
//import Head from "next/head";
import store from "../store";
import { domainUrl } from "../helper";
// import { useSelector } from "react-redux"
// import serverSideActions from "../services/serverSide";
// import clientSideActions from "../services/clientSide";
import HomePageOne from "../components/home/HomePageOne";
import { generalProcessForAnyPage } from "../services/utils";
import allActions from "../services/actionsArray";
import { setDefaultCurrency } from '../store/rate'
import shopApi from "../api/shop";
import { MetaWrapper } from "../components/MetaWrapper";
import { useRouter } from "next/router";
function Home(props) {
  const {
    locale,
    ///  newProducts,
    featuredProducts,
    metas,
    dbName,
    dispatches: dispatchesNew,
    currency,
    domain,
    rate,
  } = props;
  const router = useRouter();
  const { dispatch } = store;
  const firstLoad = true;



  useEffect(() => {
    dispatch(setDefaultCurrency(currency))
    for (let actionKey in dispatchesNew) {
      dispatch(allActions[actionKey](dispatchesNew[actionKey]));
    }
  }, [locale, currency]);
  const metaTags = metas ? JSON.parse(metas[0].home_seo) : "";
  return (
    <MetaWrapper
      title={dbName}
      m_title={metaTags.meta_title || dbName}
      m_desc={metaTags.meta_description || dbName}
      m_key={metaTags.meta_keywords || dbName}
      m_img={`https://${dbName}/storage/${domain}/configuration/share_pic/share_pic.webp`}
    >
      <HomePageOne
        locale={locale}
        currency={currency}
        headerLayout="default"
        newProducts={props.newProducts}
        featuredProducts={featuredProducts}
        metas={metas}
        firstLoad={firstLoad}
        dbName={dbName}
        rate={rate}
        domain={domain}
      />
    </MetaWrapper>
  );
}

export async function getServerSideProps({ locale, locales, req, res }) {
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=10, stale-while-revalidate=59"
  // );
  const dbName = req.headers["x-forwarded-host"];
  var databaseName;
  var selectedCurency;

  var selectedRate;
  var parsed;
  ////CHECKING CURRENCY
  if (req.query.currencies != "") {
    selectedCurency = req.query.currencies;
  }

  ////GETTING DOMAIN
  if (dbName.includes(process.env.URL_NAME)) {
    var dataName = dbName.split(process.env.URL_NAME);
    databaseName = dataName[0];
    process.env.domainName = dbName;
    process.env.databaseName = databaseName;
  } else {
    process.env.domainName = dbName;
    databaseName =
      dbName.split(".")[0] == "www"
        ? dbName.split(".")[1]
        : dbName.split(".")[0];

    process.env.databaseName = databaseName;
  }


  const {
    locale: defaultLocaleSelected,
    currency,
    rate,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale, dbName, selectedCurency);

  if (req.query.currencies != "") {
    selectedCurency = currency;
  }

  ////GETTING RATE FOR CURRENCY
  if (req.query.currencies != "") {
    selectedRate = rate.currencies_new.find(
      (item) => item.code == selectedCurency
    );
  }
  const selectedLocale = locale != "catchAll" ? locale : defaultLocaleSelected;
  await shopApi
    .getHomeProducts(
      selectedLocale,
      selectedCurency,
      selectedRate?.exchange_rate?.rate || 1,
      dbName
    )
    .then((data) => {
      parsed = data;
    });

  const metas = await fetch(
    domainUrl(`${dbName}/db/get-meta?locale=${selectedLocale}`)
  );

  const data = await metas.json();
  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };



  return {
    props: {
      locale: selectedLocale,
      currency: selectedCurency,
      dbName,
      rate: selectedRate?.exchange_rate?.rate || 1,
      metas: data.data,
      featuredProducts: parsed.featuredProducts,
      newProducts: parsed.newProduct,
      dispatches,
      domain: databaseName,
    },
  };
}

export default Home;
