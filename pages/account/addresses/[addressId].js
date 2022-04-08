import React, { useEffect, useState } from "react";
import AccountPageEditAddress from "../../../components/account/AccountPageEditAddress";
import { useRouter } from "next/router";
import allActions from "../../../services/actionsArray";
import { generalProcessForAnyPage } from "../../../services/utils";
import store from "../../../store";

function Addresses({ locale, dispatches, dbName }) {
  const { dispatch } = store;
  const router = useRouter();
  useEffect(() => {
    // changeLocale(locale == "en" ? 1 : 6);
    for (let actionKey in dispatches) {
      dispatch(allActions[actionKey](dispatches[actionKey]));
      // dispatch(allActions[actionKey](props.dispatches[actionKey]));
    }
  }, [locale]);
  return (
    <AccountPageEditAddress
      dbName={dbName}
      addressId={router.query.addressId}
    />
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
