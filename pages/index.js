import React, { useEffect } from "react";
import store from "../store";
import { domainUrl } from "../helper";
import serverSideActions from "../services/serverSide";
import clientSideActions from "../services/clientSide";
import HomePageOne from "../components/home/HomePageOne";
import { generalProcessForAnyPage } from "../services/utils";
import allActions from "../services/actionsArray";
function Home({
  locale,
  newProducts,
  featuredProducts,
  metas,
  dbName,
  dispatches: dispatchesNew,
  currency,
}) {
  const { dispatch } = store;
  const firstLoad = true;

  useEffect(() => {
    for (let actionKey in dispatchesNew) {
      dispatch(allActions[actionKey](dispatchesNew[actionKey]));
    }
  }, []);

  return (
    <div>
      <HomePageOne
        locale={locale}
        currency={currency}
        headerLayout="default"
        newProducts={newProducts}
        featuredProducts={featuredProducts}
        metas={metas}
        firstLoad={firstLoad}
        dbName={dbName}
      />
    </div>
  );
}

export async function getServerSideProps({ locale, locales, req, res }) {
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=10, stale-while-revalidate=59"
  // );
  const dbName = req.headers["x-forwarded-host"];

  /// console.log(dbName, "reqreqreq");
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale, dbName);
  console.log(req.domainName, dbName, "reqreqreq");

  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;
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
    },
  };
}

export default Home;
