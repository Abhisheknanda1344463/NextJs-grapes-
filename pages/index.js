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

  return (
    <React.Fragment>
      {/*<Head>*/}
      {/*  <meta*/}
      {/*    property="og:image"*/}
      {/*    name="image"*/}
      {/*    content={`${dbName}/storage/${domain}/configuration/share_pic/share_pic.webp`}*/}
      {/*  />*/}
      {/*</Head>*/}
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
    </React.Fragment>
  );
}

export async function getServerSideProps({locale, locales, req, res}) {
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=10, stale-while-revalidate=59"
  // );
  const dbName = req.headers["x-forwarded-host"];

  var databaseName;
  ////   console.log(dbName.includes(".zegashop.com"));
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

  // console.log(databaseName, "name in index js")

  /// console.log(dbName, "reqreqreq");
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale, dbName);
  // console.log(req.domainName, dbName, "reqreqreq");

  const selectedLocale = locale != "catchAll" ? locale : defaultLocaleSelected;
  // console.log(
  //   domainUrl(
  //     dbName + `/db/home-products?locale=${selectedLocale}&currency=${currency}`
  //   ),
  //   "asdsads"
  // );
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

  // console.log(data.data, "metas in homepage")

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
