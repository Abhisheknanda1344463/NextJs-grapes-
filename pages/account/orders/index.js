import React, { useEffect, useState } from "react";

import AccountPageOrders from "../../../components/account/AccountPageOrders";
import allActions from "../../../services/actionsArray";
import { generalProcessForAnyPage } from "../../../services/utils";
import store from "../../../store";
function Orders({ locale, dispatches }) {
  const { dispatch } = store;
  useEffect(() => {
    for (let actionKey in dispatches) {
      dispatch(allActions[actionKey](dispatches[actionKey]));
    }
  }, []);
  return <AccountPageOrders />;
}

export async function getServerSideProps({ locale, locales, req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const {
    locale: defaultLocaleSelected,
    currency,
    dispatches: generalDispatches,
  } = await generalProcessForAnyPage(locale);
  const selectedLocale = locale !== "catchAll" ? locale : defaultLocaleSelected;

  // const parsedMetas = await metas.data.json();
  const dispatches = {
    ...generalDispatches.clientSide,
    ...generalDispatches.serverSide,
  };
  return {
    props: {
      locale: selectedLocale,
      dispatches,
    },
  };
}

export default Orders;
