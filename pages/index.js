import React, { useEffect } from "react";
import Head from "next/head";
import store from "../store";
import { domainUrl } from "../helper";
import { useSelector } from "react-redux"
import serverSideActions from "../services/serverSide";
import clientSideActions from "../services/clientSide";
import HomePageOne from "../components/home/HomePageOne";
import { generalProcessForAnyPage } from "../services/utils";
import allActions from "../services/actionsArray";
import shopApi from "../api/shop";
import {MetaWrapper} from "../components/MetaWrapper"
function Home({
                locale,
                newProducts,
                featuredProducts,
                metas,
                dbName,
                dispatches: dispatchesNew,
                currency,
                domain,
                rate,
              }) {
  const {dispatch} = store;
  const firstLoad = true;
  // const domain = useSelector((state) => state.general.domain);
  useEffect(() => {
    for (let actionKey in dispatchesNew) {
      dispatch(allActions[actionKey](dispatchesNew[actionKey]));
    }
  }, [locale,rate]);

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
        newProducts={newProducts}
        featuredProducts={featuredProducts}
        metas={metas}
        firstLoad={firstLoad}
        dbName={dbName}
        rate={rate}
        domain={domain}
      />
    </MetaWrapper>
    // <>
    //   <Head>
    //     <title>{dbName}</title>
    //     <meta name="title" content={metaTags.meta_title || dbName}/>
    //     <meta name="description" content={metaTags.meta_description || dbName}/>
    //     <meta name="keywords" content={metaTags.meta_keywords || dbName}/>
    //     <meta property="og:title" name="title" content={metaTags.meta_title || dbName}/>
    //     <meta property="og:description" name="description" content={metaTags.meta_description || dbName}/>
    //     <meta property="og:keywords" name="keywords" content={metaTags.meta_keywords || dbName}/>
    //     <meta
    //       property="og:image"
    //       name="image"
    //       content={`https://${dbName}/storage/${domain}/configuration/share_pic/share_pic.webp`}
    //     />
    //     <meta property="og:type" content="website"/>
    //     <meta name="twitter:card" content="summary_large_image"/>
    //     <meta name="twitter:title" content={metaTags.meta_title || dbName}/>
    //     <meta name="twitter:description" content={metaTags.meta_description || dbName}/>
    //     <meta name="twitter:image"
    //           content={`https://${dbName}/storage/${domain}/configuration/share_pic/share_pic.webp`}/>
    //   </Head>
    //   <HomePageOne
    //     locale={locale}
    //     currency={currency}
    //     headerLayout="default"
    //     newProducts={newProducts}
    //     featuredProducts={featuredProducts}
    //     metas={metas}
    //     firstLoad={firstLoad}
    //     dbName={dbName}
    //     domain={domain}
    //   />
    // </>
  );
}

export async function getServerSideProps({locale, locales, req, res}) {
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=10, stale-while-revalidate=59"
  // );
  const dbName = req.headers["x-forwarded-host"];
  var databaseName;
  var selectedCurency;
  var selectedCurency;
  var selectedRate;
  var parsed;
  ////CHECKING CURRENCY
  if (req.query.currencies != "") {
    selectedCurency = req.query.currencies;
  } else {
    selectedCurency = currency;
  }

  ////GETTING DOMAIN
  if (dbName.includes(".zegashop.com")) {
    var dataName = dbName.split(".zegashop.com");
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
      selectedRate?.exchange_rate.rate || 1,
      dbName
    )
    .then((data) => {
      console.log(data, "datadatadata");
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
      rate: selectedRate?.exchange_rate.rate || 1,
      metas: data.data,
      featuredProducts: parsed.featuredProducts,
      newProducts: parsed.newProduct,
      dispatches,
      domain: databaseName,
    },
  };
}

export default Home;
