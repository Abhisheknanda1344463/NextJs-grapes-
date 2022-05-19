import React, {useEffect} from "react";
import Head from "next/head";
import store from "../store";
import {domainUrl} from "../helper";
import {useSelector} from "react-redux"
import serverSideActions from "../services/serverSide";
import clientSideActions from "../services/clientSide";
import HomePageOne from "../components/home/HomePageOne";
import {generalProcessForAnyPage} from "../services/utils";
import allActions from "../services/actionsArray";

function Home({
                locale,
                newProducts,
                featuredProducts,
                metas,
                dbName,
                dispatches: dispatchesNew,
                currency,
                domain,
              }) {
  const {dispatch} = store;
  const firstLoad = true;
  // const domain = useSelector((state) => state.general.domain);
  useEffect(() => {
    for (let actionKey in dispatchesNew) {
      dispatch(allActions[actionKey](dispatchesNew[actionKey]));
    }
  }, [locale]);

  const metaTags = metas ? JSON.parse(metas[0].home_seo) : "";

  return (
    <>
      <Head>
        <title>{dbName}</title>
        <meta name="title" content={metaTags.meta_title || dbName}/>
        <meta name="description" content={metaTags.meta_description || dbName}/>
        <meta name="keywords" content={metaTags.meta_keywords || dbName}/>
        <meta property="og:title" name="title" content={metaTags.meta_title || dbName}/>
        <meta property="og:description" name="description" content={metaTags.meta_description || dbName}/>
        <meta property="og:keywords" name="keywords" content={metaTags.meta_keywords || dbName}/>
        <meta
          property="og:image"
          name="image"
          content={`https://${dbName}/storage/${domain}/configuration/share_pic/share_pic.webp`}
        />
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={metaTags.meta_title || dbName}/>
        <meta name="twitter:description" content={metaTags.meta_description || dbName}/>
        <meta name="twitter:image"
              content={`https://${dbName}/storage/${domain}/configuration/share_pic/share_pic.webp`}/>
      </Head>
      <HomePageOne
        locale={locale}
        currency={currency}
        headerLayout="default"
        newProducts={newProducts}
        featuredProducts={featuredProducts}
        metas={metas}
        firstLoad={firstLoad}
        dbName={dbName}
        domain={domain}
      />
    </>
  );
}

export async function getServerSideProps({locale, locales, req, res}) {
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=10, stale-while-revalidate=59"
  // );
  const dbName = req.headers["x-forwarded-host"];

  var databaseName;

  if (dbName.includes(".zegashop.com")) {
    var dataName = dbName.split(".zegashop.com");
    console.log(dataName, "dataname in app js");
    databaseName = dataName[0];
    process.env.domainName = dbName;

    process.env.databaseName = databaseName;
  } else {
    process.env.domainName = dbName;
    databaseName = dbName.split(".")[0] == "www" ? dbName.split(".")[1] : dbName.split(".")[0];

    process.env.databaseName = databaseName;
  }

  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale, dbName);

  const selectedLocale = locale != "catchAll" ? locale : defaultLocaleSelected;
  const response = await fetch(
    domainUrl(
      dbName + `/db/home-products?locale=${selectedLocale}&currency=${currency}`
    )
  );
  const parsed = await response.json();
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
      currency,
      dbName,
      metas: data.data,
      featuredProducts: parsed.featuredProducts,
      newProducts: parsed.newProduct,
      dispatches,
      domain: databaseName
    },
  };
}

export default Home;
