import React, { useEffect, useState } from "react";
import AccountPageNewAddresses from "../../../components/account/AccountPageNewAddresses";
import allActions from "../../../services/actionsArray";
import { generalProcessForAnyPage } from "../../../services/utils";
import store from "../../../store";
import { useRouter } from "next/router";

function Addresses({ locale, dispatches, dbName }) {
  const { dispatch } = store;
  useEffect(() => {
    // changeLocale(locale == "en" ? 1 : 6);
    for (let actionKey in dispatches) {
      dispatch(allActions[actionKey](dispatches[actionKey]));
      // dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [locale]);
  const { query } = useRouter();

  return (
    <AccountPageNewAddresses addressId={query.addressId} dbName={dbName} />
  );
}

export async function getServerSideProps({ locale, locales, req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const dbName = req.headers["x-forwarded-host"];
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
      dbName: dbName,
    },
  };
}

export default Addresses;
